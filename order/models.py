import uuid

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from filehandler.models import File
from pay.models import Payment


class Good(models.Model):
    class Meta:
        verbose_name = 'Вид товара'
        verbose_name_plural = 'Виды товаров'

    name = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

def timestamp_filename(instance, filename):
    ext = filename.split('.')[-1]
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    return f"catalog/images/{timestamp}.{ext}"

class GoodVariant(models.Model):
    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    good = models.ForeignKey(Good, on_delete=models.PROTECT, related_name='variants')
    size = models.IntegerField()
    color = models.CharField(max_length=20)
    image = models.ImageField(upload_to=timestamp_filename)
    price = models.IntegerField()

    def __str__(self):
        return f'{self.good} - {self.size}см - {self.color}'


class OrderItem(models.Model):
    class Meta:
        verbose_name = 'Товар в заказе'
        verbose_name_plural = 'Товары в заказе '

    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    good_variant = models.ForeignKey('GoodVariant', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()

    def __str__(self):
        return f'{self.quantity} шт ' + str(self.good_variant)

class Order(models.Model):
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    STATUS_CHOICES = (
        ('C', 'Created'),
        ('P', 'Payed'),
        ('D', 'Delivered'),
        ('F', 'Finished'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT, null=True)
    amount = models.IntegerField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='C')
    video = models.OneToOneField(File, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def formatted_created_at(self):
        return self.created_at.strftime("%d.%m.%Y %H:%M") 

    def __str__(self):
        return f'{self.id} - {self.formatted_created_at}'
    