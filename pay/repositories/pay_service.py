from pay.models import Payment


def create(id, amount):
    payment = Payment.objects.create(id=id, amount=amount)
    return payment