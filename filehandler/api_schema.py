from pydantic import BaseModel, model_validator
from django.core.files.uploadedfile import UploadedFile


class ChunkUploadSchema(BaseModel):
    filename: str
    format: str
    chunk: UploadedFile
    chunk_number: int
    total_chunks: int

    @model_validator(mode='after')
    def check_file_format(self):
        if self.format != 'mp4':
            raise ValueError('Поддерживается только формат mp4')
        return self
    
    @model_validator(mode='after')
    def check_chunk_number(self):
        if self.chunk_number > self.total_chunks - 1:
            raise ValueError('Номер чанка должен быть меньше суммарного количества чанков')
        return self