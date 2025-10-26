from django.contrib import admin
from django.utils.html import format_html, format_html_join
from django.conf import settings
from django.urls import reverse

from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('orders_links', 'uploaded_at', 'view_link', 'download_link')

    def view_link(self, obj):
        if obj.path:
            return format_html(
                '<a href="{}{}" target="_blank">Открыть</a>',
                settings.SITE_DOMEN,
                obj.path,
            )
        return '-'
    view_link.short_description = 'Просмотр'

    def download_link(self, obj):
        if obj.path:
            return format_html(
                '<a href="{}{}" download>Скачать</a>',
                settings.SITE_DOMEN,
                obj.path,
            )
        return '-'
    download_link.short_description = 'Скачать'

    def orders_links(self, obj):
        # File is linked to many Orders via ForeignKey(Order.video)
        qs = getattr(obj, 'order_set', None)
        if qs is None:
            return '-'
        total = qs.count()
        if total == 0:
            return '-'
        orders = list(qs.only('pk')[:5])
        links = format_html_join(
            ', ',
            '<a href="{}">{}</a>',
            ((reverse('admin:order_order_change', args=[o.pk]), str(o.pk)) for o in orders),
        )
        if total > 5:
            return format_html('{} и ещё {}', links, total - 5)
        return links
    orders_links.short_description = 'Заказы'
