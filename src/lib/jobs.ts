import { api } from "@/lib/api"
import type { JobPostingDetail, JobPostingSummary } from "@/lib/types"

export function listJobs(minScore?: number): Promise<JobPostingSummary[]> {
  const query = minScore !== undefined ? `?minScore=${minScore}` : ""
  return api.get<JobPostingSummary[]>(`/dashboard/jobs${query}`)
}

export function getJobPosting(id: string): Promise<JobPostingDetail> {
  return api.get<JobPostingDetail>(`/job-postings/${id}`)
}
