import { api } from "@/lib/api"
import type { JobPreferences, JobPreferencesInput } from "@/lib/types"

export function getJobPreferences(): Promise<JobPreferences> {
  return api.get<JobPreferences>("/job-preferences")
}

export function patchJobPreferences(input: JobPreferencesInput): Promise<JobPreferences> {
  return api.patch<JobPreferences>("/job-preferences", input)
}
