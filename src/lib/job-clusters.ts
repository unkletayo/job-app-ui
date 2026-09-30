import { api } from "@/lib/api"
import type { JobCluster } from "@/lib/types"

export function listJobClusters(): Promise<JobCluster[]> {
  return api.get<JobCluster[]>("/job-clusters")
}

export function getJobCluster(id: string): Promise<JobCluster> {
  return api.get<JobCluster>(`/job-clusters/${id}`)
}
