import axios, { type AxiosError } from "axios"

/** Mirrors the backend's global response envelope (job-app's
 * ResponseEnvelopeInterceptor/Filter) — every response that has a body
 * arrives in this shape. A 204 (DELETE) has no body at all. */
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

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function toApiError(error: AxiosError<ResponseEnvelope<unknown>>): ApiError {
  if (error.response) {
    return new ApiError(error.response.data?.responseMessage ?? "Request failed.", error.response.status)
  }
  return new ApiError("Unable to reach the server.", 0)
}

async function request<T>(path: string, config?: Parameters<typeof client.request>[0]): Promise<T> {
  try {
    const response = await client.request<ResponseEnvelope<T>>({ url: path, ...config })
    // A 204 (DELETE) has no envelope to unwrap.
    if (response.status === 204) return undefined as T
    return response.data.responseBody
  } catch (error) {
    if (axios.isAxiosError(error)) throw toApiError(error)
    throw error
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", data: body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", data: body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", data: body }),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
}
