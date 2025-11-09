import os
import requests
import hashlib
from dotenv import load_dotenv
import logging
from pydantic import BaseModel
import json

from django.urls import reverse
from django.conf import settings

from order.exceptions import NotFoundOrderByPayment
from order.models import Order
from order.services.cdek_service import get_packages as cdek_build_packages
from pay.repositories import pay_rep
from pay.models import PaymentStatus
from order.services import cdek_service
from order.dto.cdek import CdekOrderRegisterDTO


load_dotenv()

notification_logger = logging.getLogger('notification')

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
        'TerminalKey': os.getenv('TERMINAL_KEY'),
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
    signed['Password'] = os.getenv('TERMINAL_PASSWORD')
    if token == _get_token(signed):
        pay_rep.update_state(payload)

        # Создание заказа в СДЭК
        if PaymentStatus(data['Status'].upper()) == PaymentStatus.CONFIRMED:
            payment_id = data['PaymentId']
            order = (
                Order.objects
                    .select_related("cdek")
                    .filter(payment_id=payment_id)
                    .values("id", "cdek__email", "cdek__user_fullname", "cdek__tariff_code", "cdek__city_code", "cdek__city", "cdek__address")
            )
            if not order:
                raise NotFoundOrderByPayment()
            order = order[0]

            cdek_service.register_order(
                CdekOrderRegisterDTO(
                    order_id=order['id'],
                    tariff_code=order['cdek__tariff_code'],
                    user_fullname=order['cdek__user_fullname'],
                    email=order['cdek__email'],
                    city_code=order['cdek__city_code'],
                    city=order['cdek__city'],
                    address=order['cdek__address'],
                    phone=order['cdek__phone'],
                    packages=build_order_packages(order['id']),
                )
            )

    else:
        notification_logger.warning('Invalid notification token: %s', payload)


def build_order_packages(order_id: int) -> list:
    order = Order.objects.filter(pk=order_id).prefetch_related('items').first()
    if not order:
        return []
    variant_ids: list[int] = []
    for item in order.items.all():
        if item.good_variant_id and item.quantity:
            variant_ids.extend([item.good_variant_id] * int(item.quantity))
    if not variant_ids:
        return []
    return cdek_build_packages(variant_ids)


def create_receipt_items(goods: list, delivery_cost: int) -> list:
    # goods: list of dicts like {'good__name': str, 'cost': int} per item occurrence
    grouped: dict[tuple[str, int], int] = {}
    for g in goods:
        name = g['good__name']
        price = int(g['cost'])
        key = (name, price)
        grouped[key] = grouped.get(key, 0) + 1

    items = []
    for (name, price), qty in grouped.items():
        items.append({
            'Name': name,
            'Price': price * 100,
            'Quantity': qty,
            'Amount': price * 100 * qty,
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
    signed['Password'] = os.getenv('TERMINAL_PASSWORD')

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
