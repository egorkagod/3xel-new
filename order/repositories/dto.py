from pydantic import BaseModel


class CreateOrderItemRepoDTO(BaseModel):
    good_variant_id: int
    quantity: int


class OrderCreateRepoDTO(BaseModel):
    user_id: int
    goods: list
    video_id: int
    comment: str | None
    amount: int
    