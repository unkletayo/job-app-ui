import { InboxIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import { listAllJobPostings } from "@/lib/jobs"
import type { JobPosting } from "@/lib/types"

export function PostingList() {
  const [postings, setPostings] = useState<JobPosting[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listAllJobPostings()
      .then((result) => {
        if (!cancelled) setPostings(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : "Unable to load postings. Check your connection and try again.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Unable to load postings</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (postings === null) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (postings.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No postings yet</EmptyTitle>
          <EmptyDescription>Every posting ingested from any source, unscored and unfiltered, shows up here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {postings.map((posting) => (
        <Link key={posting.id} to={`/jobs/${posting.id}`}>
          <Card className="py-3 transition-colors hover:bg-accent/50">
            <CardHeader>
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-sm font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
                  {posting.title}
                </CardTitle>
                <p className="truncate text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
                  {[posting.company, ...posting.location].join(" · ")}
                </p>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
