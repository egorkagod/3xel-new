from pydantic import BaseModel


class OrderCreateServiceDTO(BaseModel):
    user_id: int
    goods: list
    video_id: int | None
    previous_order_id: int | None
    comment: str | None
    amount: int