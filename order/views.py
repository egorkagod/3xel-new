from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics

from .models import Good
from .serializers import GoodModelSerializer, OrderViewSerializer, OrderModelSerializer
from .repositories import order_rep
from .services import order_service


class CatalogView(generics.ListAPIView):
    queryset = Good.objects.prefetch_related('variants').all()
    serializer_class = GoodModelSerializer


class OrdersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = order_rep.get_all(request.user.id)
        if orders is not None:
            payload = OrderModelSerializer(orders, many=True).data
            return Response(payload, status=status.HTTP_200_OK)
        return Response({'error': 'Failed to get orders'}, status=status.HTTP_400_BAD_REQUEST)

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrderViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        goods = serializer.validated_data['goods']
        video_id = serializer.validated_data['video_id']
        amount = serializer.validated_data['amount']
        user_id = request.user.id

        payment_url = order_service.create(user_id, goods, video_id, amount) # Логика создания заказа вместе с оплатой
        if payment_url:
            return Response({'payment_url': payment_url}, status=status.HTTP_200_OK)
        return Response({'error': 'Failed to create order or init payment'}, status=status.HTTP_400_BAD_REQUEST)
