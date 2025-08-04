from django.contrib import admin
from django.utils.html import format_html
from django.conf import settings

from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'uploaded_at', 'download_link')

    def download_link(self, obj):
        if obj.path:
            return format_html(f'<a href="{settings.SITE_DOMEN}{obj.path}" target="_blank">Скачать</a>')
        return '-'
    download_link.short_description = 'Ссылка'