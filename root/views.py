import logging
from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from online_shop.schema import MessageResponseSerializer, ErrorResponseSerializer

from .exceptions import InvalidCode, EmailMismatchError, UserCreationFailed, UserExists, FailedToSendCode, CodeResendTooSoonError
from .services import email_service, user_service
from .repositories import user_rep
from .serializers import LoginViewSerializer, RegisterViewSerializer, UserModelSerializer, ChangePasswordSerializer, ChangeNameSerializer

root_logger = logging.getLogger('root')


class EmailCodeView(APIView): # TODO все еще ошибка
    @extend_schema(
        operation_id='request_email_code',
        summary='Отправить код на email',
        parameters=[
            OpenApiParameter(
                name='email',
                location=OpenApiParameter.QUERY,
                description='Email пользователя',
                required=True,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name='is_registered',
                location=OpenApiParameter.QUERY,
                description='Признак, что email принадлежит существующему пользователю',
                required=False,
                type=OpenApiTypes.BOOL,
            ),
        ],
        responses={
            status.HTTP_200_OK: OpenApiResponse(MessageResponseSerializer, description='Код успешно отправлен'),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Неверные параметры или слишком частые запросы'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(ErrorResponseSerializer, description='Ошибка отправки письма'),
        },
    )
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Нужно указать email'}, status=status.HTTP_400_BAD_REQUEST)
        
        # корректно парсим булево из query params
        raw_flag = request.query_params.get('is_registered', 'false')
        if isinstance(raw_flag, bool):
            is_registered = raw_flag
        else:
            is_registered = str(raw_flag).strip().lower() in {'1', 'true', 'yes', 'y', 'on'}
        
        try:
            email_service.send_random_code(email, request.session, is_registered=is_registered)
        except CodeResendTooSoonError:
            return Response({'error': 'Слишком часто запрашиваете код, попробуйте позже'}, status=status.HTTP_400_BAD_REQUEST)
        except FailedToSendCode:
            return Response({'error': 'Не удалось отправить код'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Если почта зарегистрирована, код отправлен'}, status=status.HTTP_200_OK)   
    

class RegisterView(APIView):
    @extend_schema(
        operation_id='register_user',
        summary='Регистрация нового пользователя',
        request=RegisterViewSerializer,
        responses={
            status.HTTP_200_OK: OpenApiResponse(MessageResponseSerializer, description='Регистрация выполнена'),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Неверные данные или email уже используется'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(ErrorResponseSerializer, description='Ошибка создания пользователя'),
        },
    )
    def post(self, request):
        serializer = RegisterViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['email_code']

        try:
            email_service.check_code(
                session=request.session,
                email=email,
                code=code
            )
        except InvalidCode:
            return Response({'error': 'Неверный код'}, status=status.HTTP_400_BAD_REQUEST)
        except EmailMismatchError:
            return Response({'error': 'Неверный email'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'error': 'Произошла внутренняя ошибка'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        password = serializer.validated_data['password']
        name = serializer.validated_data['name']

        try:
            user_service.create(
                username=email,
                email=email,
                password=password,
                first_name=name
            )
        except UserExists:
            return Response({'error': 'Пользователь с таким email уже существует'}, status=status.HTTP_400_BAD_REQUEST)
        except UserCreationFailed:
            return Response({'error': 'Не удалось создать пользователя'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            return Response({'error': 'Произошла внутренняя ошибка'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Регистрация прошла успешно'}, status=status.HTTP_200_OK)


class LoginView(APIView):
    @extend_schema(
        operation_id='login_user',
        summary='Вход пользователя',
        request=LoginViewSerializer,
        responses={
            status.HTTP_200_OK: OpenApiResponse(MessageResponseSerializer, description='Успешный вход'),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(ErrorResponseSerializer, description='Неверный email или пароль'),
        },
    )
    def post(self, request):
        serializer = LoginViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request=request, username=email, password=password)
        if user:
            login(request, user)
            return Response({'message': 'Вход выполнен'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Неверный email или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id='logout_user',
        summary='Выход пользователя',
        request=None,
        responses={
            status.HTTP_200_OK: OpenApiResponse(MessageResponseSerializer, description='Сессия завершена'),
        },
    )
    def post(self, request):
        logout(request)
        return Response({'message': 'Вы вышли из аккаунта'}, status=status.HTTP_200_OK)
    

class UserView(APIView):
    def get_permissions(self):
        if self.request.method in ['GET']:
            return [IsAuthenticated()]
        return [AllowAny()]

    @extend_schema(
        operation_id='get_current_user',
        summary='Получить информацию о пользователе',
        responses={
            status.HTTP_200_OK: UserModelSerializer,
            status.HTTP_404_NOT_FOUND: OpenApiResponse(ErrorResponseSerializer, description='Пользователь не найден'),
        },
    )
    def get(self, request):
        # Более безопасная реализация, избегаем лишних запросов в БД
        try:
            if not getattr(request.user, 'is_authenticated', False):
                root_logger.info('User GET unauthorized')
                return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

            user = request.user
            payload = UserModelSerializer(user).data
            root_logger.info('User GET ok: user=%s', getattr(user, 'id', None))
            return Response(payload, status=status.HTTP_200_OK)
        except Exception:
            root_logger.exception('User GET failed')
            return Response({'error': 'Не удалось получить данные пользователя'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @extend_schema(
        operation_id='reset_password_with_code',
        summary='Смена пароля по email-коду',
        request=ChangePasswordSerializer,
        responses={
            status.HTTP_200_OK: OpenApiResponse(MessageResponseSerializer, description='Пароль изменён'),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(ErrorResponseSerializer, description='Неверный код или email'),
            status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(ErrorResponseSerializer, description='Ошибка обработки запроса'),
        },
    )
    def post(self, request): # Флоу смены пароля по коду email
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['email_code']

        try:
            email_service.check_code(
                session=request.session,
                code=code,
                is_registered=True
            )
        except InvalidCode:
            return Response({'error': 'Неверный код'}, status=status.HTTP_400_BAD_REQUEST)
        except EmailMismatchError:
            return Response({'error': 'Неверный email'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'error': 'Произошла внутренняя ошибка'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user_rep.change_password(email=email, password=password)

        return Response({'message': 'Пароль обновлён, если пользователь найден'}, status=status.HTTP_200_OK)

    @extend_schema(
        operation_id='change_user_name',
        summary='Смена имени отключена',
        request=ChangeNameSerializer,
        responses={
            status.HTTP_403_FORBIDDEN: OpenApiResponse(ErrorResponseSerializer, description='Изменение имени отключено'),
        },
    )
    def patch(self, request):
        return Response({'error': 'Изменение имени отключено'}, status=status.HTTP_403_FORBIDDEN)
    
