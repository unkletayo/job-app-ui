import { LogOutIcon } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HEADING_FONT } from "@/lib/fonts"
import { useAuth } from "@/lib/use-auth"

const NAV_LINKS = [
  { to: "/", label: "Jobs" },
  { to: "/clusters", label: "Clusters" },
  { to: "/discovery", label: "Discovery" },
  { to: "/preferences", label: "Preferences" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
              Job Tracker
            </Link>
            <nav className="flex items-center gap-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "text-sm text-muted-foreground hover:text-foreground",
                      isActive && "font-medium text-foreground",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
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
