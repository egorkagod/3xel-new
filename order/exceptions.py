from typing import Optional

from rest_framework import status


class OrderError(Exception):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Ошибка при обработке заказа'

    def __init__(self, detail: Optional[str] = None, status_code: Optional[int] = None):
        message = detail or self.default_detail
        super().__init__(message)
        self.detail = message
        self.status_code = status_code or self.status_code


class InvalidGoodsError(OrderError):
    default_detail = 'Некорректный список товаров.'
    status_code = status.HTTP_400_BAD_REQUEST


class OrderCreationError(OrderError):
    default_detail = 'Не удалось создать заказ.'
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR


class PaymentInitializationError(OrderError):
    default_detail = 'Не удалось инициировать платёж.'
    status_code = status.HTTP_502_BAD_GATEWAY


class CdekBadRequest(OrderError):
    default_detail = 'Ошибка при обращении к сдэку'
    status_code = status.HTTP_400_BAD_REQUEST