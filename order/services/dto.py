import uuid
from pydantic import BaseModel


class OrderCreateServiceDTO(BaseModel):
    user_id: int
    goods: list | None
    certificates: list | None
    promocode: uuid.UUID | None
    video_id: int | None
    previous_order_id: int | None
    comment: str | None
    amount: int