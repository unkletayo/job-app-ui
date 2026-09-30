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
  userId: string
  jobClusterId: string
  source: string
  sourceJobId: string
  rawData: unknown
  fetchedAt: string
}

export interface JobPostingDetail extends JobPostingSummary {
  extractedRequirements: Requirement[]
  jobCluster: {
    id: string
    sourcePostings: SourcePosting[]
  }
}

/** The raw shape from `GET /job-postings` and nested under a Job Cluster —
 * no Match Score, no relations (that's what `JobPostingSummary`/`JobPostingDetail` add). */
export interface JobPosting {
  id: string
  userId: string
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
  skills: string[]
  requirements: string[]
  preferredQualifications: string[]
  educationRequirements: string[]
  experienceRequirements: string[]
  applicationUrl: string | null
  postedAt: string | null
  deadline: string | null
  sourceUpdatedAt: string | null
  lastUpdated: string
  createdAt: string
}

export interface JobCluster {
  id: string
  userId: string
  createdAt: string
  lastUpdated: string
  jobPosting: JobPosting | null
  sourcePostings: SourcePosting[]
}

// ---------------------------------------------------------------------------
// Candidate Profile
// ---------------------------------------------------------------------------

export interface CandidateProfile {
  id: string
  userId: string
  fullName: string | null
  contactEmail: string | null
  phone: string | null
  location: string | null
  workAuthorization: string | null
  professionalSummary: string | null
  source: "user_profile"
  verified: boolean
  lastUpdated: string
  createdAt: string
}

export type CandidateProfileInput = Partial<
  Pick<
    CandidateProfile,
    "fullName" | "contactEmail" | "phone" | "location" | "workAuthorization" | "professionalSummary"
  >
>

/** Fields every Candidate Profile entry (experience, education, ...) shares
 * beyond its own content fields. */
interface EntryBase {
  id: string
  userId: string
  source: string
  verified: boolean
  lastUpdated: string
  createdAt: string
}

export interface Experience extends EntryBase {
  company: string
  title: string
  location: string | null
  startDate: string
  endDate: string | null
  description: string | null
}
export type ExperienceInput = {
  company: string
  title: string
  location?: string
  startDate: string
  endDate?: string
  description?: string
}

export interface Education extends EntryBase {
  institution: string
  degree: string
  fieldOfStudy: string | null
  startDate: string | null
  endDate: string | null
}
export type EducationInput = {
  institution: string
  degree: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
}

export interface Certification extends EntryBase {
  name: string
  issuer: string
  issueDate: string | null
  expirationDate: string | null
}
export type CertificationInput = { name: string; issuer: string; issueDate?: string; expirationDate?: string }

export interface Skill extends EntryBase {
  name: string
}
export type SkillInput = { name: string }

export interface Project extends EntryBase {
  name: string
  description: string | null
  technologies: string[]
}
export type ProjectInput = { name: string; description?: string; technologies?: string[] }

export interface ProfileLink extends EntryBase {
  label: string
  url: string
}
export type ProfileLinkInput = { label: string; url: string }

export interface Achievement extends EntryBase {
  description: string
}
export type AchievementInput = { description: string }

// ---------------------------------------------------------------------------
// Job Preferences
// ---------------------------------------------------------------------------

export interface JobPreferences {
  id: string
  userId: string
  targetRoles: string[]
  seniority: string[]
  locations: string[]
  remotePreference: boolean | null
  hybridPreference: boolean | null
  minimumSalaryAmount: number | null
  minimumSalaryCurrency: string | null
  employmentTypes: string[]
  requiredTechnologies: string[]
  preferredTechnologies: string[]
  excludedCompanies: string[]
  excludedTitles: string[]
  keywords: string[]
  negativeKeywords: string[]
  lastUpdated: string
  createdAt: string
}

export type JobPreferencesInput = Partial<
  Omit<JobPreferences, "id" | "userId" | "lastUpdated" | "createdAt">
>

// ---------------------------------------------------------------------------
// Job Discovery
// ---------------------------------------------------------------------------

export type DiscoverySourceKey = "greenhouse" | "lever" | "ashby" | "smartrecruiters"

export interface WatchedCompany {
  id: string
  userId: string
  source: DiscoverySourceKey
  boardToken: string
  label: string
  enabled: boolean
  createdAt: string
  lastUpdated: string
}
export type WatchedCompanyInput = { source: DiscoverySourceKey; boardToken: string; label: string }

export interface DiscoverySource {
  id: string
  userId: string
  sourceKey: string
  enabled: boolean
  intervalMinutes: number
  requestsPerMinute: number
  lastSuccessfulRunAt: string | null
  lastCursor: string | null
  lastSeenJobId: string | null
  createdAt: string
  lastUpdated: string
}
export type DiscoverySourceInput = Partial<
  Pick<DiscoverySource, "enabled" | "intervalMinutes" | "requestsPerMinute">
>

export interface DiscoveryRun {
  id: string
  userId: string
  sourceId: string
  status: "running" | "succeeded" | "failed"
  startedAt: string
  finishedAt: string | null
  jobsFetched: number
  jobsMerged: number
  jobsCreated: number
  failureCount: number
  errorMessage: string | null
  createdAt: string
  lastUpdated: string
  source?: { sourceKey: string }
}

// ---------------------------------------------------------------------------
// Job Postings — manual paste / fetch-url
// ---------------------------------------------------------------------------

export type ManualPasteInput = {
  title: string
  company: string
  location?: string
  description: string
  url?: string
}

export type FetchUrlInput = { title: string; company: string; location?: string; url: string }
export type FetchUrlResult =
  | { status: "ingested"; jobPosting: JobPosting }
  | { status: "needs_manual_paste"; reason: string }
