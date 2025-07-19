from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-file/', include('filehandler.urls')),
    path('api-order/', include('order.urls')),
    path('api-root/', include('root.urls')),
]
