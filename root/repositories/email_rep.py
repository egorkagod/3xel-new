import random
import logging

from pathlib import Path

from django.core.mail import EmailMessage, send_mail


def send(subject, text, recipient_list, from_email=None):
    send_mail(
        subject=subject,
        message=text,
        from_email=from_email,
        recipient_list=_to_list(recipient_list),
    )


def send_with_attachment(recipient_list, attachments: list[dict]):
    """
    attachments: список словарей вида
    {
        "path": "/abs/path/to/file.pdf",
        "filename": "file.pdf",            # необязателен
        "mimetype": "application/pdf",     # необязателен
    }
    """
    email = EmailMessage(
        subject="Ваш сертификат",
        body="Ваши сертификаты во вложении",
        from_email=None,
        to=_to_list(recipient_list),
    )

    for attachment in attachments:
        path = Path(attachment["path"])
        filename = attachment.get("filename") or path.name
        mimetype = attachment.get("mimetype") or "application/pdf"

        if not path.is_file():
            continue

        with path.open("rb") as f:
            email.attach(
                filename=filename,
                content=f.read(),
                mimetype=mimetype,
            )

    email.send()

def send_random_code(recipient_list):
    try:
        code = _gen_random_code()
        subject = '3xel'
        text = f'Ваш код подтверждения: {code}'
        send(subject=subject,
            text = text,
            recipient_list=recipient_list
        )
    except Exception as e:
        logging.getLogger('root').warning('Ошибка при отправке кода: ' + str(e))
        code = None
    return code

def _gen_random_code():
    return random.randint(1000, 9999)

def _to_list(object: str | list):
    if isinstance(object, str):
        return [object]
    return object
