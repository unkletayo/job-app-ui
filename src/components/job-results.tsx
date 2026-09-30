import { BriefcaseIcon, SearchXIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { JobCard } from "@/components/job-card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { listJobs } from "@/lib/jobs"
import type { JobPostingSummary } from "@/lib/types"

const HIGH_MATCH_MIN_SCORE = 70

export type JobFilter = "all" | "high-match"

export function JobResults({ filter }: { filter: JobFilter }) {
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
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
