import { useId, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { DISCOVERY_SOURCE_KEYS, addWatchedCompany } from "@/lib/discovery"
import { SOURCE_LABELS } from "@/lib/discovery-format"
import type { DiscoverySourceKey, WatchedCompany } from "@/lib/types"

export function AddWatchedCompanyForm({ onAdded }: { onAdded: (company: WatchedCompany) => void }) {
  const sourceId = useId()
  const boardTokenId = useId()
  const labelId = useId()
  const [source, setSource] = useState<DiscoverySourceKey>(DISCOVERY_SOURCE_KEYS[0])
  const [boardToken, setBoardToken] = useState("")
  const [label, setLabel] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const company = await addWatchedCompany({ source, boardToken, label })
      onAdded(company)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to add this company. Check your connection and try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={sourceId}>Source</FieldLabel>
          <Select value={source} onValueChange={(value) => value && setSource(value as DiscoverySourceKey)}>
            <SelectTrigger id={sourceId} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISCOVERY_SOURCE_KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {SOURCE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor={boardTokenId}>Board token</FieldLabel>
          <Input
            id={boardTokenId}
            required
            placeholder="e.g. stripe"
            value={boardToken}
            onChange={(event) => setBoardToken(event.target.value)}
          />
        </Field>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={labelId}>Label</FieldLabel>
          <Input
            id={labelId}
            required
            placeholder="e.g. Stripe"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${labelId}-error` : undefined}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          {error && (
            <FieldDescription id={`${labelId}-error`} role="alert" className="text-destructive">
              {error}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Add company
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
