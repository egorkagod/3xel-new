from pathlib import Path
import re
import unicodedata
import uuid
import shutil

from django.conf import settings

from env import env_settings
from .. import statuses
from filehandler.models import File
from .dto import ChunkUploadServiceDTO, ChunkUploadResponseServiceDTO


def upload_chunk(dto: ChunkUploadServiceDTO, chunk) -> ChunkUploadResponseServiceDTO:
    file = None

    user_folder_path = Path(settings.BASE_DIR) / env_settings.UPLOAD_FILE_ROOT / f'{dto.user_id}'
    chunk_path = user_folder_path / f'{_normalize_filename(dto.filename)}' / f'{dto.chunk_number}'
    chunk_path.parent.mkdir(parents=True, exist_ok=True)
    with open(chunk_path, 'wb') as f:
        f.write(chunk.read())

    status = statuses.UPLOADED
    if dto.chunk_number + 1 == dto.total_chunks:
        chunk_folder = chunk_path.parent
        upload_path = user_folder_path / f'{uuid.uuid4()}.{dto.format}'
        with open(upload_path, 'wb') as f:
            for i in range(0, dto.total_chunks):
                with open(chunk_folder / f'{i}', 'rb') as chunk:
                    shutil.copyfileobj(chunk, f)
        shutil.rmtree(chunk_folder)
        file = File.objects.create(
            user_id=dto.user_id,
            path=str(upload_path),
        )
        status = statuses.ALL_UPLOADED
    
    return ChunkUploadResponseServiceDTO(
        file_id=file.pk if file else None,
        status=status,
    )

def _normalize_filename(filename: str) -> str:
    # Убираем управляющие символы и пробелы
    filename = filename.strip()

    # Заменим опасные символы (в т.ч. :, *, ?, ", <, >, |)
    filename = re.sub(r'[<>:"/\\|?*\x00-\x1F]', '_', filename)

    # Убираем Unicode-мусор (например, странные пробелы)
    filename = unicodedata.normalize('NFKC', filename)

    # На всякий случай — не допускаем ".."
    filename = filename.replace('..', '')

    return filename