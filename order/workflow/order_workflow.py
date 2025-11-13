import math

from .dto import OrderCreateWorkflowDTO
from root.services.dto import UserChangeDataDTO
from root.services import user_service
from order.services import order_service, good_service
from order.services.dto import OrderCreateServiceDTO
from order.exceptions import OrderCreationError
from cdek.services import cdek_service
from cdek.services.dto import CdekDeliveryGetPriceDTO, CdekOrderCreateDTO
from pay.services import pay_service


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

    # Получаем информацию о товарах
    goods: list[dict] = good_service.get_all_goods_info(dto.goods, is_repeated=dto.previous_order_id is not None)
    goods_amount = good_service.get_goods_amount(goods)

    # Подсчет итоговой стоимости заказа
    delivery_cost = cdek_service.get_delivery_price(
        CdekDeliveryGetPriceDTO(
            tariff_code=dto.cdek.tariff_code,
            city_code=dto.cdek.city_code,
            city=dto.cdek.city,
            address=dto.cdek.address,
            packages=cdek_service.get_packages_for_delivery_cost(goods),
        )
    )
    if not delivery_cost:
        raise OrderCreationError('Ошибка при получении цены доставки')
    total_amount = goods_amount + math.ceil(delivery_cost * 1.1)

    # Создание заказа в бд
    order_id = order_service.create(
        OrderCreateServiceDTO(
            user_id=dto.user_id,
            goods=dto.goods,
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
    payment_url = pay_service.init(
        pay_service.InitPayServiceDTO(
            order_id=order_id,
            goods=goods,
            delivery_cost=delivery_cost,
            amount=total_amount,
            email=email,
        )
    )

    # Возврат платежной ссылки
    return payment_url
