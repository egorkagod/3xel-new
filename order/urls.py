from django.urls import path

from .views import CatalogView, OrderView


urlpatterns = [
    path('catalog/', CatalogView.as_view(), name='catalog'),
    path('order/', OrderView.as_view(), name='order'),
]