from django.contrib import admin
from django.utils.html import format_html, format_html_join
from django.conf import settings
from django.urls import reverse
from pathlib import Path

from .models import (
    Good,
    GoodVariant,
    GoodVariantImage,
    NewOrder,
    ProcessingOrder,
    ShippedOrder,
    DeliveredOrder,
    CompletedOrder,
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
        # В модели Good поле называется price
        return getattr(obj.good, 'price', None)
    cost.short_description = 'Цена'


@admin.register(GoodVariantImage)
class GoodVariantImageAdmin(admin.ModelAdmin):
    fields = None


class BaseOrderStatusAdmin(admin.ModelAdmin):
    fields = None
    status_value = None  # to be set in subclasses
    list_display = (
        'id',
        'order_items',
        'cdek_order_link',
        'status_display',
        'created_at',
        'amount',
        'payment_status',
        'user_email',
        'download_video',
    )
    list_select_related = ('user', 'payment', 'video', 'cdek')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.status_value:
            return (
                qs.filter(status=self.status_value)
                .select_related('user', 'payment', 'video')
                .prefetch_related('items__good_variant', 'items__good_variant__good')
            )
        return qs.none()

    def status_display(self, obj):
        return obj.get_status_display()
    status_display.short_description = 'Статус заказа'

    def order_items(self, obj):
        if not hasattr(obj, 'items'):
            return '-'
        items = list(obj.items.all())
        if not items:
            return '-'

        rows = format_html_join(
            '',
            (
                '<li>'
                '<span style="display:inline-block;'
                'width:14px;height:14px;border-radius:50%;'
                'border:1px solid #ccc;margin-right:4px;'
                'background:{};"></span>'
                '{} {}см ({}) — {} шт'
                '</li>'
            ),
            (
                (
                    getattr(item.good_variant, 'color', '#ffffff') or '#ffffff',
                    getattr(getattr(item.good_variant, 'good', None), 'name', '') or '',
                    getattr(getattr(item.good_variant, 'good', None), 'size', '') or '',
                    getattr(item.good_variant, 'colorName', '') or '',
                    item.quantity,
                )
                for item in items if item.good_variant
            ),
        )
        if not rows:
            return '-'
        return format_html('<ul style="margin:0;padding-left:18px">{}</ul>', rows)
    order_items.short_description = 'Состав заказа'

    def cdek_order_link(self, obj):
        cdek_order = getattr(obj, 'cdek', None)
        if not cdek_order:
            return '-'
        url = reverse('admin:cdek_cdekorder_change', args=[cdek_order.id])
        return format_html('<a href="{}">CDEK</a>', url)
    cdek_order_link.short_description = 'CDEK'

    def payment_status(self, obj):
        payment = getattr(obj, 'payment', None)
        if payment:
            try:
                url = reverse('admin:pay_payment_change', args=[payment.pk])
                return format_html('<a href="{}">{}</a>', url, payment.get_status_display())
            except Exception:
                return payment.get_status_display()
        return '-'
    payment_status.short_description = 'Статус платежа'

    def user_email(self, obj):
        user = getattr(obj, 'user', None)
        email = getattr(user, 'email', None) if user else None
        if user and email:
            try:
                url = reverse('admin:root_user_change', args=[user.pk])
                return format_html('<a href="{}">{}</a>', url, email)
            except Exception:
                return email
        return '-'
    user_email.short_description = 'Почта'

    def download_video(self, obj):
        file = getattr(obj, 'video', None)
        path = getattr(file, 'path', None)
        if path:
            try:
                p = Path(path)
                # Если в базе абсолютный путь и он лежит под MEDIA_ROOT — строим URL относительно MEDIA_URL
                if p.is_absolute():
                    try:
                        rel = p.resolve().relative_to(Path(settings.MEDIA_ROOT).resolve())
                        url_path = f"{settings.MEDIA_URL}{rel.as_posix()}"
                    except Exception:
                        # Фоллбек: используем имя файла в корне MEDIA_URL
                        url_path = f"{settings.MEDIA_URL}{p.name}"
                else:
                    # Относительный путь — дополняем MEDIA_URL
                    url_path = f"{settings.MEDIA_URL}{p.as_posix()}"
                abs_url = f"{str(settings.SITE_DOMEN).rstrip('/')}/{url_path.lstrip('/')}"
                return format_html('<a href="{}" download>Скачать</a>', abs_url)
            except Exception:
                # В крайнем случае возвращаем как есть
                return format_html('<a href="{}{}" download>Скачать</a>', settings.SITE_DOMEN, path)
        return '-'
    download_video.short_description = 'Видео'


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


@admin.register(CompletedOrder)
class CompletedOrderAdmin(BaseOrderStatusAdmin):
    status_value = 'CONFIRMED'


# Reorder models within 'order' app on the admin app page
_ORDER_MODELS_ORDER = [
    'NewOrder',
    'ProcessingOrder',
    'ShippedOrder',
    'CompletedOrder',
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
