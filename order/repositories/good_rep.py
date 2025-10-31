from typing import Optional

from order.models import Good


def get(good_id: int) -> Optional[Good]:
    return Good.objects.prefetch_related('variants__images').filter(pk=good_id).first()

