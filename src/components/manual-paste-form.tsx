import { useId, useState, type FormEvent } from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api"
import { manualPasteJob } from "@/lib/jobs"

export function ManualPasteForm({ onDone }: { onDone: () => void }) {
  const titleId = useId()
  const companyId = useId()
  const locationId = useId()
  const urlId = useId()
  const descriptionId = useId()
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await manualPasteJob({ title, company, location: location || undefined, description, url: url || undefined })
      onDone()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to reach the server. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="pt-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={titleId}>Title</FieldLabel>
          <Input id={titleId} required value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor={companyId}>Company</FieldLabel>
          <Input id={companyId} required value={company} onChange={(event) => setCompany(event.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor={locationId}>Location</FieldLabel>
          <Input id={locationId} value={location} onChange={(event) => setLocation(event.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor={urlId}>Application URL</FieldLabel>
          <Input id={urlId} type="url" value={url} onChange={(event) => setUrl(event.target.value)} />
        </Field>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
          <Textarea
            id={descriptionId}
            required
            rows={8}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {error && (
            <FieldDescription role="alert" className="text-destructive">
              {error}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>
      <DialogFooter className="mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Add job
        </Button>
      </DialogFooter>
    </form>
  )
}
