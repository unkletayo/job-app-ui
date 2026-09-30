import { useId, useState, type FormEvent } from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { fetchJobFromUrl } from "@/lib/jobs"

export function FetchUrlForm({ onDone }: { onDone: () => void }) {
  const titleId = useId()
  const companyId = useId()
  const locationId = useId()
  const urlId = useId()
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await fetchJobFromUrl({ title, company, location: location || undefined, url })
      if (result.status === "needs_manual_paste") {
        setError(`Couldn't fetch that page: ${result.reason}. Try "Paste description" instead.`)
        return
      }
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
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={urlId}>Job posting URL</FieldLabel>
          <Input
            id={urlId}
            type="url"
            required
            placeholder="https://boards.greenhouse.io/acme/jobs/1234"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          {error && (
            <FieldDescription role="alert" className="text-destructive">
              {error}
            </FieldDescription>
          )}
        </Field>
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
      </FieldGroup>
      <DialogFooter className="mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Fetch and add
        </Button>
      </DialogFooter>
    </form>
  )
}
