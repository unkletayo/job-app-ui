import { useEffect, useState } from "react"
import { JobDetailContent } from "@/components/job-detail-content"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { getJobPosting } from "@/lib/jobs"
import type { JobPostingDetail } from "@/lib/types"

export function JobDetailFetcher({ id }: { id: string }) {
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
