from django.urls import path

from .views import CatalogView, CreateOrderView, OrdersListView


app_name = 'order'

urlpatterns = [
    path('catalogue/', CatalogView.as_view(), name='catalogue'),
    path('orders/', OrdersListView.as_view(), name='orders-list'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
]
