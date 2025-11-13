from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # File
    UPLOAD_FILE_ROOT: str = "media/uploads"

    # Pay
    TERMINAL_KEY: str = ""
    TERMINAL_PASSWORD: str = ""

    # Email
    EMAIL_HOST: str = ""
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""

    # Django
    DJANGO_SECRET_KEY: str = ""

    # PostgreSQL (не используются напрямую здесь, но задаём дефолты для валидации)
    POSTGRES_DB: str = "online_shop"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_CONN_MAX_AGE: int = 60

    # CDEK
    CDEK_URL: str = "https://api.cdek.ru"
    CDEK_CLIENT_ID: str = ""
    CDEK_CLIENT_PASSWORD: str = ""

    USE_TEST_CDEK: str = 'true'

    CDEK_TEST_URL: str = "https://api.edu.cdek.ru"
    CDEK_TEST_CLIENT_ID: str = ""
    CDEK_TEST_CLIENT_PASSWORD: str = ""

    CDEK_PVZ_CODE: str = ""
    CDEK_SHIPMENT_CITY_CODE: int = 0
    CDEK_SHIPMENT_CITY: str = ""
    CDEK_SHIPMENT_ADDRESS: str = ""


env_settings = Settings()
