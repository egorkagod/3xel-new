from django.urls import path

from .views import NotificationView, PromocodeCheckView


app_name = 'pay'

urlpatterns = [
    path('notification/', NotificationView.as_view(), name='notification'),
    path('promo_check/', PromocodeCheckView.as_view(), name='promo_check')
]