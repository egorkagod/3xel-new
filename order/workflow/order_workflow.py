import math
import logging

from .dto import OrderCreateWorkflowDTO
from root.services.dto import UserChangeDataDTO
from root.services import user_service
from order.services import order_service, good_service
from order.services.dto import OrderCreateServiceDTO
from order.exceptions import OrderCreationError
from cdek.services import cdek_service
from cdek.services.dto import CdekDeliveryGetPriceDTO, CdekOrderCreateDTO
from pay.services import pay_service, promo_service


def create(dto: OrderCreateWorkflowDTO) -> str | bool:
    '''Полный флоу создания заказа'''

    # Обновляем данные пользователя
    user_service.change_data(
        UserChangeDataDTO(
            user_id=dto.user_id,
            name=dto.name,
            surname=dto.surname,
            patronymic=dto.patronymic,
            phone=dto.phone,
        )
    )

    # Сертификаты digital/physical
    physical_certs = []
    digital_certs = []
    if dto.certificates:
        certs_box_sizes = ['17', '12', '1']
        cert_weight = 0.1
        for cert in dto.certificates:
            if cert['type'] == 'physical':
                cert = {'type': 'physical', 'box_sizes': certs_box_sizes, 'weight': cert_weight, 'denomination': cert['denomination']}
                physical_certs.append(cert)
            else:
                cert = {'type': 'digital', 'denomination': cert['denomination']}
                digital_certs.append(cert)
    certificates = physical_certs + digital_certs

    # Получаем информацию о товарах и сертификатах
    certs_amount = _get_certs_amount(certificates)
    
    goods = []
    goods_amount = 0
    if dto.goods:
        goods: list[dict] = good_service.get_all_goods_info(dto.goods, is_repeated=dto.previous_order_id is not None)
        goods_amount = good_service.get_goods_amount(goods)

    # Формируем физические товары
    if goods or physical_certs:
        goods.extend(physical_certs)

    # Подсчет итоговой стоимости
    delivery_cost = 0
    if dto.cdek:
        delivery_cost = cdek_service.get_delivery_price(
            CdekDeliveryGetPriceDTO(
                tariff_code=dto.cdek.tariff_code,
                city_code=dto.cdek.city_code,
                city=dto.cdek.city,
                address=dto.cdek.address,
                packages=cdek_service.get_packages_for_delivery_cost(goods),
            )
        )
        if delivery_cost is None:
            raise OrderCreationError('Ошибка при получении цены доставки')
    delivery_cost = math.ceil(delivery_cost * 1.1)
    promocode_amount = promo_service.confirm(dto.promocode)
    total_amount = goods_amount + certs_amount + delivery_cost - promocode_amount
    logging.getLogger('order').info(f'Goods amount: {goods_amount}, Delivery: {delivery_cost}')

    # Создание заказа в бд
    order_id = order_service.create(
        OrderCreateServiceDTO(
            user_id=dto.user_id,
            promocode=dto.promocode,
            goods=dto.goods,
            certificates=certificates,
            video_id=dto.video_id,
            previous_order_id=dto.previous_order_id,
            comment = dto.wishes,
            amount=total_amount
        )
    )

    # Проверяем что заказ успешно создался
    if not order_id:
        raise OrderCreationError

    # Получение email пользователя и составление ФИО
    fullname = f'{dto.surname or ''} {dto.name or ''} {dto.patronymic or ''}'.strip()
    email = user_service.get_email(dto.user_id)
    if not email:
        raise OrderCreationError('Не удалось получить email пользователя')

    # Сохранение в бд информации для СДЭК (создание CdekOrder)
    if (physical_certs or goods) and dto.cdek:
        cdek_service.create_order(
            CdekOrderCreateDTO(
                order_id=order_id,
                email=email,
                user_fullname=fullname,
                tariff_code=dto.cdek.tariff_code,
                city_code=dto.cdek.city_code,
                city=dto.cdek.city,
                address=dto.cdek.address,
            )
        )

    # Инициализация платежа в Tbank
    if total_amount > 0:
        payment_url = pay_service.init(
            pay_service.InitPayServiceDTO(
                order_id=order_id,
                goods=goods,
                certificates=certificates,
                delivery_cost=delivery_cost,
                amount=total_amount,
                email=email,
            )
        )
    else:
        payment_url = 'https://3xel.ru/profile'

    # Возврат платежной ссылки
    return payment_url


def _get_certs_amount(certs: list[dict], key='denomination') -> int:
    sum = 0
    for cert in certs:
        sum += cert[key]
    return sum