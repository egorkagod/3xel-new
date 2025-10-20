from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics

from .models import Good
from .serializers import GoodModelSerializer, OrderViewSerializer, OrderPreviewSerializer, OrderModelSerializer
from .repositories import good_rep
from .services import order_service
from .exceptions import OrderError


class CatalogView(generics.ListAPIView):
    queryset = Good.objects.prefetch_related('variants').all()
    serializer_class = GoodModelSerializer


class GoodView(APIView):
    def get(self, request):
        good_id = request.query_params.get('id')
        if good_id:
            good = good_rep.get(good_id)
            if good:
                payload = GoodModelSerializer(good).data
                return Response(payload, status=status.HTTP_200_OK)
            return Response({'error': 'Not defined good'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'GoodId is required'}, status=status.HTTP_400_BAD_REQUEST)


class OrdersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = order_service.get_all(request.user.id)
        if orders is not None:
            payload = OrderPreviewSerializer(orders, many=True).data
            return Response(payload, status=status.HTTP_200_OK)
        return Response({'error': 'Failed to get orders'}, status=status.HTTP_400_BAD_REQUEST)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        order_id = request.query_params.get('id')
        if order_id:
            order = order_service.get(request.user.id, order_id)
            if order:
                payload = OrderModelSerializer(order).data
                return Response(payload, status=status.HTTP_200_OK)
            return Response({'error': 'Not defined order'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'OrderId is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        serializer = OrderViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        goods = serializer.validated_data['goods']
        video_id = serializer.validated_data['video_id']
        user_id = request.user.id

        try:
            payment_url = order_service.create(user_id, goods, video_id)
        except OrderError as exc:
            return Response({'error': exc.detail}, status=exc.status_code)

        return Response({'payment_url': payment_url}, status=status.HTTP_200_OK)
