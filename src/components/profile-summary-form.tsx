import { useEffect, useId, useState, type FormEvent } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api"
import { putCandidateProfile } from "@/lib/candidate-profile"
import { META_FONT } from "@/lib/fonts"
import type { CandidateProfile } from "@/lib/types"

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface ProfileFormState {
  fullName: string
  contactEmail: string
  phone: string
  location: string
  workAuthorization: string
  professionalSummary: string
}

function toProfileFormState(profile: CandidateProfile | null): ProfileFormState {
  return {
    fullName: profile?.fullName ?? "",
    contactEmail: profile?.contactEmail ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    workAuthorization: profile?.workAuthorization ?? "",
    professionalSummary: profile?.professionalSummary ?? "",
  }
}

export function ProfileSummaryForm({ profile: initialProfile }: { profile: CandidateProfile | null }) {
  const [profile, setProfile] = useState(initialProfile)
  const [form, setForm] = useState<ProfileFormState>(() => toProfileFormState(initialProfile))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const fullNameId = useId()
  const contactEmailId = useId()
  const phoneId = useId()
  const locationId = useId()
  const workAuthorizationId = useId()
  const professionalSummaryId = useId()

  useEffect(() => {
    if (!saved) return
    const timeout = setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(timeout)
  }, [saved])

  function update<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSubmitting(true)
    try {
      const updated = await putCandidateProfile(form)
      setProfile(updated)
      setForm(toProfileFormState(updated))
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to save your profile. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {!profile && (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t saved a candidate profile yet. Fill this in and save to create one.
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={fullNameId}>Full name</FieldLabel>
              <Input id={fullNameId} value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor={contactEmailId}>Contact email</FieldLabel>
              <Input
                id={contactEmailId}
                type="email"
                value={form.contactEmail}
                onChange={(event) => update("contactEmail", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={phoneId}>Phone</FieldLabel>
              <Input id={phoneId} type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor={locationId}>Location</FieldLabel>
              <Input id={locationId} value={form.location} onChange={(event) => update("location", event.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor={workAuthorizationId}>Work authorization</FieldLabel>
              <Input
                id={workAuthorizationId}
                value={form.workAuthorization}
                onChange={(event) => update("workAuthorization", event.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor={professionalSummaryId}>Professional summary</FieldLabel>
            <Textarea
              id={professionalSummaryId}
              rows={4}
              value={form.professionalSummary}
              onChange={(event) => update("professionalSummary", event.target.value)}
            />
          </Field>
        </FieldGroup>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Unable to save profile</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Save
          </Button>
          {saved && (
            <span className="text-sm text-muted-foreground" style={{ fontFamily: META_FONT }}>
              Saved
            </span>
          )}
        </Field>
      </form>
      {profile && (
        <p className="text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
          Last updated {formatDate(profile.lastUpdated)}
        </p>
      )}
    </div>
  )
}
