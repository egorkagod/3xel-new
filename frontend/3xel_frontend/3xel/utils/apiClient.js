import { getCookie } from './cookie'

const rawBaseUrl = import.meta?.env?.VITE_API_BASE_URL ?? ''
const API_BASE_URL = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : ''

export const buildApiUrl = (path = '') => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`
  }
  return `${API_BASE_URL}${path}`
}

export const parseResponseBody = async (response) => {
  const contentType = response.headers.get('Content-Type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    return { message: text }
  }
}

export async function apiFetch(path, { method = 'GET', headers = {}, body, ...options } = {}) {
  let requestBody = body
  const finalHeaders = { ...headers }

  const csrfToken = getCookie('csrftoken')
  if (csrfToken) {
    finalHeaders['X-CSRFToken'] = csrfToken
  }

  const isFormData = requestBody instanceof FormData
  if (!isFormData && requestBody && typeof requestBody === 'object' && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(requestBody)
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    credentials: 'include',
    headers: finalHeaders,
    body: requestBody,
    ...options,
  })

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const errorMessage = payload?.error || payload?.detail || payload?.message || 'Запрос завершился ошибкой'
    const error = new Error(errorMessage)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}
