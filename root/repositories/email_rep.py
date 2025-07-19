import random

from django.core.mail import send_mail


def send(subject, text, recipient_list, from_email=None):
    try:
        send_mail(subject=subject,
                message = text,
                from_email = from_email,
                recipient_list = recipient_list)
    except Exception as e:
        return e
    
def send_random_code(recipient_list):
    code = _gen_random_code()
    subject = '3xel'
    text = f'Ваш код подтверждения: {code}'
    error = send(subject=subject,
              text = text,
              recipient_list=recipient_list)
    if error:
        return error
    return code

def _gen_random_code():
    return random.randint(1000, 9999)