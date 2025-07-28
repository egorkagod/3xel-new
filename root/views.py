from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .exceptions import InvalidCode, EmailMismatchError, UserCreationFailed, UserExists, FailedToSendCode, CodeResendTooSoonError, UserNotFound
from .services import email_service, user_service
from .repositories import user_rep
from .serializers import LoginViewSerializer, RegisterViewSerializer, UserModelSerializer, ChangePasswordSerializer, ChangeNameSerializer


class EmailCodeView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            email_service.send_random_code(email, request.session)
        except CodeResendTooSoonError:
            return Response({'error': 'Too fast, take it easy'}, status=status.HTTP_400_BAD_REQUEST)
        except FailedToSendCode:
            return Response({'error': 'Failed with sending code'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Code sent successfully'}, status=status.HTTP_200_OK)   
    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'],
        code = serializer.validated_data['email_code']

        try:
            email_service.check_code(
                session=request.session,
                email=email,
                code=code
            )
        except InvalidCode:
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        except EmailMismatchError:
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        password = serializer.validated_data['password']
        name = serializer.validated_data['name']

        try:
            user = user_service.create(
                username=email,
                email=email,
                password=password,
                first_name=name
            )
            login(request, user)
        except UserExists:
            return Response({'error': 'User with this email already exist'}, status=status.HTTP_400_BAD_REQUEST)
        except UserCreationFailed:
            return Response({'error': 'Failed to create new user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Registration successful'}, status=status.HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request=request, username=email, password=password)
        if user:
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):                
        user = user_rep.get(request.user.id)
        if user:
            payload = UserModelSerializer(user).data
            return Response(payload, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request): # Флоу смены пароля по коду email
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['email_code']

        try:
            email_service.check_code(
                session=request.session,
                email=email,
                code=code,
                is_registered=True
            )
        except InvalidCode:
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        except EmailMismatchError:
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        except UserNotFound:
            return Response({'error': 'User with this email not found'})
        except Exception as e:
            return Response({'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        password = serializer.validated_data['password']

        user_rep.change_password(user=request.user, password=password)

        return Response({'message': 'Password is changed successfully'}, status=status.HTTP_200_OK)

    def patch(self, request): # Флоу смены имени по паролю
        serializer = ChangeNameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data['name']
        password = serializer.validated_data['password']

        user = authenticate(request=request, username=request.user.username, password=password)
        if not user:
            return Response({'error': 'Invalid password'}, status=status.HTTP_200_OK)
        
        user.first_name = name
        user.save()
        return Response({'message': 'Name is successfully changed'}, status=status.HTTP_200_OK)
    