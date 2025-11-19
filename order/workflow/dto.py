import uuid
from pydantic import BaseModel


class CdekInfoDTO(BaseModel):
    city_code: int | None
    city: str
    address: str
    tariff_code: int
    

class OrderCreateWorkflowDTO(BaseModel):
    user_id: int
    certificates: list[dict] | None
    goods: list[int] | None
    promocode: uuid.UUID | None
    # Может быть как id файла, так и ссылка
    video_id: str | None
    previous_order_id: int | None
    name: str
    surname: str
    patronymic: str
    phone: str
    wishes: str
    cdek: CdekInfoDTO | None
