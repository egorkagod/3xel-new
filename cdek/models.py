from django.db import models


class CdekOrder(models.Model):
    class Meta:
            verbose_name = 'Заказ в СДЭК'
            verbose_name_plural = 'Заказы в СДЭК'

    email = models.CharField(max_length=100)
    user_fullname = models.CharField(max_length=200)
    tariff_code = models.IntegerField()
    city_code = models.IntegerField(null=True, default=None, blank=True)
    city = models.CharField(max_length=200)
    address = models.CharField(max_length=200, default='')
    pvz_code = models.CharField(max_length=100, null=True, blank=True)