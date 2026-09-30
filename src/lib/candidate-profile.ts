import { api } from "@/lib/api"
import type {
  Achievement,
  AchievementInput,
  CandidateProfile,
  CandidateProfileInput,
  Certification,
  CertificationInput,
  Education,
  EducationInput,
  Experience,
  ExperienceInput,
  ProfileLink,
  ProfileLinkInput,
  Project,
  ProjectInput,
  Skill,
  SkillInput,
} from "@/lib/types"

export function getCandidateProfile(): Promise<CandidateProfile> {
  return api.get<CandidateProfile>("/candidate-profile")
}
export function putCandidateProfile(input: CandidateProfileInput): Promise<CandidateProfile> {
  return api.put<CandidateProfile>("/candidate-profile", input)
}
export function deleteCandidateProfile(): Promise<void> {
  return api.delete("/candidate-profile")
}

// One explicit set per entry type — the backend itself reverted a generic
// CRUD-factory for these seven controllers, so the frontend matches that
// same un-abstracted shape rather than parameterizing over entity name.

export const experiences = {
  list: () => api.get<Experience[]>("/candidate-profile/experience"),
  create: (input: ExperienceInput) => api.post<Experience>("/candidate-profile/experience", input),
  update: (id: string, input: Partial<ExperienceInput>) =>
    api.patch<Experience>(`/candidate-profile/experience/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/experience/${id}`),
}

export const educations = {
  list: () => api.get<Education[]>("/candidate-profile/education"),
  create: (input: EducationInput) => api.post<Education>("/candidate-profile/education", input),
  update: (id: string, input: Partial<EducationInput>) =>
    api.patch<Education>(`/candidate-profile/education/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/education/${id}`),
}

export const certifications = {
  list: () => api.get<Certification[]>("/candidate-profile/certification"),
  create: (input: CertificationInput) => api.post<Certification>("/candidate-profile/certification", input),
  update: (id: string, input: Partial<CertificationInput>) =>
    api.patch<Certification>(`/candidate-profile/certification/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/certification/${id}`),
}

export const skills = {
  list: () => api.get<Skill[]>("/candidate-profile/skill"),
  create: (input: SkillInput) => api.post<Skill>("/candidate-profile/skill", input),
  update: (id: string, input: Partial<SkillInput>) => api.patch<Skill>(`/candidate-profile/skill/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/skill/${id}`),
}

export const projects = {
  list: () => api.get<Project[]>("/candidate-profile/project"),
  create: (input: ProjectInput) => api.post<Project>("/candidate-profile/project", input),
  update: (id: string, input: Partial<ProjectInput>) => api.patch<Project>(`/candidate-profile/project/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/project/${id}`),
}

export const links = {
  list: () => api.get<ProfileLink[]>("/candidate-profile/link"),
  create: (input: ProfileLinkInput) => api.post<ProfileLink>("/candidate-profile/link", input),
  update: (id: string, input: Partial<ProfileLinkInput>) =>
    api.patch<ProfileLink>(`/candidate-profile/link/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/link/${id}`),
}

export const achievements = {
  list: () => api.get<Achievement[]>("/candidate-profile/achievement"),
  create: (input: AchievementInput) => api.post<Achievement>("/candidate-profile/achievement", input),
  update: (id: string, input: Partial<AchievementInput>) =>
    api.patch<Achievement>(`/candidate-profile/achievement/${id}`, input),
  remove: (id: string) => api.delete(`/candidate-profile/achievement/${id}`),
}
