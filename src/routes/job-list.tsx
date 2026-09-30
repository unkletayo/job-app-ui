import { BriefcaseIcon, SearchXIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { MatchScoreBadge } from "@/components/match-score-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ApiError } from "@/lib/api"
import { listJobs } from "@/lib/jobs"
import type { JobPostingSummary } from "@/lib/types"

type Filter = "all" | "high-match"

const HIGH_MATCH_MIN_SCORE = 70

export function JobListPage() {
  const [filter, setFilter] = useState<Filter>("all")

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Jobs</h1>
        <ToggleGroup
          value={[filter]}
          onValueChange={(value: string[]) => {
            if (value.length > 0) setFilter(value[0] as Filter)
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="all" aria-label="Show all jobs">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="high-match" aria-label="Show high-match jobs only">
            High match
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Keyed by filter so switching views starts from a clean loading
          state instead of a synchronous reset inside the fetch effect. */}
      <JobResults key={filter} filter={filter} />
    </AppShell>
  )
}

function JobResults({ filter }: { filter: Filter }) {
  const [jobs, setJobs] = useState<JobPostingSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listJobs(filter === "high-match" ? HIGH_MATCH_MIN_SCORE : undefined)
      .then((result) => {
        if (!cancelled) setJobs(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : "Unable to load jobs. Check your connection and try again.")
      })
    return () => {
      cancelled = true
    }
  }, [filter])

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Unable to load jobs</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (jobs === null) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">{filter === "high-match" ? <SearchXIcon /> : <BriefcaseIcon />}</EmptyMedia>
          <EmptyTitle>{filter === "high-match" ? "No high-match jobs yet" : "No jobs yet"}</EmptyTitle>
          <EmptyDescription>
            {filter === "high-match"
              ? "Jobs scoring 70% or higher against your candidate profile will show up here."
              : "Discovered jobs will show up here once they're ingested."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <Link key={job.id} to={`/jobs/${job.id}`}>
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader>
              <div className="flex min-w-0 items-center gap-4">
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback>{job.company.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate">{job.title}</CardTitle>
                  <p className="truncate text-sm text-muted-foreground">{[job.company, ...job.location].join(" · ")}</p>
                </div>
              </div>
              <CardAction>
                <MatchScoreBadge matchScore={job.matchScore} />
              </CardAction>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
