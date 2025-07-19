from django.contrib.auth import authenticate, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .repositories import email_rep, user_rep
from .serializers import LoginViewSerializer, RegisterViewSerializer, UserModelSerializer


class EmailCodeView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        code = email_rep.send_random_code([email])
        request.session['email_code'] = code
        request.session['email'] = email

        return Response({'message': 'Code sent successfully'}, status=status.HTTP_200_OK)   
    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        password = serializer.validated_data['password']
        first_name = serializer.validated_data['first_name']

        if int(code) != request.session.get('email_code'):
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        elif email != request.session.get('email'):
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                user_rep.create(username=email, email=email, password=password, first_name=first_name)
                del request.session['email_code']
                del request.session['email']
                return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e) # поправить на Logger
                return Response({'error': 'Registration failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        user = authenticate(request, email=email, code=code)

        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or code'}, status=status.HTTP_401_UNAUTHORIZED)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_id != request.user.id: # В будущем возможен расширенный доступ
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = user_rep.get(user_id)
        if user:
            payload = UserModelSerializer(user).data
            return Response({'user': payload}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(request): # Пока что не меняем данные
        pass