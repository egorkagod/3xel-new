from django.db import models


class Payment(models.Model):
    class Meta:
            verbose_name = 'Платеж'
            verbose_name_plural = 'Платежи'

    STATUS_CHOICES = (
        ('N', 'NEW'),
        ('A', 'AUTHORIZED'),
        ('C', 'CONFIRMED'),
        ('R', 'REJECTED'),
    )

    id = models.IntegerField(primary_key=True, auto_created=False)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='N')
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.id} - {self.status} - {self.amount}руб'
