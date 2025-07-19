from django.urls import path

from .views import EmailCodeView, LoginView, LogoutView, RegisterView


urlpatterns = [
    path('email-code/', EmailCodeView.as_view(), name='email-code'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]