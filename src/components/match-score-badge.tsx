import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { META_FONT } from "@/lib/fonts"
import type { MatchScoreResult } from "@/lib/types"

/** Score at or above this reads as a strong match (the `match` badge
 * variant); below it, and any withheld score, stays neutral — a lower
 * number isn't a failure state, just a weaker signal. */
const STRONG_MATCH_THRESHOLD = 70

export function MatchScoreBadge({ matchScore }: { matchScore: MatchScoreResult }) {
  if (matchScore.score === null) {
    const badge = (
      <Badge variant="outline" className="tabular-nums" style={{ fontFamily: META_FONT }}>
        No score
      </Badge>
    )
    return matchScore.scoreNote ? (
      <Tooltip>
        <TooltipTrigger render={badge} />
        <TooltipContent>{matchScore.scoreNote}</TooltipContent>
      </Tooltip>
    ) : (
      badge
    )
  }

  return (
    <Badge
      variant={matchScore.score >= STRONG_MATCH_THRESHOLD ? "match" : "secondary"}
      className="tabular-nums"
      style={{ fontFamily: META_FONT }}
    >
      {matchScore.score}% match
    </Badge>
  )
}
