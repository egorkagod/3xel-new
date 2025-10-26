from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Good,
    GoodVariant,
    GoodVariantImage,
    NewOrder,
    ProcessingOrder,
    ShippedOrder,
    DeliveredOrder,
)

@admin.register(Good)
class GoodAdmin(admin.ModelAdmin):
    fields = None


@admin.register(GoodVariant)
class GoodVariantAdmin(admin.ModelAdmin):
    fields = None
    list_display = ("good", "size", "color_swatch", "colorName", "cost")
    list_select_related = ("good",)

    def color_swatch(self, obj):
        color = obj.color or "#ffffff"
        return format_html(
            '<span title="{}" style="display:inline-block;width:20px;height:20px;border:1px solid #ccc;border-radius:50%;background:{};"></span>',
            color,
            color,
        )
    color_swatch.short_description = "Цвет"


@admin.register(GoodVariantImage)
class GoodVariantImageAdmin(admin.ModelAdmin):
    fields = None


class BaseOrderStatusAdmin(admin.ModelAdmin):
    fields = None
    status_value = None  # to be set in subclasses

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.status_value:
            return qs.filter(status=self.status_value)
        return qs.none()


@admin.register(NewOrder)
class NewOrderAdmin(BaseOrderStatusAdmin):
    status_value = 'NEW'


@admin.register(ProcessingOrder)
class ProcessingOrderAdmin(BaseOrderStatusAdmin):
    status_value = 'PROCESSING'


@admin.register(ShippedOrder)
class ShippedOrderAdmin(BaseOrderStatusAdmin):
    status_value = 'SHIPPED'


@admin.register(DeliveredOrder)
class DeliveredOrderAdmin(BaseOrderStatusAdmin):
    status_value = 'DELIVERED'
