import { useEffect, useState, type ReactNode } from "react"
import { api, clearToken, getToken, setToken } from "@/lib/api"
import { AuthContext, type AuthenticatedUser } from "@/lib/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  // A token is already known synchronously at mount, so the initializer (not
  // an effect) decides whether there's anything to verify — the effect below
  // only ever calls setState from inside the async `/auth/me` callback.
  const [isLoading, setIsLoading] = useState(() => getToken() !== null)

  useEffect(() => {
    if (!getToken()) return
    api
      .get<AuthenticatedUser>("/auth/me")
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { accessToken } = await api.post<{ accessToken: string }>("/auth/login", {
      email,
      password,
    })
    setToken(accessToken)
    setUser(await api.get<AuthenticatedUser>("/auth/me"))
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}
