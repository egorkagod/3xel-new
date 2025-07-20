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
        if not code:
            return Response({'error': 'Failed with sending code'}, status=status.HTTP_400_BAD_REQUEST)

        request.session['email_code'] = code
        request.session['email'] = email

        return Response({'message': 'Code sent successfully'}, status=status.HTTP_200_OK)   
    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        email_code = serializer.validated_data['email_code']
        password = serializer.validated_data['password']
        name = serializer.validated_data['name']

        if int(email_code) != request.session.get('email_code'):
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        elif email != request.session.get('email'):
            return Response({'error': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = user_rep.create(username=email, email=email, password=password, first_name=name)
            if not user:
                return Response({'error': 'Failed with creation user'}, status=status.HTTP_400_BAD_REQUEST)
            
            del request.session['email_code']
            del request.session['email']
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
            return Response({'user': payload}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request): # Пока что не меняем данные
        pass