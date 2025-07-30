from django.utils.html import format_html
from django.contrib import admin

from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'download_link', 'uploaded_at')

    @admin.display(description="Скачать видео")
    def download_link(self, obj):
        if obj.file:
            return format_html(
                "<a href='{}' download>Скачать</a>",
                obj.file.url
            )
        return "-"