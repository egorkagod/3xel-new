from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    patronymic = models.CharField("Отчество", max_length=50, blank=True)
    phone = models.CharField("Телефон", max_length=20, blank=True)
    birth_date = models.DateField("Дата рождения", null=True, blank=True)