import { ArrowLeftIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { JobDetailFetcher } from "@/components/job-detail-fetcher"

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
