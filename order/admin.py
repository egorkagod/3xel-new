from django.contrib import admin

from .models import Good, GoodVariant, GoodVariantImage, OrderItem, Order

@admin.register(Good)
class GoodAdmin(admin.ModelAdmin):
    fields = None


@admin.register(GoodVariant)
class GoodVariantAdmin(admin.ModelAdmin):
    fields = None


@admin.register(GoodVariantImage)
class GoodVariantImageAdmin(admin.ModelAdmin):
    fields = None


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    fields = None


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    fields = None
