import { useState } from "react"
import { AddJobDialog } from "@/components/add-job-dialog"
import { AppShell } from "@/components/app-shell"
import { JobResults, type JobFilter } from "@/components/job-results"
import { ReExtractButton } from "@/components/re-extract-button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HEADING_FONT } from "@/lib/fonts"

export function JobListPage() {
  const [filter, setFilter] = useState<JobFilter>("all")
  const [refreshToken, setRefreshToken] = useState(0)
  const refresh = () => setRefreshToken((token) => token + 1)

  return (
    <AppShell>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
          Jobs
        </h1>
        <div className="flex items-center gap-2">
          <ToggleGroup
            value={[filter]}
            onValueChange={(value: string[]) => {
              if (value.length > 0) setFilter(value[0] as JobFilter)
            }}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="all" aria-label="Show all jobs">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="high-match" aria-label="Show high-match jobs only">
              High match
            </ToggleGroupItem>
          </ToggleGroup>
          <AddJobDialog onAdded={refresh} />
        </div>
      </div>

      <div className="mb-6">
        <ReExtractButton onDone={refresh} />
      </div>

      {/* Keyed by filter+refreshToken so switching views or adding/re-extracting
          jobs starts from a clean loading state instead of a synchronous
          reset inside the fetch effect. */}
      <JobResults key={`${filter}:${refreshToken}`} filter={filter} />
    </AppShell>
  )
}
