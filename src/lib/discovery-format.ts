import type { DiscoverySourceKey } from "@/lib/types"

export const SOURCE_LABELS: Record<DiscoverySourceKey, string> = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
  smartrecruiters: "SmartRecruiters",
}

export const DEFAULT_INTERVAL_MINUTES = 60

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}
