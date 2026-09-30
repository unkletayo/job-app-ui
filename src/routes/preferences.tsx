import { useEffect, useState, type FormEvent } from "react"
import { AppShell } from "@/components/app-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { ApiError } from "@/lib/api"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import { getJobPreferences, patchJobPreferences } from "@/lib/job-preferences"
import type { JobPreferences, JobPreferencesInput } from "@/lib/types"

interface PreferencesFormState {
  targetRoles: string
  seniority: string
  employmentTypes: string
  requiredTechnologies: string
  preferredTechnologies: string
  locations: string
  remotePreference: boolean
  hybridPreference: boolean
  minimumSalaryAmount: string
  minimumSalaryCurrency: string
  excludedCompanies: string
  excludedTitles: string
  keywords: string
  negativeKeywords: string
}

function toFormState(preferences: JobPreferences): PreferencesFormState {
  return {
    targetRoles: preferences.targetRoles.join(", "),
    seniority: preferences.seniority.join(", "),
    employmentTypes: preferences.employmentTypes.join(", "),
    requiredTechnologies: preferences.requiredTechnologies.join(", "),
    preferredTechnologies: preferences.preferredTechnologies.join(", "),
    locations: preferences.locations.join(", "),
    remotePreference: preferences.remotePreference ?? false,
    hybridPreference: preferences.hybridPreference ?? false,
    minimumSalaryAmount: preferences.minimumSalaryAmount?.toString() ?? "",
    minimumSalaryCurrency: preferences.minimumSalaryCurrency ?? "",
    excludedCompanies: preferences.excludedCompanies.join(", "),
    excludedTitles: preferences.excludedTitles.join(", "),
    keywords: preferences.keywords.join(", "),
    negativeKeywords: preferences.negativeKeywords.join(", "),
  }
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function toInput(form: PreferencesFormState): JobPreferencesInput {
  return {
    targetRoles: parseList(form.targetRoles),
    seniority: parseList(form.seniority),
    employmentTypes: parseList(form.employmentTypes),
    requiredTechnologies: parseList(form.requiredTechnologies),
    preferredTechnologies: parseList(form.preferredTechnologies),
    locations: parseList(form.locations),
    remotePreference: form.remotePreference,
    hybridPreference: form.hybridPreference,
    minimumSalaryAmount: form.minimumSalaryAmount.trim() === "" ? null : Number(form.minimumSalaryAmount),
    minimumSalaryCurrency: form.minimumSalaryCurrency.trim() === "" ? null : form.minimumSalaryCurrency.trim(),
    excludedCompanies: parseList(form.excludedCompanies),
    excludedTitles: parseList(form.excludedTitles),
    keywords: parseList(form.keywords),
    negativeKeywords: parseList(form.negativeKeywords),
  }
}

export function PreferencesPage() {
  return (
    <AppShell>
      <h1 className="mb-6 text-lg font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
        Job Preferences
      </h1>
      <PreferencesFetcher />
    </AppShell>
  )
}

function PreferencesFetcher() {
  const [preferences, setPreferences] = useState<JobPreferences | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getJobPreferences()
      .then((result) => {
        if (!cancelled) setPreferences(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof ApiError ? err.message : "Unable to load your preferences. Check your connection and try again.",
        )
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <Empty>
        <EmptyTitle>Unable to load preferences</EmptyTitle>
        <EmptyDescription>{error}</EmptyDescription>
      </Empty>
    )
  }

  if (!preferences) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return <PreferencesForm preferences={preferences} />
}

function PreferencesForm({ preferences }: { preferences: JobPreferences }) {
  const [form, setForm] = useState<PreferencesFormState>(() => toFormState(preferences))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return
    const timeout = setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(timeout)
  }, [saved])

  function update<K extends keyof PreferencesFormState>(key: K, value: PreferencesFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSubmitting(true)
    try {
      const updated = await patchJobPreferences(toInput(form))
      setForm(toFormState(updated))
      setSaved(true)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to save your preferences. Check your connection and try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <FieldGroup>
        <FieldLegend>Role</FieldLegend>
        <Field>
          <FieldLabel htmlFor="targetRoles">Target roles</FieldLabel>
          <Input id="targetRoles" value={form.targetRoles} onChange={(event) => update("targetRoles", event.target.value)} />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="seniority">Seniority</FieldLabel>
          <Input id="seniority" value={form.seniority} onChange={(event) => update("seniority", event.target.value)} />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="employmentTypes">Employment types</FieldLabel>
          <Input
            id="employmentTypes"
            value={form.employmentTypes}
            onChange={(event) => update("employmentTypes", event.target.value)}
          />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="requiredTechnologies">Required technologies</FieldLabel>
          <Input
            id="requiredTechnologies"
            value={form.requiredTechnologies}
            onChange={(event) => update("requiredTechnologies", event.target.value)}
          />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="preferredTechnologies">Preferred technologies</FieldLabel>
          <Input
            id="preferredTechnologies"
            value={form.preferredTechnologies}
            onChange={(event) => update("preferredTechnologies", event.target.value)}
          />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup>
        <FieldLegend>Location & work style</FieldLegend>
        <Field>
          <FieldLabel htmlFor="locations">Locations</FieldLabel>
          <Input id="locations" value={form.locations} onChange={(event) => update("locations", event.target.value)} />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <FieldLabel htmlFor="remotePreference">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Open to remote roles</FieldTitle>
            </FieldContent>
            <Switch
              id="remotePreference"
              checked={form.remotePreference}
              onCheckedChange={(checked) => update("remotePreference", checked)}
            />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="hybridPreference">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Open to hybrid roles</FieldTitle>
            </FieldContent>
            <Switch
              id="hybridPreference"
              checked={form.hybridPreference}
              onCheckedChange={(checked) => update("hybridPreference", checked)}
            />
          </Field>
        </FieldLabel>
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup>
        <FieldLegend>Compensation</FieldLegend>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="minimumSalaryAmount">Minimum salary</FieldLabel>
            <Input
              id="minimumSalaryAmount"
              type="number"
              min={0}
              value={form.minimumSalaryAmount}
              onChange={(event) => update("minimumSalaryAmount", event.target.value)}
            />
          </FieldContent>
          <FieldContent className="max-w-24">
            <FieldLabel htmlFor="minimumSalaryCurrency">Currency</FieldLabel>
            <Input
              id="minimumSalaryCurrency"
              placeholder="USD"
              value={form.minimumSalaryCurrency}
              onChange={(event) => update("minimumSalaryCurrency", event.target.value)}
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup>
        <FieldLegend>Companies & keywords</FieldLegend>
        <Field>
          <FieldLabel htmlFor="excludedCompanies">Excluded companies</FieldLabel>
          <Input
            id="excludedCompanies"
            value={form.excludedCompanies}
            onChange={(event) => update("excludedCompanies", event.target.value)}
          />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="excludedTitles">Excluded titles</FieldLabel>
          <Input
            id="excludedTitles"
            value={form.excludedTitles}
            onChange={(event) => update("excludedTitles", event.target.value)}
          />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="keywords">Keywords</FieldLabel>
          <Input id="keywords" value={form.keywords} onChange={(event) => update("keywords", event.target.value)} />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="negativeKeywords">Negative keywords</FieldLabel>
          <Input
            id="negativeKeywords"
            value={form.negativeKeywords}
            onChange={(event) => update("negativeKeywords", event.target.value)}
          />
          <FieldDescription>Comma-separated</FieldDescription>
        </Field>
      </FieldGroup>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to save preferences</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Field orientation="horizontal">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Save preferences
        </Button>
        {saved && (
          <span className="text-sm text-muted-foreground" style={{ fontFamily: META_FONT }}>
            Saved
          </span>
        )}
      </Field>
    </form>
  )
}
