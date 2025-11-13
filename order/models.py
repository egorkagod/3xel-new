from django.db import models
from django.conf import settings
from django.utils import timezone

from filehandler.models import File
from pay.models import Payment, Promocode
from online_shop.utils import EnumWithDescriptions


class Good(models.Model):
    class Meta:
        verbose_name = 'Вид товара'
        verbose_name_plural = 'Виды товаров'

    name = models.CharField(max_length=250)
    size = models.IntegerField()
    box_sizes = models.CharField(max_length=20, null=True)
    weight = models.IntegerField(null=True)
    price = models.IntegerField()
    description = models.TextField(null=True, blank=True)
    technology = models.JSONField(default=list)

    def __str__(self):
        return f'{self.name} {self.size}см'

def timestamp_filename(instance, filename):
    ext = filename.split('.')[-1]
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    return f"catalog/images/{timestamp}.{ext}"

class GoodVariant(models.Model):
    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    good = models.ForeignKey(Good, on_delete=models.PROTECT, related_name='variants')
    color = models.CharField(max_length=30)
    colorName = models.CharField(max_length=30)

    def __str__(self):
        try:
            return f'{self.good} размера {self.good.size}см и цвета {self.color}'
        except Exception:
            return f'{self.good} цвета {self.color}'


class GoodVariantImage(models.Model):
    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'

    variant = models.ForeignKey(GoodVariant, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=timestamp_filename)

    def __str__(self):
        return f'{self.image.name}'


class OrderItem(models.Model):
    class Meta:
        verbose_name = 'Товар в заказе'
        verbose_name_plural = 'Товары в заказе '

    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    good_variant = models.ForeignKey('GoodVariant', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()

    def __str__(self):
        return f'{self.quantity} шт ' + str(self.good_variant)


class OrderStatus(EnumWithDescriptions):
    NEW = 'NEW', 'Создан'
    PROCESSING = 'PROCESSING', 'В обработке'
    SHIPPED = 'SHIPPED', 'Отправлен'
    DELIVERED = 'DELIVERED', 'Доставлен'
    CONFIRMED = 'CONFIRMED', 'Завершен'
    CANCELED = 'CANCELED', 'Отменен'
    RETURNED = 'RETURNED', 'Возврат'


class Order(models.Model):
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='orders')
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT, null=True)
    amount = models.IntegerField()
    status = models.CharField(
        max_length=32,
        choices=OrderStatus.choices(),
        default=OrderStatus.NEW.value,
    )    
    phone = models.CharField(max_length=32, default='')
    comment = models.TextField(max_length=1000, default='')
    cdek = models.OneToOneField('CdekOrder', on_delete=models.PROTECT, related_name='order', null=True, default=None)
    promocode = models.OneToOneField(Promocode, on_delete=models.PROTECT, null=True, default=None)
    video = models.ForeignKey(File, on_delete=models.PROTECT, null=True, related_name='order')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def status_description(self):
        try:
            return OrderStatus(self.status).description
        except ValueError:
            return 'Неизвестный статус'

    @property
    def formatted_created_at(self):
        return self.created_at.strftime("%d.%m.%Y %H:%M") 

    def __str__(self):
        return f'{self.status_description} | {self.formatted_created_at}'


# Proxy models for admin sections by status
class NewOrder(Order):
    class Meta:
        proxy = True
        verbose_name = 'Новый заказ'
        verbose_name_plural = 'Новые заказы'


class ProcessingOrder(Order):
    class Meta:
        proxy = True
        verbose_name = 'Заказ в обработке'
        verbose_name_plural = 'Заказы в обработке'


class ShippedOrder(Order):
    class Meta:
        proxy = True
        verbose_name = 'Заказ в доставке'
        verbose_name_plural = 'Заказы в доставке'


class DeliveredOrder(Order):
    class Meta:
        proxy = True
        verbose_name = 'Заказ доставлен'
        verbose_name_plural = 'Доставленные заказы'
