from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from filehandler.models import File
from pay.models import Payment


class Good(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

def timestamp_filename(instance, filename):
    ext = filename.split('.')[-1]
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    return f"catalog/images/{timestamp}.{ext}"

class GoodVariant(models.Model):
    good = models.ForeignKey(Good, on_delete=models.CASCADE, related_name='variants')
    size = models.IntegerField()
    color = models.CharField(max_length=20)
    image = models.ImageField(upload_to=timestamp_filename)
    price = models.IntegerField()

    def __str__(self):
        return str(self.good) + '-' + str(self.size) + '-' + self.color 


class OrderItem(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    good_variant = models.ForeignKey('GoodVariant', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()

    def __str__(self):
        return f'{self.quantity} шт ' + self.good_variant 

class Order(models.Model):
    STATUS_CHOICES = (
        ('C', 'Created'),
        ('P', 'Payed'),
        ('D', 'Delivered'),
        ('F', 'Finished'),
    )

    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)
    amount = models.IntegerField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='C')
    video = models.OneToOneField(File, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
