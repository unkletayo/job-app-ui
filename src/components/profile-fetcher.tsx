import { useEffect, useState } from "react"
import { ProfileEntryTabs } from "@/components/profile-entry-tabs"
import { ProfileSummaryForm } from "@/components/profile-summary-form"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { getCandidateProfile } from "@/lib/candidate-profile"
import type { CandidateProfile } from "@/lib/types"

type ProfileLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; profile: CandidateProfile | null }

export function ProfileFetcher() {
  const [state, setState] = useState<ProfileLoadState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    getCandidateProfile()
      .then((profile) => {
        if (!cancelled) setState({ status: "loaded", profile })
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setState({ status: "loaded", profile: null })
          return
        }
        setState({
          status: "error",
          message: err instanceof ApiError ? err.message : "Unable to load your profile. Check your connection and try again.",
        })
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === "error") {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Unable to load profile</EmptyTitle>
          <EmptyDescription>{state.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <ProfileSummaryForm profile={state.profile} />
      <Separator />
      <ProfileEntryTabs />
    </div>
  )
}
