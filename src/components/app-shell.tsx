import { LogOutIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { HEADING_FONT } from "@/lib/fonts"
import { useAuth } from "@/lib/use-auth"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
            Job Tracker
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOutIcon data-icon="inline-start" />
            Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  )
}
