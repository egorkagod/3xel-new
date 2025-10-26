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
    # Load order with user and items to build receipt lines
    # Fetch order instance
    order = (
        Order.objects.select_related('user')
        .prefetch_related('items__good_variant', 'items__good_variant__good')
        .filter(pk=order_id)
        .first()
    )
    if not order:
        return False

    # Use user's email for receipt and DATA
    user_email = (order.user.email or '').strip()

    # Build receipt items list with VAT 5% per item
    receipt_items = []
    for it in order.items.all():
        gv = it.good_variant
        if not gv:
            # Skip if variant is missing
            continue
        name_parts = [getattr(gv.good, 'name', None) or 'Товар']
        if getattr(gv, 'size', None):
            name_parts.append(f"{gv.size}см")
        if getattr(gv, 'colorName', None):
            name_parts.append(str(gv.colorName))
        item_name = ' '.join(map(str, name_parts))[:128]

        price_kopecks = int(gv.cost) * 100
        quantity = int(it.quantity)
        amount_kopecks = price_kopecks * quantity
        receipt_items.append({
            'Name': item_name,
            'Price': price_kopecks,
            'Quantity': quantity,
            'Amount': amount_kopecks,
            'Tax': 'vat5',
        })
    payload = {
        'TerminalKey': os.getenv('TERMINAL_KEY'),
        'Amount': amount * 100,
        'OrderId': str(order_id),
        'Description': 'Оплата заказа',
        'PayType': 'O',
        'Language': 'ru',
        'NotificationURL': settings.SITE_DOMEN + reverse('pay:notification'),
        'FailURL': settings.SITE_DOMEN + reverse('pay:notification'),
        'SuccessURL': settings.SITE_DOMEN + '/profile/',
        # Optional extra customer data section
        'DATA': {
            'Email': user_email,
        },
        'Receipt': {
            'Email': user_email,
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
        payment = pay_rep.create(id=payment_id, amount=amount, status=data['Status'])
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
