import { Link } from "react-router-dom"
import { MatchScoreBadge } from "@/components/match-score-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type { JobPostingSummary } from "@/lib/types"

export function JobCard({ job }: { job: JobPostingSummary }) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="rounded-md font-medium" style={{ fontFamily: HEADING_FONT }}>
                {job.company.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
                {job.title}
              </CardTitle>
              <p
                className="truncate text-xs tracking-tight text-muted-foreground"
                style={{ fontFamily: META_FONT }}
              >
                {[job.company, ...job.location].join(" · ")}
              </p>
            </div>
          </div>
          <CardAction>
            <MatchScoreBadge matchScore={job.matchScore} />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  )
}
