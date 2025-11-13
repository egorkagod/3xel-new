from pydantic import BaseModel, model_validator


class CdekInfoSchema(BaseModel):
    city_code: int | None = None
    city: str
    address: str
    tariff_code: int
    

class OrderCreateSchema(BaseModel):
    goods: list[int]
    video_id: int | None = None
    previous_order_id: int | None = None
    name: str
    surname: str
    patronymic: str
    phone: str
    wishes: str = ''
    cdek: CdekInfoSchema

    @model_validator(mode='after')
    def check_gotten_id(self):
        if (self.video_id is None) == (self.previous_order_id is None):
            raise ValueError('Должно быть указано либо video_id, либо order_id, но не оба и не ни одно')
        return self
