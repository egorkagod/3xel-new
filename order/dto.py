from pydantic import BaseModel


# Service DTO's

class CreateOrderServiceDTO(BaseModel):
    user_id: int
    goods: list[int]
    video_id: int | None = None
    previous_order_id: int | None = None
    comment: str | None = ''
    phone: str
    address: str

# Repository DTO's

class CreateOrderItemRepoDTO(BaseModel):
    good_variant_id: int
    quantity: int


class CreateOrdeRepoDTO(BaseModel):
    user_id: int
    items: list[CreateOrderItemRepoDTO]
    video_id: int
    amount: int
    comment: str | None = ''
    phone: str
    address: str
