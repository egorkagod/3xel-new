import os
import requests
from dotenv import load_dotenv
from order.dto.cdek import CdekOrderRegisterDTO, CdekDeliveryGetPriceDTO
from order.models import GoodVariant
from order.exceptions import CdekBadRequest

from django.core.cache import cache


load_dotenv()


USE_TEST_CDEK = os.getenv("USE_TEST_CDEK", "False").lower() == "true"
if USE_TEST_CDEK:
    CDEK_URL = os.getenv('CDEK_TEST_URL')
    CDEK_ID = os.getenv('CDEK_TEST_CLIENT_ID')
    CDEK_PASSWORD = os.getenv('CDEK_TEST_CLIENT_PASSWORD')
else:
    CDEK_URL = os.getenv('CDEK_URL')
    CDEK_ID = os.getenv('CDEK_CLIENT_ID')
    CDEK_PASSWORD = os.getenv('CDEK_CLIENT_PASSWORD')


def get_cdek_token() -> str:
    token = cache.get('cdek_token')
    if not token:
        url = f'{CDEK_URL}/v2/oauth/token'

        payload = {
            'grant_type': 'client_credentials',
            'client_id': CDEK_ID,
            'client_secret': CDEK_PASSWORD,
        }
        response = requests.post(url, data=payload)
        if not response.status_code == 200:
            raise CdekBadRequest(f'Ошибка при получении токена: {response.text}')
        resp = response.json()
        token = resp.get('access_token')
        expires_in = resp.get('expires_in')
        cache.set('cdek_token', token, timeout=expires_in)
    return token


def get_packages(goods: list[int]) -> list:
    if not goods:
        return []

    unique_ids = list(set(goods))
    variants = (
        GoodVariant.objects
        .select_related("good")
        .filter(id__in=unique_ids)
        .values("id", "good__cost", "good__box_sizes", "good__weight", "good__name", "good__size")
    )

    meta = {v["id"]: {"box_sizes": v["good__box_sizes"], "weight": v["good__weight"], "name": v["good__name"], "size": v["good__size"], "cost": v["good__cost"]} for v in variants}

    packages = []
    for good in meta.values():
        cnt = 1
        length, width, height = good['box_sizes'].split('-')
        pkg = {
            "number": str(cnt),
            "weight": good['weight'],
            "length": length,
            "width": width,
            "height": height,
            "items": [
                {
                    "name": f'{good['name']} размера {good['size']}см',
                    "amount": 1,
                    "weight": good['weight'],
                    "cost": 0,
                    "payment": {
                        "value": 0,
                    }
                }
            ]
        }
        packages.append(pkg)
        cnt += 1

    return packages


def register_order(dto: CdekOrderRegisterDTO):
    url = f'{CDEK_URL}/v2/orders'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {get_cdek_token()}'
    }
    recipient = {
        'name': dto.user_fullname,
        'email':dto.email,
        'phones':[
            {'number': dto.phone}
        ],
    }
    payload = {
        'type': 1,
        'number': dto.order_id,
        'tariff_code': dto.tariff_code,
        'shipment_point': os.getenv('CDEK_PVZ_CODE'),
        'to_location':{
            'code':  dto.city_code,
            'city': dto.city,
            'address': dto.address,
        },
        'recipient': recipient,
        'packages': dto.packages,
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 202:
        raise CdekBadRequest(f'Ошибка при регистрации заказа в сдэке: {response.text}')
    resp = response.json()
    return resp


def get_delivery_price(dto: CdekDeliveryGetPriceDTO):
    url = f'{CDEK_URL}/v2/calculator/tariff'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {get_cdek_token()}'
    }
    payload = {
        'tariff_code': dto.tariff_code,
        'from_location': {
            'code':  os.getenv('CDEK_SHIPMENT_CITY_CODE'),
            'city': os.getenv('CDEK_SHIPMENT_CITY'),
            'address': os.getenv('CDEK_SHIPMENT_ADDRESS'),
        },
        'to_location':{
            'code':  dto.city_code,
            'city': dto.city,
            'address': dto.address,
        },
        'packages': dto.packages,
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise CdekBadRequest(response.text)
    resp = response.json()
    return resp.get('delivery_sum')