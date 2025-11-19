import uuid
from pydantic import BaseModel


class OrderCreateServiceDTO(BaseModel):
    user_id: int
    goods: list | None
    certificates: list | None
    promocode: uuid.UUID | None
    # Может быть как id файла, так и ссылка
    video_id: str | None
    previous_order_id: int | None
    comment: str | None
    amount: int
