import uuid
from pay.models import Promocode


def check(promocode: str) -> tuple[str, int] | None:
    promo_obj = Promocode.objects.filter(promo=promocode.upper(), is_used=False).first()
    if promo_obj:
        return str(promo_obj.id), promo_obj.denomination
    return None


def confirm(promocode: uuid.UUID | None) -> int:
    promo_obj = Promocode.objects.filter(pk=promocode, is_used=False).first()
    if promo_obj:
        return promo_obj.denomination
    return 0