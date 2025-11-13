from django.db import models


class CdekOrder(models.Model):
    email = models.CharField(max_length=100)
    user_fullname = models.CharField(max_length=200)
    tariff_code = models.IntegerField()
    city_code = models.IntegerField(null=True, default=None)
    city = models.CharField(max_length=200)
    address = models.CharField(max_length=200, default='')