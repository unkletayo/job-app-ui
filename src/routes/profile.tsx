import { AppShell } from "@/components/app-shell"
import { ProfileFetcher } from "@/components/profile-fetcher"
import { HEADING_FONT } from "@/lib/fonts"

export function ProfilePage() {
  return (
    <AppShell>
      <h1 className="mb-6 text-lg font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
        Candidate Profile
      </h1>
      <ProfileFetcher />
    </AppShell>
  )
}
