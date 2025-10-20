from pathlib import Path
import posixpath
import re
import shutil
import uuid

from django.conf import settings
from django.core.cache import cache

from .. import statuses
from filehandler.models import File


def upload_chunk(user_id, filename, format, chunk, chunk_number, total_chunks):
    upload_token = _normalize_identifier(filename)
    # Логика сохранения части файла
    path = Path(str(user_id)) / upload_token / str(chunk_number)
    chunk_path = _get_or_create_filepath(path, 'chunks')
    with open(chunk_path, 'wb') as f:
        f.write(chunk)

    cache_key = _build_cache_key(user_id, upload_token)
    status = _write_that_chunk_upload(cache_key, chunk_number, total_chunks)
    file_id = -1
    if status == statuses.ALL_UPLOADED:
        extension = _sanitize_extension(format)
        storage_name = _generate_storage_name(upload_token, extension)
        relative_path = Path(str(user_id)) / storage_name
        chunks_dir = chunk_path.parent
        filepath, urlpath = _get_or_create_mediapath(relative_path, 'uploads')
        with open(filepath, 'wb') as f:
            for i in range(0, total_chunks):
                with open(chunks_dir / str(i), 'rb') as chunk_file:
                    f.write(chunk_file.read())
        shutil.rmtree(chunks_dir)

        file = File.objects.create(user_id=user_id, name=storage_name, path=urlpath)
        file_id = file.id

    return file_id, status

def _get_or_create_mediapath(filename, parent_dir='uploads'):
    # Логика создания пути к файлу в MEDIA папку
    relative = Path(filename)
    filepath = Path(settings.MEDIA_ROOT) / parent_dir / relative
    filepath.parent.mkdir(parents=True, exist_ok=True)
    media_url = settings.MEDIA_URL.rstrip('/')
    if media_url:
        urlpath = posixpath.join(media_url, parent_dir, relative.as_posix())
    else:
        urlpath = posixpath.join('/', parent_dir, relative.as_posix())
    return filepath, urlpath
  
def _get_or_create_filepath(filename, parent_dir='uploads'):
    # Логика создания пути к файлу в корень проекта
    filepath = Path(settings.BASE_DIR) / parent_dir / Path(filename)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    return filepath

def _write_that_chunk_upload(cache_key, chunk_number, total_chunks):
    # Логика записи, что эта часть файла загружена
    uploaded_chunks = set(cache.get(cache_key, set()))
    uploaded_chunks.add(chunk_number)
    cache.set(cache_key, uploaded_chunks, None)

    if len(uploaded_chunks) == total_chunks:
        cache.delete(cache_key)
        return statuses.ALL_UPLOADED
    return statuses.UPLOADED

def _normalize_identifier(identifier: str) -> str:
    sanitized = re.sub(r'[^A-Za-z0-9_-]', '', identifier)
    hash_suffix = uuid.uuid5(uuid.NAMESPACE_URL, identifier).hex[:12]
    base = sanitized.lower()[:50] if sanitized else 'file'
    token = f'{base}-{hash_suffix}'
    return token[:100]

def _sanitize_extension(file_format: str) -> str:
    sanitized = re.sub(r'[^A-Za-z0-9]', '', file_format)
    if not sanitized:
        return ''
    return f'.{sanitized.lower()}'

def _generate_storage_name(base: str, extension: str) -> str:
    normalized_base = base[:50] or 'file'
    while True:
        candidate = f'{normalized_base}-{uuid.uuid4().hex}{extension}'
        if not File.objects.filter(name=candidate).exists():
            return candidate

def _build_cache_key(user_id: int, identifier: str) -> str:
    return f'file-upload:{user_id}:{identifier}'
    
