import { useEffect, useState } from "react"
import { SourceRow } from "@/components/source-row"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { DISCOVERY_SOURCE_KEYS, listDiscoverySources } from "@/lib/discovery"
import { HEADING_FONT } from "@/lib/fonts"
import type { DiscoverySource } from "@/lib/types"

export function SourcesSection({ refreshSignal, onAnyRun }: { refreshSignal: number; onAnyRun: () => void }) {
  const [sources, setSources] = useState<DiscoverySource[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listDiscoverySources()
      .then((result) => {
        if (!cancelled) setSources(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : "Unable to load sources. Check your connection and try again.")
      })
    return () => {
      cancelled = true
    }
  }, [refreshSignal])

  function handleSourceUpdated(updated: DiscoverySource) {
    setSources((prev) => [...(prev ?? []).filter((source) => source.sourceKey !== updated.sourceKey), updated])
  }

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
        Sources
      </h2>

      {error && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Unable to load sources</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!error && sources === null && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!error && sources !== null && (
        <div className="flex flex-col gap-3">
          {DISCOVERY_SOURCE_KEYS.map((key) => (
            <SourceRow
              key={key}
              sourceKey={key}
              source={sources.find((source) => source.sourceKey === key)}
              onUpdated={handleSourceUpdated}
              onRan={onAnyRun}
            />
          ))}
        </div>
      )}
    </section>
  )
}
