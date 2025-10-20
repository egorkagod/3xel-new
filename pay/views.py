import logging

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiResponse

from pay.services import pay_service


pay_logger = logging.getLogger('pay')


class NotificationView(APIView):
    allowed_ips = {
        '91.194.226.0/23',
        '91.218.132.0/24',
        '91.218.133.0/24',
        '91.218.134.0/24',
        '91.218.135.0/24',
        '212.49.24.0/24',
        '212.233.80.0/24',
        '212.233.81.0/24',
        '212.233.82.0/24',
        '212.233.83.0/24',
        '91.194.226.181/32',   # Тестовая среда
    }

    @extend_schema(
        operation_id='tinkoff_notification',
        summary='Webhook от Tinkoff',
        description='Получает уведомления об изменении статуса платежа.',
        request=OpenApiTypes.OBJECT,
        responses={
            status.HTTP_200_OK: OpenApiResponse(OpenApiTypes.STR, description='Ответ сервера `OK`'),
        },
    )
    def post(self, request):
        data = request.data
        pay_logger.info(f"{data}")
        pay_service.update_status(data)
        return HttpResponse("OK", status=status.HTTP_200_OK)
