from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from order.models import Order


admin.site.site_header = "Панель управления 3xel"
admin.site.site_title = "3xel Admin"                  
admin.site.index_title = ""

admin.site.unregister(User)

class OrderInline(admin.StackedInline):
    model = Order
    extra = 0


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [OrderInline]