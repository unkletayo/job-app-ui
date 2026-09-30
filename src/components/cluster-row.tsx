import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type { JobCluster } from "@/lib/types"

export function ClusterRow({ cluster }: { cluster: JobCluster }) {
  const card = (
    <Card className="transition-colors hover:bg-accent/50">
      <CardHeader>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
            {cluster.jobPosting?.title ?? "No canonical posting"}
          </CardTitle>
          <p className="truncate text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
            {cluster.jobPosting ? [cluster.jobPosting.company, ...cluster.jobPosting.location].join(" · ") : "—"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cluster.sourcePostings.map((source) => (
              <Badge key={source.id} variant="outline" style={{ fontFamily: META_FONT }}>
                {source.source}
              </Badge>
            ))}
          </div>
        </div>
        <CardAction>
          <Badge variant="secondary" className="tabular-nums" style={{ fontFamily: META_FONT }}>
            {cluster.sourcePostings.length} source{cluster.sourcePostings.length === 1 ? "" : "s"}
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  )

  return cluster.jobPosting ? <Link to={`/jobs/${cluster.jobPosting.id}`}>{card}</Link> : card
}
