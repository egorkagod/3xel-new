import uuid
from pydantic import BaseModel, model_validator, Field


class CdekInfoSchema(BaseModel):
    city_code: int | None = None
    city: str
    address: str
    tariff_code: int
    

class OrderCreateSchema(BaseModel):
    goods: list[int] = list()
    certificates: list[dict] = list()
    video_id: int | None = None
    previous_order_id: int | None = Field(None, alias='order_id')
    promocode: uuid.UUID | None = None
    name: str
    surname: str
    patronymic: str
    phone: str
    wishes: str = ''
    cdek: CdekInfoSchema | None = None

    @model_validator(mode='after')
    def check_gotten_id(self):
        if len(self.goods):
            if (self.video_id is None) == (self.previous_order_id is None):
                raise ValueError('Должно быть указано либо video_id, либо order_id, но не оба и не ни одно')
        elif self.video_id or self.previous_order_id:
            raise ValueError('Не переданы товары')
        elif not len(self.certificates):
            raise ValueError('Заказ не может быть пустым')
        return self
