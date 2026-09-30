export type RequirementCategory =
  | "required_skill"
  | "preferred_skill"
  | "experience"
  | "education"
  | "certification"
  | "responsibility"
  | "keyword"

export interface Requirement {
  id: string
  jobPostingId: string
  category: RequirementCategory
  text: string
  createdAt: string
}

export interface MatchReason {
  requirementId: string
  category: string
  requirement: string
  evidence: string
  evidenceType: string
  confidence: "high" | "medium"
}

export interface MatchGap {
  requirementId: string
  category: string
  requirement: string
}

export interface MatchScoreResult {
  excluded: boolean
  exclusionReason: string | null
  score: number | null
  scoreNote: string | null
  reasons: MatchReason[]
  gaps: MatchGap[]
}

export interface JobPostingSummary {
  id: string
  jobClusterId: string
  company: string
  title: string
  description: string
  location: string[]
  remoteType: string | null
  employmentType: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  seniority: string | null
  applicationUrl: string | null
  postedAt: string | null
  matchScore: MatchScoreResult
}

export interface SourcePosting {
  id: string
  source: string
  sourceJobId: string
  fetchedAt: string
}

export interface JobPostingDetail extends JobPostingSummary {
  extractedRequirements: Requirement[]
  jobCluster: {
    id: string
    sourcePostings: SourcePosting[]
  }
}
