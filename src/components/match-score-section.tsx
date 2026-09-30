import { GapRow } from "@/components/gap-row"
import { MatchScoreBadge } from "@/components/match-score-badge"
import { ReasonRow } from "@/components/reason-row"
import type { JobPostingDetail } from "@/lib/types"

export function MatchScoreSection({ matchScore }: { matchScore: JobPostingDetail["matchScore"] }) {
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
