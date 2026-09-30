import { ExternalLinkIcon } from "lucide-react"
import { MatchScoreSection } from "@/components/match-score-section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type { JobPostingDetail } from "@/lib/types"

export function JobDetailContent({ job }: { job: JobPostingDetail }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-balance" style={{ fontFamily: HEADING_FONT }}>
            {job.title}
          </h1>
          <p className="text-sm tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
            {[job.company, ...job.location].join(" · ")}
          </p>
        </div>
        {job.applicationUrl && (
          <Button render={<a href={job.applicationUrl} target="_blank" rel="noreferrer" />}>
            Apply
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        )}
      </div>

      {job.matchScore.excluded ? (
        <Alert>
          <AlertTitle>Filtered out by your Job Preferences</AlertTitle>
          <AlertDescription>{job.matchScore.exclusionReason}</AlertDescription>
        </Alert>
      ) : (
        <MatchScoreSection matchScore={job.matchScore} />
      )}

      <Separator />

      <div>
        <h2 className="mb-2 text-sm font-medium">Description</h2>
        <p className="text-sm whitespace-pre-wrap text-pretty text-muted-foreground">{job.description}</p>
      </div>

      {job.jobCluster.sourcePostings.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium">Sources</h2>
          <div className="flex flex-wrap gap-2">
            {job.jobCluster.sourcePostings.map((source) => (
              <Badge key={source.id} variant="outline" style={{ fontFamily: META_FONT }}>
                {source.source}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
