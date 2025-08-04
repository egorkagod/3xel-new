from pathlib import Path
import shutil

from django.conf import settings
from django.core.cache import cache

from .. import statuses
from filehandler.models import File


def upload_chunk(user_id, filename, format, chunk, chunk_number, total_chunks):
    # Логика сохранения части файла
    path = Path(filename) / str(chunk_number)
    chunk_path = _get_or_create_filepath(path, 'chunks')
    with open(chunk_path, 'wb') as f:
        f.write(chunk)

    status = _write_that_chunk_upload(filename, chunk_number, total_chunks)
    file_id = -1
    if status == statuses.ALL_UPLOADED:
        filename = filename + format
        chunks_dir = chunk_path.parent
        filepath, urlpath = _get_or_create_mediapath(filename, 'uploads')
        with open(filepath, 'wb') as f:
            for i in range(0, total_chunks):
                with open(chunks_dir / str(i), 'rb') as chunk_file:
                    f.write(chunk_file.read())
        shutil.rmtree(chunks_dir)

        file = File.objects.create(user_id=user_id, name=filename, path=str(urlpath))
        file_id = file.id

    return file_id, status

def _get_or_create_mediapath(filename, parent_dir='uploads'):
    # Логика создания пути к файлу в MEDIA папку
    urlpath = Path(settings.MEDIA_URL) / parent_dir / filename
    filepath = Path(settings.MEDIA_ROOT) / parent_dir / filename
    filepath.parent.mkdir(parents=True, exist_ok=True)
    return filepath, urlpath
  
def _get_or_create_filepath(filename, parent_dir='uploads'):
    # Логика создания пути к файлу в корень проекта
    filepath = Path(settings.BASE_DIR) / parent_dir / filename
    filepath.parent.mkdir(parents=True, exist_ok=True)
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
    