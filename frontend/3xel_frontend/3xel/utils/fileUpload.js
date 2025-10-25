import { buildApiUrl, parseResponseBody } from './apiClient'
import { getCookie } from './cookie'

// Keep well below nginx client_max_body_size=2M to avoid 413 due to multipart overhead
const CHUNK_SIZE = 1 * 1024 * 1024 // 1MB
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

const generateUploadToken = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function uploadFileChunks(file, { onProgress } = {}) {
  if (typeof File !== 'undefined') {
    if (!(file instanceof File)) {
      throw new Error('Передан некорректный файл')
    }
  } else if (!file || typeof file !== 'object' || typeof file.size !== 'number') {
    throw new Error('Передан некорректный файл')
  }

  if (file.size === 0) {
    throw new Error('Файл пустой')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Размер файла превышает 500 МБ')
  }

  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))
  const uploadToken = generateUploadToken()
  const fileName = typeof file.name === 'string' ? file.name : ''
  const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() ?? '' : ''

  let uploadedFileId = null
  const csrfToken = getCookie('csrftoken')

  for (let index = 0; index < totalChunks; index += 1) {
    const start = index * CHUNK_SIZE
    const end = Math.min(file.size, start + CHUNK_SIZE)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('chunk', chunk, fileName || 'chunk')
    formData.append('chunkIndex', index)
    formData.append('totalChunks', totalChunks)
    formData.append('fileId', uploadToken)
    formData.append('format', extension)

    const headers = {}
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const response = await fetch(buildApiUrl('/api-file/upload/'), {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers,
    })

    const payload = await parseResponseBody(response)

    if (!response.ok) {
      const errorMessage = payload?.error || payload?.message || 'Не удалось загрузить файл'
      const error = new Error(errorMessage)
      error.status = response.status
      error.payload = payload
      throw error
    }

    if (payload?.file_id) {
      uploadedFileId = payload.file_id
    }

    if (typeof onProgress === 'function') {
      const progress = Math.round(((index + 1) / totalChunks) * 100)
      onProgress(progress)
    }
  }

  if (!uploadedFileId) {
    throw new Error('Сервер не вернул идентификатор файла')
  }

  return uploadedFileId
}
