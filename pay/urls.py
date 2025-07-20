from django.urls import path

from .views import NotificationView


app_name = 'pay'

urlpatterns = [
    path('notification/', NotificationView.as_view(), name='notification'),
]