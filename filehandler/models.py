from django.db import models
from django.contrib.auth.models import User


class File(models.Model):
    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=250, unique=True)
    path = models.CharField(max_length=150, unique=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        print(self.name)