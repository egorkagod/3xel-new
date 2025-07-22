import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


pay_logger = logging.getLogger('pay')

class NotificationView(APIView): # TODO Написать view для получения статусов от Т-Бизнес
    def post(self, request):
        pay_logger.info(f"Получены данные от Т-Бизнес: {request.data}")
        return Response(status=status.HTTP_200_OK)