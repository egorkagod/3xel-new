from typing import Optional

from rest_framework import status


class OrderError(Exception):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Order error'

    def __init__(self, detail: Optional[str] = None, status_code: Optional[int] = None):
        message = detail or self.default_detail
        super().__init__(message)
        self.detail = message
        self.status_code = status_code or self.status_code


class InvalidGoodsError(OrderError):
    default_detail = 'Invalid goods list.'
    status_code = status.HTTP_400_BAD_REQUEST


class OrderCreationError(OrderError):
    default_detail = 'Failed to create order.'
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR


class PaymentInitializationError(OrderError):
    default_detail = 'Failed to initialize payment.'
    status_code = status.HTTP_502_BAD_GATEWAY
