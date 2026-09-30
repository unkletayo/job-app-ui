import { HistoryIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { RunRow } from "@/components/run-row"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { listDiscoveryRuns, runAllDiscoverySources } from "@/lib/discovery"
import { HEADING_FONT } from "@/lib/fonts"
import type { DiscoveryRun } from "@/lib/types"

export function RunHistorySection({ refreshSignal, onAnyRun }: { refreshSignal: number; onAnyRun: () => void }) {
  const [runs, setRuns] = useState<DiscoveryRun[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [runAllError, setRunAllError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listDiscoveryRuns()
      .then((result) => {
        if (!cancelled) setRuns(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof ApiError ? err.message : "Unable to load run history. Check your connection and try again.",
        )
      })
    return () => {
      cancelled = true
    }
  }, [refreshSignal])

  async function handleRunAll() {
    setRunAllError(null)
    setIsRunningAll(true)
    try {
      await runAllDiscoverySources()
      onAnyRun()
    } catch (err) {
      setRunAllError(
        err instanceof ApiError ? err.message : "Unable to reach job-app. Check your connection and try again.",
      )
    } finally {
      setIsRunningAll(false)
    }
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
          Run history
        </h2>
        <div className="flex flex-col items-end gap-1">
          <Button size="sm" variant="outline" onClick={handleRunAll} disabled={isRunningAll}>
            {isRunningAll && <Spinner data-icon="inline-start" />}
            Run all sources
          </Button>
          {isRunningAll && (
            <p className="text-xs text-muted-foreground">This can take a minute — fetching from the live APIs.</p>
          )}
          {runAllError && <p className="text-sm text-destructive">{runAllError}</p>}
        </div>
      </div>

      {error && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Unable to load run history</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!error && runs === null && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!error && runs !== null && runs.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HistoryIcon />
            </EmptyMedia>
            <EmptyTitle>No runs yet</EmptyTitle>
            <EmptyDescription>Run a source above to fetch postings from its job board.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!error && runs !== null && runs.length > 0 && (
        <div className="flex flex-col gap-3">
          {runs.map((run) => (
            <RunRow key={run.id} run={run} />
          ))}
        </div>
      )}
    </section>
  )
}
