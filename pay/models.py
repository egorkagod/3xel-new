from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = (
        ('I', 'INIT'),
        ('A', 'AUTHORIZED'),
        ('C', 'CONFIRMED'),
        ('R', 'REJECTED'),
    )

    id = models.IntegerField(primary_key=True, auto_created=False)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='I')
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.id} - {self.status} - {self.amount}'
