import os
import uuid
import requests
import hashlib
from dotenv import load_dotenv
import logging

from django.urls import reverse
from django.conf import settings

from pay.serializers import InitPaySerializer
from order.models import Order
from pay.repositories import pay_rep


load_dotenv()

notification_logger = logging.getLogger('notification')


def init(order_id: uuid.UUID, amount: int):
    url = 'https://securepay.tinkoff.ru/v2/Init'
    headers = {
        'Content-Type': 'application/json',
    }
    payload = {
        'TerminalKey': os.getenv('TERMINAL_KEY'),
        'Amount': amount * 100,
        'OrderId': str(order_id),
        'Description': 'Оплата заказа',
        'PayType': 'O',
        'Language': 'ru',
        'NotificationURL': settings.SITE_DOMEN + reverse('pay:notification'),
        'SuccessURL': settings.SITE_DOMEN + '/profile/my-orders/',
    }

    payload = _sign_by_token(payload)
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    if data["Success"]:
        payment_id = data['PaymentId']
        payment = pay_rep.create(id=payment_id, amount=amount, status=data['Status'][0])
        order = Order.objects.filter(pk=order_id).first()
        order.payment = payment
        order.save()
        return data['PaymentURL']
    return False
    
def update_status(data):
    token = data.pop('Token')
    if token == _get_token(_normalize_data_like_json(data)):
        pay_rep.update_state(data)

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
