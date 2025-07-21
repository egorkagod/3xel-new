from django.urls import path

from .views import CatalogView, OrderView


app_name = 'order'

urlpatterns = [
    path('catalogue/', CatalogView.as_view(), name='catalogue'),
    path('create/', OrderView.as_view(), name='order'),
]