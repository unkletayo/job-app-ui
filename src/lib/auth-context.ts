import { createContext } from "react"

export interface AuthenticatedUser {
  id: string
  email: string
}

export interface AuthContextValue {
  user: AuthenticatedUser | null
  /** True while the token in storage is being verified against `/auth/me`
   * on first load — distinct from "no user", so a guarded route doesn't
   * flash the login page before a valid session is confirmed. */
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
