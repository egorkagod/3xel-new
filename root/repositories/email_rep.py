import random

from django.core.mail import send_mail


def send(subject, text, recipient_list, from_email=None):
    send_mail(subject=subject,
              text = text,
              from_email = from_email,
              recipient_list = recipient_list)
    
def send_random_code(recipient_list):
    code = _gen_random_code()
    subject = '3xel'
    text = f'Ваш код подтверждения: {code}'
    send(subject=subject,
              text = text,
              recipient_list=recipient_list)
    return code

def _gen_random_code():
    return random.randint(1000, 9999)