import os
import uuid
import requests
import hashlib
from dotenv import load_dotenv

from django.urls import reverse
from django.conf import settings

from pay.serializers import InitPaySerializer
from order.models import Order
from pay.repositories import pay_rep


load_dotenv()


def init(order_id: uuid.UUID, amount: int):
    notificate_url = reverse('pay:notification')
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

    # serializer = InitPaySerializer(data=response.json())
    # serializer.is_valid(raise_exception=True)

    if data:
        payment_id = data['PaymentId']
        payment = pay_rep.create(id=payment_id, amount=amount, status=data['Status'][0])
        order = Order.objects.filter(pk=order_id).first()
        order.payment = payment
        order.save()
        return data['PaymentURL']
    else:
        return False
    
def update_state(data): # TODO проверка токена не работает 
    # token = data.pop('Token') 
    # if token == _get_token(data):
    pay_rep.update_state(data)
    
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
