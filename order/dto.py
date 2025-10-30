import uuid
from pydantic import BaseModel


# Service DTO's

class CreateOrderServiceDTO(BaseModel):
    user_id: int
    goods: list[int]
    video_id: int
    previous_order_id: uuid.UUID

# Repository DTO's

class CreateOrderItemRepoDTO(BaseModel):
    good_variant_id: int
    quantity: int


class CreateOrdeRepoDTO(BaseModel):
    user_id: int
    items: list[CreateOrderItemRepoDTO]
    video_id: int
    amount: int
