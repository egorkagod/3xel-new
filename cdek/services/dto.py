from pydantic import BaseModel


class CdekOrderRegisterDTO(BaseModel):
    order_id: int
    tariff_code: int
    user_fullname: str
    email: str
    phone: str
    city_code: int | None
    city: str
    pvz_code: str | None
    address: str
    packages: list


class CdekDeliveryGetPriceDTO(BaseModel):
    tariff_code: int
    city_code: int | None
    city: str
    address: str
    packages: list


class CdekOrderCreateDTO(BaseModel):
    order_id: int
    email: str
    user_fullname: str
    tariff_code: int
    city_code: int | None
    city: str
    address: str
    pvz_code: str | None