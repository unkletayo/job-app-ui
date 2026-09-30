import { api } from "@/lib/api"
import type {
  FetchUrlInput,
  FetchUrlResult,
  JobPosting,
  JobPostingDetail,
  JobPostingSummary,
  ManualPasteInput,
} from "@/lib/types"

export function listJobs(minScore?: number): Promise<JobPostingSummary[]> {
  const query = minScore !== undefined ? `?minScore=${minScore}` : ""
  return api.get<JobPostingSummary[]>(`/dashboard/jobs${query}`)
}

export function getJobPosting(id: string): Promise<JobPostingDetail> {
  return api.get<JobPostingDetail>(`/job-postings/${id}`)
}

/** Raw, unscored postings — every Job Posting regardless of Match Score or
 * hard-filter state. `GET /dashboard/jobs` is the scored, filtered view most
 * of the app uses; this is the underlying full set. */
export function listAllJobPostings(): Promise<JobPosting[]> {
  return api.get<JobPosting[]>("/job-postings")
}

export function manualPasteJob(input: ManualPasteInput): Promise<JobPosting> {
  return api.post<JobPosting>("/job-postings/manual-paste", input)
}

/** Always resolves (never throws on a fetch/robots/denylist failure) —
 * discriminate on `status` to know whether to fall back to manual paste. */
export function fetchJobFromUrl(input: FetchUrlInput): Promise<FetchUrlResult> {
  return api.post<FetchUrlResult>("/job-postings/fetch-url", input)
}

export function reExtractAllJobs(): Promise<{ reExtracted: number }> {
  return api.post<{ reExtracted: number }>("/job-postings/re-extract")
}
