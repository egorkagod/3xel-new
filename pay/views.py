import logging

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from pay.services import pay_service
from pay.services import promo_service


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

    def post(self, request):
        data = request.data
        pay_logger.info(f"{data}")
        pay_service.update_status(data)
        return HttpResponse("OK", status=status.HTTP_200_OK)


class PromocodeCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        promocode = request.data.get('promocode')
        if not promocode:
            return Response({'error': 'Должно быть передано поле promocode'}, status=status.HTTP_400_BAD_REQUEST)
        id, denomination = promo_service.check(promocode)
        return Response({'id': id, 'denomination': denomination}, status=status.HTTP_200_OK)