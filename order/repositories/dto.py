import uuid
from pydantic import BaseModel


class CreateOrderItemRepoDTO(BaseModel):
    good_variant_id: int
    quantity: int


class OrderCreateRepoDTO(BaseModel):
    user_id: int
    promocode: uuid.UUID | None
    goods: list | None
    certificates: list | None
    comment: str | None
    amount: int
    