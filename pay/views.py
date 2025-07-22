import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from pay.services import pay_service


pay_logger = logging.getLogger('pay')

class NotificationView(APIView):
    def post(self, request):
        data = request.data
        pay_logger.info(f"Получены данные от Т-Бизнес: {data}")
        pay_service.update_state(data)
        return Response(status=status.HTTP_200_OK)