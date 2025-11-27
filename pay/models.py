import uuid
from django.db import models

from online_shop.utils import EnumWithDescriptions


class PaymentStatus(EnumWithDescriptions):
    NEW = 'NEW', 'Создан'
    AUTHORIZED = 'AUTHORIZED', 'Ожидает подтверждения'
    CONFIRMED = 'CONFIRMED', 'Оплачено'
    PARTIAL_REVERSED = 'PARTIAL_REVERSED', 'Частично отменена'
    REVERSED = 'REVERSED', 'Отменена после холдирования'
    CANCELED = 'CANCELED', 'Отменена по ссылке'
    PARTIAL_REFUNDED = 'PARTIAL_REFUNDED', 'Частичный возврат'
    REFUNDED = 'REFUNDED', 'Полный возврат'
    REJECTED = 'REJECTED', 'Ошибка списания'
    DEADLINE_EXPIRED = 'DEADLINE_EXPIRED', 'Истек срок ожидания 3DS'


class Payment(models.Model):
    class Meta:
            verbose_name = 'Платеж'
            verbose_name_plural = 'Платежи'

    id = models.BigIntegerField(primary_key=True, auto_created=False)
    status = models.CharField(
        max_length=32,
        choices=PaymentStatus.choices(),
        default=PaymentStatus.NEW.value,
    )    
    amount = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def status_description(self):
        try:
            return PaymentStatus(self.status).description
        except ValueError:
            return 'Неизвестный статус'

    def __str__(self):
        return f'{self.status_description} | {self.amount}руб'
    

class PromocodeType(EnumWithDescriptions):
    DIGITAL = 'DIGITAL', 'цифровой'
    PHYSICAL = 'PHYSICAL', 'физический'


class Promocode(models.Model):
    class Meta:
        verbose_name = 'Промокод'
        verbose_name_plural = 'Промокоды'

    def __str__(self):
        return self.promo
    
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False
    )
    denomination = models.IntegerField()
    order = models.ForeignKey('order.Order', on_delete=models.PROTECT, null=True, blank=True, related_name='certificates')
    type = models.CharField(
        max_length=32,
        choices=PromocodeType.choices(),
        default=PromocodeType.DIGITAL.value,
    )    
    promo = models.CharField(max_length=40, unique=True)
    is_used = models.BooleanField(default=False)


class PromocodePrices(models.Model):
    class Meta:
        verbose_name = 'Номинал промокода'
        verbose_name_plural = 'Номиналы промокодов'
        
    price = models.IntegerField()