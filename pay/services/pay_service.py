import os
import uuid
import requests
import hashlib
from dotenv import load_dotenv
import logging
from pydantic import BaseModel

from django.urls import reverse
from django.conf import settings

from order.models import Order
from pay.repositories import pay_rep


load_dotenv()

notification_logger = logging.getLogger('notification')

class InitPayServiceDTO(BaseModel):
    order_id: uuid.UUID
    goods: list
    amount: int
    email: str

def init(data: InitPayServiceDTO):
    url = 'https://securepay.tinkoff.ru/v2/Init'
    headers = {
        'Content-Type': 'application/json',
    }
    # Build Receipt.Items from provided goods with applied discounts
    receipt_items = create_receipt_items(data.goods)
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
    data = response.json()

    if data["Success"]:
        payment_id = int(data['PaymentId'])
        # Tinkoff returns full status string, store it as is (matches choices)
        payment = pay_rep.create(id=payment_id, amount=payload['Amount'] // 100, status=data['Status'])
        order = Order.objects.filter(pk=payload['OrderId']).first()
        order.payment = payment
        order.save()
        return data['PaymentURL']
    return False
    
def update_status(data):
    token = data.pop('Token')
    if token == _get_token(_normalize_data_like_json(data)):
        pay_rep.update_state(data)

def create_receipt_items(goods: list) -> list:
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
    return items
def _normalize_data_like_json(data):
    result = dict()
    for key, value in data.items():
        match value:
            case bool():
                result[key] = str(value).lower()
            case int():
                result[key] = str(value)
            case _:
                result[key] = value
    return result

def _sign_by_token(payload: dict):
    payload['Token'] = _get_token(payload)
    return payload

def _get_token(payload: dict):
    payload = payload.copy()
    # payload = _filter_payload(payload)
    payload['Password'] = os.getenv('TERMINAL_PASSWORD')
    string = ''.join([str(item[1]) for item in sorted(payload.items())])
    bytes = string.encode('utf-8')
    hash_object = hashlib.sha256(bytes)
    token = hash_object.hexdigest()
    return token

def _filter_payload(payload):
    need_keys = ('TerminalKey', 'Amount', 'OrderId', 'Description')
    result = {}
    for key in payload:
        if key in need_keys:
            result[key] = payload[key]
    return result
