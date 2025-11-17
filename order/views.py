import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from pydantic import ValidationError

from online_shop.schema import ErrorResponseSerializer
from .serializers import (
    GoodModelSerializer,
    OrderPreviewSerializer,
    OrderModelSerializer,
)
from .models import Good
from .api_schema import OrderCreateSchema
from order.workflow.dto import OrderCreateWorkflowDTO
from order.workflow import order_workflow
from .services import order_service
from .exceptions import OrderError

order_logger = logging.getLogger('order')


@extend_schema(
    operation_id='list_catalogue',
    summary='Каталог товаров',
    responses={
        status.HTTP_200_OK: GoodModelSerializer(many=True),
    },
)
class CatalogView(generics.ListAPIView):
    queryset = Good.objects.prefetch_related('variants__images').all()
    serializer_class = GoodModelSerializer

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            order_logger.info('Catalogue GET ok: status=%s user=%s', response.status_code, getattr(request.user, 'id', None))
            return response
        except Exception:
            order_logger.exception('Catalogue GET failed')
            return Response({'error': 'Не удалось получить каталог'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            good = Good.objects.filter(pk=good_id).first()
            if good:
                payload = GoodModelSerializer(good, context={'request': request}).data
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
        try:
            orders = order_service.get_all(request.user.id)
            if orders is not None:
                payload = OrderPreviewSerializer(orders, many=True).data
                order_logger.info('Orders list ok: user=%s count=%s', request.user.id, len(payload))
                return Response(payload, status=status.HTTP_200_OK)
            order_logger.error('Orders list failed: user=%s', request.user.id)
            return Response({'error': 'Не удалось получить заказы'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            order_logger.exception('Orders list crashed: user=%s', getattr(request.user, 'id', None))
            return Response({'error': 'Произошла ошибка при получении заказов'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            order_id = request.query_params.get('id')
            if order_id is not None:
                try:
                    order_id = int(order_id)
                except (TypeError, ValueError):
                    return Response({'error': 'Некорректный идентификатор заказа'}, status=status.HTTP_400_BAD_REQUEST)
                order = order_service.get(order_id)
                if order:
                    payload = OrderModelSerializer(order).data
                    return Response(payload, status=status.HTTP_200_OK)
                return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'error': 'Нужно указать идентификатор заказа'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'error': 'Произошла ошибка при получении заказа'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    def post(self, request):
        try:
            data = OrderCreateSchema(**request.data)
        except ValidationError as e:
            # Преобразуем pydantic-ошибку в строку, чтобы избежать проблем с JSON-сериализацией
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment_url = order_workflow.create(
                OrderCreateWorkflowDTO(
                    user_id=request.user.id,
                    **data.model_dump(), 
                )
            )
            return Response({'payment_url': payment_url}, status=status.HTTP_200_OK)
        except OrderError as e:
            return Response({'error': e.detail}, status=e.status_code)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
