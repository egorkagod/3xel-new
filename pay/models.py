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
    DEADLINE_EXPIRED = 'DEADLINE_EXPIRED', 'Истёк срок ожидания 3DS (36 часов)'


class Payment(models.Model):
    class Meta:
            verbose_name = 'Платеж'
            verbose_name_plural = 'Платежи'

    id = models.IntegerField(primary_key=True, auto_created=False)
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
