import requests
from django.core.cache import cache

from env import env_settings
from .dto import CdekOrderRegisterDTO, CdekDeliveryGetPriceDTO, CdekOrderCreateDTO
from cdek.models import CdekOrder
from order.services import order_service
from order.exceptions import CdekBadRequest


if env_settings.USE_TEST_CDEK == "true":
    CDEK_URL = env_settings.CDEK_TEST_URL
    CDEK_ID = env_settings.CDEK_TEST_CLIENT_ID
    CDEK_PASSWORD = env_settings.CDEK_TEST_CLIENT_PASSWORD
else:
    CDEK_URL = env_settings.CDEK_URL
    CDEK_ID = env_settings.CDEK_CLIENT_ID
    CDEK_PASSWORD = env_settings.CDEK_CLIENT_PASSWORD


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


def get_packages_for_register_order(goods: list[dict]) -> list:
    packages = []
    cnt = 1
    for good in goods:
        length, width, height = good['box_sizes']
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
                    "ware_key": good['id'],
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


def get_packages_for_delivery_cost(goods: list[dict]) -> list:
    packages = []
    for good in goods:
        cnt = 1
        length, width, height = good['box_sizes']
        pkg = {
            "number": str(cnt),
            "weight": good['weight'],
            "length": length,
            "width": width,
            "height": height,
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
        'shipment_point': env_settings.CDEK_PVZ_CODE,
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


def get_delivery_price(dto: CdekDeliveryGetPriceDTO) -> int | None:
    if not dto.packages:
        return 0
    
    url = f'{CDEK_URL}/v2/calculator/tariff'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {get_cdek_token()}'
    }
    payload = {
        'tariff_code': dto.tariff_code,
        'from_location': {
            'code': env_settings.CDEK_SHIPMENT_CITY_CODE,
            'city': env_settings.CDEK_SHIPMENT_CITY,
            'address': env_settings.CDEK_SHIPMENT_ADDRESS,
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
    return resp.get('delivery_sum', None)


def create_order(dto: CdekOrderCreateDTO):
    cdek_order = CdekOrder.objects.create(
        email=dto.email,
        user_fullname=dto.user_fullname,
        tariff_code=dto.tariff_code,
        city_code=dto.city_code,
        city=dto.city,
        address=dto.address,
    )

    order_obj = order_service.get(dto.order_id)
    order_obj.cdek = cdek_order
    order_obj.save(update_fields=["cdek"]) 
    