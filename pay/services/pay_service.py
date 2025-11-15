import requests
import hashlib
import logging
from pydantic import BaseModel
import json
from collections import defaultdict

from django.urls import reverse
from django.conf import settings
from env import env_settings

from order.models import Order
from pay.repositories import pay_rep
from pay.models import PaymentStatus
from cdek.tasks import register_order


class InitPayServiceDTO(BaseModel):
    order_id: int
    goods: list
    amount: int
    delivery_cost: int
    email: str

def init(data: InitPayServiceDTO):
    url = 'https://securepay.tinkoff.ru/v2/Init'
    headers = {
        'Content-Type': 'application/json',
    }
    # Build Receipt.Items from provided goods with applied discounts
    receipt_items = create_receipt_items(data.goods, data.delivery_cost)
    payload = {
        'TerminalKey': env_settings.TERMINAL_KEY,
        'Amount': data.amount * 100,
        'OrderId': str(data.order_id),
        'PayType': 'O',
        'Language': 'ru',
        'NotificationURL': settings.SITE_DOMEN + reverse('pay:notification'),
        'FailURL': settings.SITE_DOMEN + reverse('pay:notification'),
        'SuccessURL': settings.SITE_DOMEN + '/profile/',
        'Receipt': {
            'Email': data.email,
            'Taxation': 'usn_income',
            'Items': receipt_items,
        },
    }

    payload = _sign_by_token(payload)
    response = requests.post(url, headers=headers, json=payload)
    resp = response.json()

    # Tinkoff responds with key 'Success' (boolean)
    if resp.get("Success"):
        payment_id = int(resp['PaymentId'])
        # Tinkoff returns full status string, store it as is (matches choices)
        payment = pay_rep.create(id=payment_id, amount=payload['Amount'] // 100, status=resp['Status'])
        order = Order.objects.filter(pk=int(payload['OrderId'])).first()
        order.payment = payment
        order.save()
        return resp['PaymentURL']
    # Log failure details to payment log
    logging.getLogger('pay').info('Init failed: %s', resp)
    return False
    
def update_status(data):
    payload = dict(data)
    token = payload.pop('Token', None)
    # Reproduce Tinkoff token algorithm: add merchant password
    signed = {k: v for k, v in payload.items()}
    signed['Password'] = env_settings.TERMINAL_PASSWORD
    if token == _get_token(signed):
        pay_rep.update_state(payload)

        # Создание заказа в СДЭК при успешном платеже
        if PaymentStatus(data['Status'].upper()) == PaymentStatus.CONFIRMED:
            logger = logging.getLogger('cdek')
            logger.info('Заказ оплачен, инициируется создание заказа в СДЭК')
            payment_id = data['PaymentId']
            try:
                logger.info(f'Пробуем отправить задачу в Celery, broker={settings.CELERY_BROKER_URL}')
                res = register_order.delay(payment_id)
                logger.info(f'Задача отправлена, id={res.id}')
            except Exception as e:
                logger.exception(f'Ошибка при отправке задачи в Celery: {e}')
        else:
            logging.getLogger('pay').warning('Получен неверный токен при попытке обновить статус платежа')

def create_receipt_items(goods: list[dict], delivery_cost: int) -> list[dict]:
    grouped = defaultdict(int)
    
    for good in goods:
        key = (good['name'], good['discounted_price'])
        grouped[key] += 1

    items = []
    for (name, price), quantity in grouped.items():
        items.append({
            'Name': name,
            'Price': price * 100,
            'Quantity': quantity,
            'Amount': price * 100 * quantity,
            'Tax': 'vat5',
        })

    items.append({
        'Name': 'Доставка',
        'Price': delivery_cost * 100,
        'Quantity': 1,
        'Amount': delivery_cost * 100,
        'Tax': 'none',
    })

    return items


def _sign_by_token(payload: dict):
    signed = {}
    for k, v in payload.items():
        if k == 'Token':
            continue
        if isinstance(v, (dict, list)):  # <-- игнорируем вложенные структуры
            continue
        signed[k] = v
    signed['Password'] = env_settings.TERMINAL_PASSWORD

    token = _get_token(signed)
    payload['Token'] = token
    return payload

def _get_token(payload: dict):
    payload = payload.copy()
    def _stringify(v):
        if isinstance(v, bool):
            return str(v).lower()
        if isinstance(v, (int, float)):
            return str(v)
        if isinstance(v, (dict, list)):
            return json.dumps(v, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
        return str(v)
    string = ''.join([_stringify(item[1]) for item in sorted(payload.items())])
    bytes = string.encode('utf-8')
    hash_object = hashlib.sha256(bytes)
    token = hash_object.hexdigest()
    return token
