import { Badge } from "@/components/ui/badge"
import { META_FONT } from "@/lib/fonts"
import type { MatchReason } from "@/lib/types"

export function ReasonRow({ reason }: { reason: MatchReason }) {
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
