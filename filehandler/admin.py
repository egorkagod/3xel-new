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

        # Map Order.status to registered proxy model names in admin
        status_to_proxy = {
            'NEW': 'neworder',
            'PROCESSING': 'processingorder',
            'SHIPPED': 'shippedorder',
            'DELIVERED': 'deliveredorder',
        }

        orders = list(qs.only('pk', 'status')[:5])

        def as_link(o):
            proxy = status_to_proxy.get(getattr(o, 'status', None))
            if proxy:
                url = reverse(f'admin:order_{proxy}_change', args=[o.pk])
                return format_html('<a href="{}">{}</a>', url, o.pk)
            # If status has no dedicated admin section, return plain id
            return format_html('<span>{}</span>', o.pk)

        links = format_html_join(', ', '{}', ((as_link(o),) for o in orders))
        if total > 5:
            return format_html('{} и ещё {}', links, total - 5)
        return links
    orders_links.short_description = 'Заказы'
