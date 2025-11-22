import logging
from celery import shared_task

from .services import cdek_service
from .services.dto import CdekOrderRegisterDTO
from order.services import good_service
from order.models import Order, OrderItem
from order.exceptions import NotFoundOrderByPayment, OrderError
from pay.models import PromocodeType


@shared_task
def register_order(payment_id):
    cdek_logger = logging.getLogger('cdek')
    cdek_logger.info('Начинаю регистрацию заказа в СДЭК')
    try:
        order = (
            Order.objects
                .select_related("cdek")
                .filter(payment_id=payment_id)
                .values("id", "cdek__email", "cdek__user_fullname", "cdek__tariff_code", "cdek__city_code", "cdek__city", "cdek__address", "cdek__pvz_code", "user__phone")
        )
        if not order:
            raise NotFoundOrderByPayment()
        order = order[0]
        
        # Если СДЭКА нет, то и регистрировать его не надо(в случае что заказ цифровой)
        if order['cdek__user_fullname'] is None:
            return

        goods_ids: list[int] = []
        for good in OrderItem.objects.filter(order_id=order['id']).values('good_variant', 'quantity'):
            goods_ids.extend([good['good_variant']] * good['quantity'])

        goods: list[dict] = good_service.get_all_goods_info(goods_ids)

        # Добавляем в отправление физические сертификаты (если есть)
        order_obj = (
            Order.objects.filter(pk=order['id'])
            .prefetch_related('certificates')
            .first()
        )
        if order_obj:
            physical_certs = order_obj.certificates.filter(type=PromocodeType.PHYSICAL.value)
            certs_box_sizes = [17, 12, 1]
            cert_weight = 100  # условный вес сертификата, граммы
            for cert in physical_certs:
                goods.append(
                    {
                        'id': f'cert-{cert.pk}',
                        'name': 'Физический сертификат',
                        'size': 0,
                        'box_sizes': certs_box_sizes,
                        'weight': cert_weight,
                    }
                )
        

        resp = cdek_service.register_order(
            CdekOrderRegisterDTO(
                order_id=order['id'],
                tariff_code=order['cdek__tariff_code'],
                user_fullname=order['cdek__user_fullname'],
                email=order['cdek__email'],
                city_code=order['cdek__city_code'],
                city=order['cdek__city'],
                address=order['cdek__address'],
                pvz_code=order['cdek__pvz_code'],
                phone=order['user__phone'],
                packages=cdek_service.get_packages_for_register_order(goods),
            )
        )
        cdek_logger.info(f'Получен ответ при регистрации заказа в СДЭК: {resp}')
    except OrderError as e:
        cdek_logger.info(e.detail)
    except Exception as e:
        cdek_logger.info(str(e))
