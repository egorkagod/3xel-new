from django.urls import path

from .views import NotificationView, PromocodeCheckView, PromocodeGetPrices


app_name = 'pay'

urlpatterns = [
    path('notification/', NotificationView.as_view(), name='notification'),
    path('promo_check/', PromocodeCheckView.as_view(), name='promo_check'),
    path('promo_prices', PromocodeGetPrices.as_view(), name='promo_prices'),
]