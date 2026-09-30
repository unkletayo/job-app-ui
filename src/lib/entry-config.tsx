import {
  AwardIcon,
  BriefcaseIcon,
  ExternalLinkIcon,
  FolderKanbanIcon,
  GraduationCapIcon,
  LinkIcon,
  SparklesIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { achievements, certifications, educations, experiences, links, projects, skills } from "@/lib/candidate-profile"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type {
  Achievement,
  AchievementInput,
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

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export type FieldKind = "text" | "url" | "date" | "textarea" | "tags"

export interface FieldSpec {
  key: string
  label: string
  kind: FieldKind
  required?: boolean
}

export type FormValues = Record<string, string>

export function emptyFormValues(fields: FieldSpec[]): FormValues {
  return Object.fromEntries(fields.map((field) => [field.key, ""]))
}

export function entryToFormValues<TEntry extends object>(entry: TEntry, fields: FieldSpec[]): FormValues {
  const record = entry as Record<string, unknown>
  const values: FormValues = {}
  for (const field of fields) {
    const raw = record[field.key]
    if (field.kind === "tags") {
      values[field.key] = Array.isArray(raw) ? raw.join(", ") : ""
    } else if (typeof raw === "string") {
      values[field.key] = field.kind === "date" ? raw.slice(0, 10) : raw
    } else {
      values[field.key] = ""
    }
  }
  return values
}

export function formValuesToInput(values: FormValues, fields: FieldSpec[]): Record<string, unknown> {
  const input: Record<string, unknown> = {}
  for (const field of fields) {
    const raw = (values[field.key] ?? "").trim()
    if (field.kind === "tags") {
      const items = raw
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
      if (items.length > 0 || field.required) input[field.key] = items
    } else if (raw !== "" || field.required) {
      input[field.key] = raw
    }
  }
  return input
}

export interface EntryApi<TEntry, TInput> {
  list: () => Promise<TEntry[]>
  create: (input: TInput) => Promise<TEntry>
  update: (id: string, input: Partial<TInput>) => Promise<TEntry>
  remove: (id: string) => Promise<void>
}

export interface EntryConfig<TEntry extends { id: string }, TInput> {
  title: string
  singular: string
  icon: LucideIcon
  emptyDescription: string
  fields: FieldSpec[]
  api: EntryApi<TEntry, TInput>
  entryLabel: (entry: TEntry) => string
  renderEntry: (entry: TEntry) => ReactNode
}

export const experienceConfig: EntryConfig<Experience, ExperienceInput> = {
  title: "experience",
  singular: "experience",
  icon: BriefcaseIcon,
  emptyDescription: "Roles you've held will show up here once you add them.",
  fields: [
    { key: "title", label: "Job title", kind: "text", required: true },
    { key: "company", label: "Company", kind: "text", required: true },
    { key: "location", label: "Location", kind: "text" },
    { key: "startDate", label: "Start date", kind: "date", required: true },
    { key: "endDate", label: "End date", kind: "date" },
    { key: "description", label: "Description", kind: "textarea" },
  ],
  api: experiences,
  entryLabel: (entry) => `${entry.title} at ${entry.company}`,
  renderEntry: (entry) => (
    <div>
      <p className="font-medium text-pretty" style={{ fontFamily: HEADING_FONT }}>
        {entry.title}
      </p>
      <p className="text-sm text-muted-foreground">
        {entry.company}
        {entry.location ? ` · ${entry.location}` : ""}
      </p>
      <p className="mt-1 text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
        {formatMonthYear(entry.startDate)} – {entry.endDate ? formatMonthYear(entry.endDate) : "Present"}
      </p>
      {entry.description && <p className="mt-2 text-sm text-pretty text-muted-foreground">{entry.description}</p>}
    </div>
  ),
}

export const educationConfig: EntryConfig<Education, EducationInput> = {
  title: "education",
  singular: "education",
  icon: GraduationCapIcon,
  emptyDescription: "Degrees and programs you've completed will show up here.",
  fields: [
    { key: "institution", label: "Institution", kind: "text", required: true },
    { key: "degree", label: "Degree", kind: "text", required: true },
    { key: "fieldOfStudy", label: "Field of study", kind: "text" },
    { key: "startDate", label: "Start date", kind: "date" },
    { key: "endDate", label: "End date", kind: "date" },
  ],
  api: educations,
  entryLabel: (entry) => `${entry.degree} — ${entry.institution}`,
  renderEntry: (entry) => (
    <div>
      <p className="font-medium text-pretty" style={{ fontFamily: HEADING_FONT }}>
        {entry.degree}
        {entry.fieldOfStudy ? `, ${entry.fieldOfStudy}` : ""}
      </p>
      <p className="text-sm text-muted-foreground">{entry.institution}</p>
      {(entry.startDate || entry.endDate) && (
        <p className="mt-1 text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
          {formatMonthYear(entry.startDate) ?? "Unknown"} – {entry.endDate ? formatMonthYear(entry.endDate) : "Present"}
        </p>
      )}
    </div>
  ),
}

export const certificationConfig: EntryConfig<Certification, CertificationInput> = {
  title: "certifications",
  singular: "certification",
  icon: AwardIcon,
  emptyDescription: "Licenses and certifications will show up here once you add them.",
  fields: [
    { key: "name", label: "Name", kind: "text", required: true },
    { key: "issuer", label: "Issuer", kind: "text", required: true },
    { key: "issueDate", label: "Issue date", kind: "date" },
    { key: "expirationDate", label: "Expiration date", kind: "date" },
  ],
  api: certifications,
  entryLabel: (entry) => entry.name,
  renderEntry: (entry) => {
    const meta = []
    if (entry.issueDate) meta.push(`Issued ${formatMonthYear(entry.issueDate)}`)
    meta.push(entry.expirationDate ? `Expires ${formatMonthYear(entry.expirationDate)}` : "No expiration")
    return (
      <div>
        <p className="font-medium text-pretty" style={{ fontFamily: HEADING_FONT }}>
          {entry.name}
        </p>
        <p className="text-sm text-muted-foreground">{entry.issuer}</p>
        <p className="mt-1 text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
          {meta.join(" · ")}
        </p>
      </div>
    )
  },
}

export const skillConfig: EntryConfig<Skill, SkillInput> = {
  title: "skills",
  singular: "skill",
  icon: SparklesIcon,
  emptyDescription: "Skills you add will help match you to jobs that need them.",
  fields: [{ key: "name", label: "Name", kind: "text", required: true }],
  api: skills,
  entryLabel: (entry) => entry.name,
  renderEntry: (entry) => (
    <p className="font-medium text-pretty" style={{ fontFamily: HEADING_FONT }}>
      {entry.name}
    </p>
  ),
}

export const projectConfig: EntryConfig<Project, ProjectInput> = {
  title: "projects",
  singular: "project",
  icon: FolderKanbanIcon,
  emptyDescription: "Personal or professional projects will show up here once you add them.",
  fields: [
    { key: "name", label: "Name", kind: "text", required: true },
    { key: "description", label: "Description", kind: "textarea" },
    { key: "technologies", label: "Technologies", kind: "tags" },
  ],
  api: projects,
  entryLabel: (entry) => entry.name,
  renderEntry: (entry) => (
    <div>
      <p className="font-medium text-pretty" style={{ fontFamily: HEADING_FONT }}>
        {entry.name}
      </p>
      {entry.description && <p className="mt-1 text-sm text-pretty text-muted-foreground">{entry.description}</p>}
      {entry.technologies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.technologies.map((technology) => (
            <Badge key={technology} variant="outline" style={{ fontFamily: META_FONT }}>
              {technology}
            </Badge>
          ))}
        </div>
      )}
    </div>
  ),
}

export const linkConfig: EntryConfig<ProfileLink, ProfileLinkInput> = {
  title: "links",
  singular: "link",
  icon: LinkIcon,
  emptyDescription: "Portfolio, GitHub, and other links will show up here once you add them.",
  fields: [
    { key: "label", label: "Label", kind: "text", required: true },
    { key: "url", label: "URL", kind: "url", required: true },
  ],
  api: links,
  entryLabel: (entry) => entry.label,
  renderEntry: (entry) => (
    <div className="min-w-0">
      <p className="font-medium text-pretty" style={{ fontFamily: HEADING_FONT }}>
        {entry.label}
      </p>
      <a
        href={entry.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-w-0 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <span className="truncate">{entry.url}</span>
        <ExternalLinkIcon className="size-3.5 shrink-0" />
      </a>
    </div>
  ),
}

export const achievementConfig: EntryConfig<Achievement, AchievementInput> = {
  title: "achievements",
  singular: "achievement",
  icon: TrophyIcon,
  emptyDescription: "Notable wins and recognitions will show up here once you add them.",
  fields: [{ key: "description", label: "Description", kind: "textarea", required: true }],
  api: achievements,
  entryLabel: (entry) => (entry.description.length > 60 ? `${entry.description.slice(0, 57)}…` : entry.description),
  renderEntry: (entry) => <p className="text-sm text-pretty">{entry.description}</p>,
}
