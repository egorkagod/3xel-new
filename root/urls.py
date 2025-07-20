from django.urls import path

from .views import EmailCodeView, LoginView, LogoutView, RegisterView, UserView


app_name = 'root'

urlpatterns = [
    path('code/', EmailCodeView.as_view(), name='email-code'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserView.as_view(), name='user'),
]