import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SOURCE_LABELS, formatTimestamp } from "@/lib/discovery-format"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type { DiscoveryRun, DiscoverySourceKey } from "@/lib/types"

export function RunRow({ run }: { run: DiscoveryRun }) {
  const variant = run.status === "succeeded" ? "match" : run.status === "failed" ? "destructive" : "secondary"
  const sourceKey = run.source?.sourceKey as DiscoverySourceKey | undefined

  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <Badge variant={variant} style={{ fontFamily: META_FONT }}>
            {run.status}
          </Badge>
          <div className="min-w-0 flex-1">
            <CardTitle style={{ fontFamily: HEADING_FONT }}>
              {sourceKey ? SOURCE_LABELS[sourceKey] : "Unknown source"}
            </CardTitle>
            <p className="truncate text-xs tracking-tight text-muted-foreground tabular-nums" style={{ fontFamily: META_FONT }}>
              {formatTimestamp(run.startedAt)}
              {run.finishedAt ? ` – ${formatTimestamp(run.finishedAt)}` : " – running"}
            </p>
          </div>
        </div>
        <CardAction>
          <p className="text-xs tracking-tight text-muted-foreground tabular-nums" style={{ fontFamily: META_FONT }}>
            {run.jobsFetched} fetched · {run.jobsMerged} merged · {run.jobsCreated} created
          </p>
        </CardAction>
      </CardHeader>
      {run.errorMessage && (
        <CardContent>
          <Tooltip>
            <TooltipTrigger render={<p tabIndex={0} className="cursor-default truncate text-sm text-destructive" />}>
              {run.errorMessage}
            </TooltipTrigger>
            <TooltipContent>{run.errorMessage}</TooltipContent>
          </Tooltip>
        </CardContent>
      )}
    </Card>
  )
}
