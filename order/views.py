from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from online_shop.schema import ErrorResponseSerializer

from .models import Good
from .serializers import (
    GoodModelSerializer,
    OrderViewSerializer,
    OrderPreviewSerializer,
    OrderModelSerializer,
    PaymentInitResponseSerializer,
)
from .repositories import good_rep
from .services import order_service
from .exceptions import OrderError


@extend_schema(
    operation_id='list_catalogue',
    summary='Каталог товаров',
    responses={
        status.HTTP_200_OK: GoodModelSerializer(many=True),
    },
)
class CatalogView(generics.ListAPIView):
    queryset = Good.objects.prefetch_related('variants').all()
    serializer_class = GoodModelSerializer


class GoodView(APIView):
    @extend_schema(
        operation_id='get_good',
        summary='Получить товар по идентификатору',
        parameters=[
            OpenApiParameter(
                name='id',
                location=OpenApiParameter.QUERY,
                description='Идентификатор товара',
                required=True,
                type=OpenApiTypes.INT,
            ),
        ],
        responses={
            status.HTTP_200_OK: GoodModelSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Некорректный запрос'),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(ErrorResponseSerializer, description='Товар не найден'),
        },
    )
    def get(self, request):
        good_id = request.query_params.get('id')
        if good_id:
            good = good_rep.get(good_id)
            if good:
                payload = GoodModelSerializer(good).data
                return Response(payload, status=status.HTTP_200_OK)
            return Response({'error': 'Товар не найден'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Нужно указать идентификатор товара'}, status=status.HTTP_400_BAD_REQUEST)


class OrdersListView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id='list_orders',
        summary='Получить список заказов пользователя',
        responses={
            status.HTTP_200_OK: OrderPreviewSerializer(many=True),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Не удалось получить заказы'),
        },
    )
    def get(self, request):
        orders = order_service.get_all(request.user.id)
        if orders is not None:
            payload = OrderPreviewSerializer(orders, many=True).data
            return Response(payload, status=status.HTTP_200_OK)
        return Response({'error': 'Не удалось получить заказы'}, status=status.HTTP_400_BAD_REQUEST)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id='get_order',
        summary='Получить заказ по идентификатору',
        parameters=[
            OpenApiParameter(
                name='id',
                location=OpenApiParameter.QUERY,
                description='UUID заказа',
                required=True,
                type=OpenApiTypes.STR,
            ),
        ],
        responses={
            status.HTTP_200_OK: OrderModelSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Не указан идентификатор заказа'),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(ErrorResponseSerializer, description='Заказ не найден'),
        },
    )
    def get(self, request):
        order_id = request.query_params.get('id')
        if order_id:
            order = order_service.get(request.user.id, order_id)
            if order:
                payload = OrderModelSerializer(order).data
                return Response(payload, status=status.HTTP_200_OK)
            return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Нужно указать идентификатор заказа'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        operation_id='create_order',
        summary='Создать заказ и инициализировать оплату',
        request=OrderViewSerializer,
        responses={
            status.HTTP_200_OK: OpenApiResponse(PaymentInitResponseSerializer, description='Оплата успешно инициализирована'),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Некорректные данные заказа'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(ErrorResponseSerializer, description='Не удалось создать заказ'),
            status.HTTP_502_BAD_GATEWAY: OpenApiResponse(ErrorResponseSerializer, description='Не удалось инициализировать платеж'),
        },
    )
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
