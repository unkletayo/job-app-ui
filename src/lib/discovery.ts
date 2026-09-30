import { api } from "@/lib/api"
import type {
  DiscoverySource,
  DiscoverySourceInput,
  DiscoverySourceKey,
  DiscoveryRun,
  WatchedCompany,
  WatchedCompanyInput,
} from "@/lib/types"

export function listWatchedCompanies(): Promise<WatchedCompany[]> {
  return api.get<WatchedCompany[]>("/discovery/watched-companies")
}
export function addWatchedCompany(input: WatchedCompanyInput): Promise<WatchedCompany> {
  return api.post<WatchedCompany>("/discovery/watched-companies", input)
}
export function removeWatchedCompany(id: string): Promise<void> {
  return api.delete(`/discovery/watched-companies/${id}`)
}

export function listDiscoverySources(): Promise<DiscoverySource[]> {
  return api.get<DiscoverySource[]>("/discovery/sources")
}
export function patchDiscoverySource(
  sourceKey: DiscoverySourceKey,
  input: DiscoverySourceInput,
): Promise<DiscoverySource> {
  return api.patch<DiscoverySource>(`/discovery/sources/${sourceKey}`, input)
}
/** Synchronous — blocks until the adapter finishes paging the real source's
 * API. Callers need a long-running spinner state, not fire-and-forget. */
export function runDiscoverySource(sourceKey: DiscoverySourceKey): Promise<DiscoveryRun> {
  return api.post<DiscoveryRun>(`/discovery/sources/${sourceKey}/run`)
}

export function listDiscoveryRuns(): Promise<DiscoveryRun[]> {
  return api.get<DiscoveryRun[]>("/discovery/runs")
}
/** Runs all registered adapters sequentially and synchronously — can be slow. */
export function runAllDiscoverySources(): Promise<DiscoveryRun[]> {
  return api.post<DiscoveryRun[]>("/discovery/run")
}

export const DISCOVERY_SOURCE_KEYS: DiscoverySourceKey[] = ["greenhouse", "lever", "ashby", "smartrecruiters"]
