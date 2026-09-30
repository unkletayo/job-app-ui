import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { ApiError } from "@/lib/api"
import { patchDiscoverySource, runDiscoverySource } from "@/lib/discovery"
import { DEFAULT_INTERVAL_MINUTES, SOURCE_LABELS, formatTimestamp } from "@/lib/discovery-format"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type { DiscoverySource, DiscoverySourceKey } from "@/lib/types"

export function SourceRow({
  sourceKey,
  source,
  onUpdated,
  onRan,
}: {
  sourceKey: DiscoverySourceKey
  source: DiscoverySource | undefined
  onUpdated: (updated: DiscoverySource) => void
  onRan: () => void
}) {
  const intervalId = useId()
  const [draftInterval, setDraftInterval] = useState(source?.intervalMinutes ?? DEFAULT_INTERVAL_MINUTES)
  const [isTogglingEnabled, setIsTogglingEnabled] = useState(false)
  const [isSavingInterval, setIsSavingInterval] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enabled = source?.enabled ?? false
  const currentInterval = source?.intervalMinutes ?? DEFAULT_INTERVAL_MINUTES
  const intervalDirty = draftInterval !== currentInterval

  const timestampLabel = !source
    ? "Never configured"
    : source.lastSuccessfulRunAt
      ? `Last run ${formatTimestamp(source.lastSuccessfulRunAt)}`
      : "Configured — no successful run yet"

  async function handleToggle(next: boolean) {
    setError(null)
    setIsTogglingEnabled(true)
    try {
      const updated = await patchDiscoverySource(sourceKey, { enabled: next })
      onUpdated(updated)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to update this source. Check your connection and try again.",
      )
    } finally {
      setIsTogglingEnabled(false)
    }
  }

  async function handleSaveInterval() {
    setError(null)
    setIsSavingInterval(true)
    try {
      const updated = await patchDiscoverySource(sourceKey, { intervalMinutes: draftInterval })
      onUpdated(updated)
      setDraftInterval(updated.intervalMinutes)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to update this source. Check your connection and try again.",
      )
    } finally {
      setIsSavingInterval(false)
    }
  }

  async function handleRun() {
    setError(null)
    setIsRunning(true)
    try {
      await runDiscoverySource(sourceKey)
      onRan()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to reach job-app. Check your connection and try again.",
      )
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isTogglingEnabled}
            aria-label={`${enabled ? "Disable" : "Enable"} ${SOURCE_LABELS[sourceKey]}`}
          />
          <div className="min-w-0 flex-1">
            <CardTitle style={{ fontFamily: HEADING_FONT }}>{SOURCE_LABELS[sourceKey]}</CardTitle>
            <p className="text-xs tracking-tight text-muted-foreground tabular-nums" style={{ fontFamily: META_FONT }}>
              {timestampLabel}
            </p>
          </div>
        </div>
        <CardAction>
          <Button size="sm" variant="outline" onClick={handleRun} disabled={isRunning}>
            {isRunning && <Spinner data-icon="inline-start" />}
            Run now
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <Field className="w-36">
          <FieldLabel htmlFor={intervalId}>Interval (minutes)</FieldLabel>
          <Input
            id={intervalId}
            type="number"
            min={1}
            className="tabular-nums"
            style={{ fontFamily: META_FONT }}
            value={draftInterval}
            onChange={(event) => setDraftInterval(Number(event.target.value))}
          />
        </Field>
        {intervalDirty && (
          <Button size="sm" variant="secondary" onClick={handleSaveInterval} disabled={isSavingInterval}>
            {isSavingInterval && <Spinner data-icon="inline-start" />}
            Save
          </Button>
        )}
        {isRunning && (
          <p className="text-xs text-muted-foreground">This can take a minute — fetching from the live API.</p>
        )}
        {error && <p className="w-full text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
