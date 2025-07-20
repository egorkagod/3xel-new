import os
import requests
import hashlib
from dotenv import load_dotenv

from django.urls import reverse
from django.conf import settings

from pay.serializers import InitPaySerializer
from order.models import Order


load_dotenv()


def init(order_id, amount):
    url = 'https://securepay.tinkoff.ru/v2/Init'
    headers = {
        'Content-Type': 'application/json',
    }
    payload = {
        'TerminalKey': os.getenv('TERMINAL_KEY'),
        'Amount': amount,
        'OrderId': order_id,
        'Description': 'Оплата заказа',
        'PayType': 'O',
        'Language': 'ru',
        'NotificationURL': settings.SITE_DOMEN + reverse('pay:notification'),
        'SuccessURL': settings.SITE_DOMEN + '', #TODO Добавить ссылку на профиль пользователя
    }

    payload = _sign_by_token(payload)
    response = requests.post(url, headers=headers, json=payload)

    serializer = InitPaySerializer(data=response.json())
    serializer.is_valid(raise_exception=True)

    if serializer.validated_data['success']:
        order = Order.objects.filter(pk=order_id).first()
        order.payment_id = serializer.validated_data['payment_id']
        order.save()
        return serializer.validated_data['payment_url']
    else:
        return False
    
def _sign_by_token(payload):
    payload['Token'] = _get_token(payload)
    return payload

def _get_token(payload): # сделать с мапой
    payload = _filter_payload(payload)
    payload['Password'] = os.getenv('TERMINAL_PASSWORD')
    string = ' '.join(str(item[1]) for item in sorted(payload.items()))
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
