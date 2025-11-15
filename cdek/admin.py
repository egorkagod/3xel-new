from django.contrib import admin

from .models import CdekOrder


@admin.register(CdekOrder)
class CdekOrderAdmin(admin.ModelAdmin):
    fields = None
    list_display = (
        "id",
        "email",
        "user_fullname",
        "tariff_code",
        "city_code",
        "city",
        "address",
    )
