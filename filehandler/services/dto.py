from pydantic import BaseModel


class ChunkUploadServiceDTO(BaseModel):
    user_id: int
    filename: str
    format: str
    chunk_number: int
    total_chunks: int


class ChunkUploadResponseServiceDTO(BaseModel):
    file_id: int | None
    status: int


class VideoMoveServiceDTO(BaseModel):
    video_id: int
    order_id: int