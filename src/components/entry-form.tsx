import { useId, useState, type FormEvent } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api"
import { formValuesToInput, type FieldSpec, type FormValues } from "@/lib/entry-config"

export function EntryForm({
  title,
  fields,
  initialValues,
  onSubmit,
}: {
  title: string
  fields: FieldSpec[]
  initialValues: FormValues
  onSubmit: (input: Record<string, unknown>) => Promise<void>
}) {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const baseId = useId()

  function update(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(formValuesToInput(values, fields))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to save. Check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <FieldGroup>
        {fields.map((field) => {
          const fieldId = `${baseId}-${field.key}`
          return (
            <Field key={field.key}>
              <FieldLabel htmlFor={fieldId}>{field.label}</FieldLabel>
              {field.kind === "textarea" ? (
                <Textarea
                  id={fieldId}
                  required={field.required}
                  value={values[field.key]}
                  onChange={(event) => update(field.key, event.target.value)}
                />
              ) : (
                <Input
                  id={fieldId}
                  type={field.kind === "date" ? "date" : field.kind === "url" ? "url" : "text"}
                  required={field.required}
                  value={values[field.key]}
                  onChange={(event) => update(field.key, event.target.value)}
                />
              )}
              {field.kind === "tags" && <FieldDescription>Comma-separated</FieldDescription>}
            </Field>
          )
        })}
      </FieldGroup>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to save</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Save
        </Button>
      </DialogFooter>
    </form>
  )
}
