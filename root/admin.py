from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from order.models import Order
from pay.models import Payment


admin.site.unregister(User)

class OrderInline(admin.StackedInline):
    model = Order
    extra = 0


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [OrderInline]