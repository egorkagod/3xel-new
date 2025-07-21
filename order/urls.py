from django.urls import path

from .views import CatalogView, OrderView


app_name = 'order'

urlpatterns = [
    path('catalog/', CatalogView.as_view(), name='catalog'),
    path('create/', OrderView.as_view(), name='order'),
]