from django.urls import path

from .views import CatalogView, OrdersListView, OrderView, GoodView


app_name = 'order'

urlpatterns = [
    path('catalogue/', CatalogView.as_view(), name='catalogue'),
    path('orders/', OrdersListView.as_view(), name='orders-list'),
    path('order/', OrderView.as_view(), name='order'),
    path('good/', GoodView.as_view(), name='good'),
]
