from django.db import models
from django.conf import settings


class File(models.Model):
    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    path = models.CharField(max_length=150, unique=True)
    format = models.CharField(max_length=20)
    updated_at = models.DateField(auto_now=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.pk}'