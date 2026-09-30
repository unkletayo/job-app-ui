const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/** Mirrors the backend's global response envelope (job-app's
 * ResponseEnvelopeInterceptor/Filter) — every response, success or error,
 * arrives in this shape. */
interface ResponseEnvelope<T> {
  requestSuccessful: boolean
  responseMessage: string
  responseCode: string
  responseBody: T
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

const TOKEN_STORAGE_KEY = "job-app-ui:accessToken"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  const envelope = (await response.json()) as ResponseEnvelope<T>
  if (!response.ok || !envelope.requestSuccessful) {
    throw new ApiError(envelope.responseMessage, response.status)
  }
  return envelope.responseBody
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
}
