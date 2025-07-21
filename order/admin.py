from django.contrib import admin

from .models import Good, GoodVariant, OrderItem, Order

@admin.register(Good)
class GoodAdmin(admin.ModelAdmin):
    fields = None


@admin.register(GoodVariant)
class GoodVariantAdmin(admin.ModelAdmin):
    fields = None


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    fields = None


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    fields = None