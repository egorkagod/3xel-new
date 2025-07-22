from pay.models import Payment


def create(id, amount):
    payment = Payment.objects.create(id=id, amount=amount)
    return payment

def update_state(data: dict):
    payment_id = data['PaymentId']
    payment = Payment.objects.filter(pk=payment_id).first()
    if payment:
        payment.status = data['Status'][0]
        payment.save()