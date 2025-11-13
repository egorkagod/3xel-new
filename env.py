from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    # File
    UPLOAD_FILE_ROOT: str

    # Pay
    TERMINAL_KEY: str
    TERMINAL_PASSWORD: str

    # Email
    EMAIL_HOST: str
    EMAIL_HOST_USER: str
    EMAIL_HOST_PASSWORD: str

    # Django
    DJANGO_SECRET_KEY: str

    # PostgreSQL
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_CONN_MAX_AGE: int

    #CDEK
    CDEK_URL: str
    CDEK_CLIENT_ID: str
    CDEK_CLIENT_PASSWORD: str

    USE_TEST_CDEK: str = 'true'

    CDEK_TEST_URL: str
    CDEK_TEST_CLIENT_ID: str
    CDEK_TEST_CLIENT_PASSWORD: str

    CDEK_PVZ_CODE: str
    CDEK_SHIPMENT_CITY_CODE: int
    CDEK_SHIPMENT_CITY: str
    CDEK_SHIPMENT_ADDRESS: str

env_settings = Settings()