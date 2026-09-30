import { useCallback, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { RunHistorySection } from "@/components/run-history-section"
import { SourcesSection } from "@/components/sources-section"
import { WatchedCompaniesSection } from "@/components/watched-companies-section"
import { HEADING_FONT } from "@/lib/fonts"

export function DiscoveryPage() {
  const [refreshSignal, setRefreshSignal] = useState(0)
  const triggerRefresh = useCallback(() => setRefreshSignal((n) => n + 1), [])

  return (
    <AppShell>
      <h1 className="mb-6 text-lg font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
        Job Discovery
      </h1>
      <div className="flex flex-col gap-10">
        <WatchedCompaniesSection />
        <SourcesSection refreshSignal={refreshSignal} onAnyRun={triggerRefresh} />
        <RunHistorySection refreshSignal={refreshSignal} onAnyRun={triggerRefresh} />
      </div>
    </AppShell>
  )
}
