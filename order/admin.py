from django.contrib import admin
from django.utils.html import format_html
from django.conf import settings
from django.urls import reverse

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

    def size(self, obj):
        return getattr(obj.good, 'size', None)
    size.short_description = 'Размер'

    def cost(self, obj):
        return getattr(obj.good, 'cost', None)
    cost.short_description = 'Цена'


@admin.register(GoodVariantImage)
class GoodVariantImageAdmin(admin.ModelAdmin):
    fields = None


class BaseOrderStatusAdmin(admin.ModelAdmin):
    fields = None
    status_value = None  # to be set in subclasses
    list_display = (
        'id',
        'status_display',
        'created_at',
        'amount',
        'payment_status',
        'user_email',
        'download_video',
    )
    list_select_related = ('user', 'payment', 'video')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.status_value:
            return qs.filter(status=self.status_value).select_related('user', 'payment', 'video')
        return qs.none()

    def status_display(self, obj):
        return obj.get_status_display()
    status_display.short_description = 'Статус заказа'

    def payment_status(self, obj):
        payment = getattr(obj, 'payment', None)
        if payment:
            return payment.get_status_display()
        return '-'
    payment_status.short_description = 'Статус платежа'

    def user_email(self, obj):
        user = getattr(obj, 'user', None)
        return getattr(user, 'email', '-') or '-'
    user_email.short_description = 'Почта'

    def download_video(self, obj):
        file = getattr(obj, 'video', None)
        path = getattr(file, 'path', None)
        if path:
            return format_html('<a href="{}{}" download>Скачать видео</a>', settings.SITE_DOMEN, path)
        return '-'
    download_video.short_description = 'Скачать видео'


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


# Reorder models within 'order' app on the admin app page
_ORDER_MODELS_ORDER = [
    'NewOrder',
    'ProcessingOrder',
    'ShippedOrder',
    'DeliveredOrder',
    'Good',
    'GoodVariant',
]

_ORDER_INDEX = {name: i for i, name in enumerate(_ORDER_MODELS_ORDER)}

_orig_get_app_list = admin.site.get_app_list


def _get_app_list_ordered(request):
    app_list = list(_orig_get_app_list(request))
    for app in app_list:
        if app.get('app_label') == 'order':
            models = app.get('models') or []
            app['models'] = sorted(
                models,
                key=lambda m: (_ORDER_INDEX.get(m.get('object_name'), 1000), m.get('name')),
            )
            break
    return app_list


admin.site.get_app_list = _get_app_list_ordered
