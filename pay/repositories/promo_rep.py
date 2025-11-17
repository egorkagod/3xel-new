import string
import secrets
from django.db import IntegrityError
from pydantic import BaseModel

from pay.models import Promocode


class PromoCreateRepoDTO(BaseModel):
    order_id: int
    denomination: int
    type: str


def create(dto: PromoCreateRepoDTO):
    for _ in range(10):
        promo = _generate_promo_str(dto.denomination)
        try:
            return Promocode.objects.create(
                order_id=dto.order_id,
                denomination=dto.denomination,
                type=dto.type,
                promo=promo,
                is_used=False,
                is_sold=True,
            )
        except IntegrityError:
            continue


def _generate_promo_str(denomination: int, length: int = 10) -> str:
    alphabet = string.ascii_uppercase + string.digits
    suffix = ''.join(secrets.choice(alphabet) for _ in range(length))
    return f"{denomination}{suffix}"