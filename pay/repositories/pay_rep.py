from pay.models import Payment


def create(id, amount, status):
    payment = Payment.objects.create(id=id, amount=amount, status=status)
    return payment

def update_state(data: dict):
    payment_id = data['PaymentId']
    payment = Payment.objects.filter(pk=payment_id).first()
    if payment:
        payment.status = data['Status'][0]
        payment.save()