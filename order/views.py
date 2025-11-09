import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from pydantic import ValidationError

from online_shop.schema import ErrorResponseSerializer

from order.exceptions import PaymentInitializationError

from root.services import user_service
from pay.services import pay_service
from .models import Good
from .serializers import (
    OrderCreateView,
    GoodModelSerializer,
    OrderViewSerializer,
    OrderPreviewSerializer,
    OrderModelSerializer,
    PaymentInitResponseSerializer,
)
from .repositories import good_rep
from .services import order_service, cdek_service
from .exceptions import OrderError
from order.dto.order import CreateOrderServiceDTO
from order.dto.cdek import CdekDeliveryGetPriceDTO, CdekOrderRegisterDTO

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
            good = good_rep.get(good_id)
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

    @extend_schema(
        operation_id='get_order',
        summary='Получить заказ по идентификатору',
        parameters=[
            OpenApiParameter(
                name='id',
                location=OpenApiParameter.QUERY,
                description='Идентификатор заказа',
                required=True,
                type=OpenApiTypes.INT,
            ),
        ],
        responses={
            status.HTTP_200_OK: OrderModelSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Не указан идентификатор заказа'),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(ErrorResponseSerializer, description='Заказ не найден'),
        },
    )
    def get(self, request):
        try:
            order_id = request.query_params.get('id')
            if order_id is not None:
                try:
                    order_id_int = int(order_id)
                except (TypeError, ValueError):
                    return Response({'error': 'Некорректный идентификатор заказа'}, status=status.HTTP_400_BAD_REQUEST)
                order = order_service.get(request.user.id, order_id_int)
                if order:
                    payload = OrderModelSerializer(order).data
                    order_logger.info('Order detail ok: user=%s order=%s', request.user.id, order_id_int)
                    return Response(payload, status=status.HTTP_200_OK)
                order_logger.warning('Order not found: user=%s order=%s', request.user.id, order_id_int)
                return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'error': 'Нужно указать идентификатор заказа'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            order_logger.exception('Order detail crashed: user=%s id=%s', getattr(request.user, 'id', None), request.query_params.get('id'))
            return Response({'error': 'Произошла ошибка при получении заказа'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @extend_schema(
        operation_id='create_order',
        summary='Создать заказ, обновить данные пользователя и инициализировать оплату',
        request=OrderViewSerializer,
        responses={
            status.HTTP_200_OK: OpenApiResponse(PaymentInitResponseSerializer, description='Оплата успешно инициализирована'),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Некорректные данные заказа'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(ErrorResponseSerializer, description='Не удалось создать заказ'),
            status.HTTP_502_BAD_GATEWAY: OpenApiResponse(ErrorResponseSerializer, description='Не удалось инициализировать платеж'),
        },
    )
    def post(self, request):
        try:
            data = OrderCreateView(**request.data)
        except ValidationError as e:
            return Response({'error': e.errors()})

        # Обновление данных пользователя
        full_name = f"{data.surname} {data.name} {data.patronymic}".strip()
        try:
            user = request.user
            new_name = full_name
            if user.first_name != new_name:
                user.first_name = new_name
                user.save()
        except Exception:
            pass

        # Создание заказа
        try:
            goods = order_service.get_goods_with_sale(data.goods)
            packages = cdek_service.get_packages(data.goods)
            delivery_cost = cdek_service.get_delivery_price(
                CdekDeliveryGetPriceDTO(
                    packages=packages,
                    tariff_code=data.cdek.tariff_code,
                    city_code=data.cdek.city_code,
                    city=data.cdek.city,
                    address=data.cdek.address
                )
            )
            if not delivery_cost:
                return Response({'error': 'Не удалось подсчитать стоимость доставки'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            goods_amount = order_service._get_goods_amount(goods)
            total_amount = goods_amount + int(delivery_cost * 1.1) + 1

            order_id = order_service.create(
                CreateOrderServiceDTO(
                    user_id=request.user.id,
                    goods=data.goods,
                    video_id=data.video_id,
                    previous_order_id=data.order_id,
                    comment=data.wishes,
                    phone=data.phone,
                    full_address=f'{data.cdek.city}, {data.cdek.address}',
                    amount=total_amount
                )
            )

            email = user_service.get_email(request.user.id)
            if not email:
                return Response({'error': 'Ошибка при получении email пользователя'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            cdek_service.register_order(
                CdekOrderRegisterDTO(
                    order_id=order_id,
                    tariff_code=data.cdek.tariff_code,
                    user_fullname=full_name,
                    email=email,
                    city_code=data.cdek.city_code,
                    city=data.cdek.city,
                    address=data.cdek.address,
                    phone=data.phone,
                    packages=packages,
                )
            )

            payment_url = pay_service.init(
                pay_service.InitPayServiceDTO(
                    order_id=order_id,
                    goods=goods,
                    amount=total_amount,
                    email=email,
                )
            )
            if not payment_url:
                raise PaymentInitializationError()

        except OrderError as exc:
            return Response({'error': exc.detail}, status=exc.status_code)

        return Response({'payment_url': payment_url}, status=status.HTTP_200_OK)
