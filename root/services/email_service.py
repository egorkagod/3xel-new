from datetime import datetime, timedelta

from root.repositories import email_rep
from root.exceptions import InvalidCode, EmailMismatchError, FailedToSendCode, CodeResendTooSoonError


def send_random_code(email, session): # TODO добавить логику таймаутов
    previous_created = session.get('created_at')
    now = datetime.now()
    if not previous_created or previous_created - now > timedelta(minutes=2):
        code = email_rep.send_random_code(email)
        if not code:
            raise FailedToSendCode
        
        session['email_code'] = code
        session['email'] = email
        session['created_at'] = datetime.now()
        return True
    
    raise CodeResendTooSoonError

def check_code(session, email, code):
    try:
        if int(code) != session.get('email_code'):
            raise InvalidCode
        elif email != session.get('email'):
            raise EmailMismatchError
        return True
    finally:
        session.pop('email_code', None)
        session.pop('email', None)

def _get_client_ip(request):
    return (
        request.META.get("HTTP_X_FORWARDED_FOR", "")
        .split(",")[0]
        .strip()
        or request.META.get("HTTP_X_REAL_IP")
        or request.META.get("REMOTE_ADDR")
    )