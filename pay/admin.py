from django.contrib import admin

from .models import Payment, Promocode


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    fields = None

@admin.register(Promocode)
class PromocodeAdmin(admin.ModelAdmin):
    fields = ['denomination', 'promo']