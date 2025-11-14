from pydantic import BaseModel, model_validator, Field


class ChunkUploadSchema(BaseModel):
    filename: str = Field(alias='fileId')
    format: str
    chunk_number: int = Field(alias='chunkIndex')
    total_chunks: int = Field(alias='totalChunks')

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
