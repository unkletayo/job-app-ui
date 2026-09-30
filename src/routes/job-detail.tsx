import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { MatchScoreBadge } from "@/components/match-score-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import { getJobPosting } from "@/lib/jobs"
import type { JobPostingDetail, MatchGap, MatchReason } from "@/lib/types"

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AppShell>
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" />
        Back to jobs
      </Link>

      {/* Keyed by id so navigating between two job details starts from a
          clean loading state instead of a synchronous reset inside the
          fetch effect. */}
      {id && <JobDetailFetcher key={id} id={id} />}
    </AppShell>
  )
}

function JobDetailFetcher({ id }: { id: string }) {
  const [job, setJob] = useState<JobPostingDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getJobPosting(id)
      .then((result) => {
        if (!cancelled) setJob(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof ApiError && err.status === 404
            ? "This job posting doesn't exist, or belongs to another account."
            : "Unable to load this job. Check your connection and try again.",
        )
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (error) {
    return (
      <Empty>
        <EmptyTitle>Unable to load job</EmptyTitle>
        <EmptyDescription>{error}</EmptyDescription>
      </Empty>
    )
  }

  if (!job) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return <JobDetailContent job={job} />
}

function JobDetailContent({ job }: { job: JobPostingDetail }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-balance" style={{ fontFamily: HEADING_FONT }}>
            {job.title}
          </h1>
          <p className="text-sm tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
            {[job.company, ...job.location].join(" · ")}
          </p>
        </div>
        {job.applicationUrl && (
          <Button render={<a href={job.applicationUrl} target="_blank" rel="noreferrer" />}>
            Apply
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        )}
      </div>

      {job.matchScore.excluded ? (
        <Alert>
          <AlertTitle>Filtered out by your Job Preferences</AlertTitle>
          <AlertDescription>{job.matchScore.exclusionReason}</AlertDescription>
        </Alert>
      ) : (
        <MatchScoreSection matchScore={job.matchScore} />
      )}

      <Separator />

      <div>
        <h2 className="mb-2 text-sm font-medium">Description</h2>
        <p className="text-sm whitespace-pre-wrap text-pretty text-muted-foreground">{job.description}</p>
      </div>

      {job.jobCluster.sourcePostings.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium">Sources</h2>
          <div className="flex flex-wrap gap-2">
            {job.jobCluster.sourcePostings.map((source) => (
              <Badge key={source.id} variant="outline" style={{ fontFamily: META_FONT }}>
                {source.source}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MatchScoreSection({ matchScore }: { matchScore: JobPostingDetail["matchScore"] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <MatchScoreBadge matchScore={matchScore} />
        {matchScore.scoreNote && <p className="text-sm text-muted-foreground">{matchScore.scoreNote}</p>}
      </div>

      {matchScore.reasons.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium">Matched</h2>
          <ul className="flex flex-col gap-2">
            {matchScore.reasons.map((reason) => (
              <ReasonRow key={reason.requirementId} reason={reason} />
            ))}
          </ul>
        </div>
      )}

      {matchScore.gaps.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium">Gaps</h2>
          <ul className="flex flex-col gap-2">
            {matchScore.gaps.map((gap) => (
              <GapRow key={gap.requirementId} gap={gap} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ReasonRow({ reason }: { reason: MatchReason }) {
  return (
    <li className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-pretty">{reason.requirement}</p>
        <Badge
          variant={reason.confidence === "high" ? "match" : "secondary"}
          className="shrink-0"
          style={{ fontFamily: META_FONT }}
        >
          {reason.confidence} confidence
        </Badge>
      </div>
      <p className="mt-1 text-sm text-pretty text-muted-foreground">{reason.evidence}</p>
    </li>
  )
}

function GapRow({ gap }: { gap: MatchGap }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-3">
      <p className="text-sm text-pretty text-muted-foreground">{gap.requirement}</p>
      <Badge variant="outline" className="shrink-0" style={{ fontFamily: META_FONT }}>
        Gap
      </Badge>
    </li>
  )
}
