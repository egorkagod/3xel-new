from django.db import models


class Payment(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=False)
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id
