from pathlib import Path
import shutil

from django.conf import settings
from django.core.cache import cache

from .. import statuses
from filehandler.models import File


def upload_chunk(filename, chunk, chunk_number, total_chunks):
    # Логика сохранения части файла
    chunks_dir = _get_or_create_filepath(filename, 'chunks')
    with open(chunks_dir / str(chunk_number), 'wb') as f:
        f.write(chunk)

    status = _write_that_chunk_upload(filename, chunk_number, total_chunks)
    if status == statuses.ALL_UPLOADED:
        filepath = _get_or_create_filepath(filename, 'uploads')
        with open(filepath / filename, 'wb') as f:
            for i in range(0, total_chunks):
                with open(chunks_dir / str(i), 'rb') as chunk_file:
                    f.write(chunk_file.read())
        shutil.rmtree(chunks_dir)
        file_id = File.objects.create(name=filename, path=str(filepath))
    return file_id, status

  
def _get_or_create_filepath(filename, parent_dir='uploads'):
    # Логика создания пути к файлу
    filepath = Path(settings.BASE_DIR) / parent_dir / filename
    filepath.mkdir(parents=True, exist_ok=True)
    return filepath

def _write_that_chunk_upload(filename, chunk_number, total_chunks):
    # Логика записи, что эта часть файла загружена
    if bufer := cache.get(filename) is None:
        cache.set(filename, {chunk_number,}, None)
    else:
        bufer = cache.get(filename)
        bufer.add(chunk_number)
        cache.set(filename, bufer, None)
    
    if len(cache.get(filename)) == total_chunks:
        cache.delete(filename)
        return statuses.ALL_UPLOADED
    return statuses.UPLOADED
    