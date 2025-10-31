import os
import uuid
import requests
import hashlib
from dotenv import load_dotenv
import logging
from pydantic import BaseModel
import json

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
    resp = response.json()

    # Tinkoff responds with key 'Success' (boolean)
    if resp.get("Success"):
        payment_id = int(resp['PaymentId'])
        # Tinkoff returns full status string, store it as is (matches choices)
        payment = pay_rep.create(id=payment_id, amount=payload['Amount'] // 100, status=resp['Status'])
        order = Order.objects.filter(pk=payload['OrderId']).first()
        order.payment = payment
        order.save()
        return resp['PaymentURL']
    # Log failure details to payment log
    logging.getLogger('pay').info('Init failed: %s', resp)
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
            # Tax code per merchant settings. Required: vat5 on all items.
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
    # Build signature as per Tinkoff v2: add Password, sort by keys, concatenate stringified values
    # Include nested objects by JSON-dumping them with stable key order and no spaces
    signed = {k: v for k, v in payload.items() if k != 'Token'}
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

def _filter_payload(payload):
    """Unused utility kept for reference."""
    return {k: payload[k] for k in payload if k in ('TerminalKey','Amount','OrderId','PayType','Description')}
