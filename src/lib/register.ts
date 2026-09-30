import { api } from "@/lib/api"

/** Single-user backend: only succeeds while zero users exist yet (409 after
 * that). No accessToken is issued — register, then sign in separately. */
export function register(email: string, password: string): Promise<{ id: string; email: string }> {
  return api.post<{ id: string; email: string }>("/auth/register", { email, password })
}
