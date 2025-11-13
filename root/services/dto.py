from pydantic import BaseModel


class UserChangeDataDTO(BaseModel):
    user_id: int
    name: str
    surname: str
    patronymic: str
    phone: str