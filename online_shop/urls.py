from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-file/', include('filehandler.urls')),
    path('api-order/', include('order.urls')),
    path('api-root/', include('root.urls')),
    path('api-pay/', include('pay.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='api-schema'), name='api-docs'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='api-schema'), name='api-docs-redoc'),
]
