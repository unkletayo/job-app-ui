import { useId, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { HEADING_FONT } from "@/lib/fonts"
import { register } from "@/lib/register"

export function RegisterPage() {
  const navigate = useNavigate()
  const emailId = useId()
  const passwordId = useId()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register(email, password)
      void navigate("/login", { state: { registered: true } })
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "An account already exists. This app supports one account — sign in instead."
          : err instanceof ApiError
            ? err.message
            : "Unable to create an account. Check your connection and try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
            Create account
          </h1>
          <p className="text-sm text-muted-foreground">This app supports a single account.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor={emailId}>Email</FieldLabel>
              <Input
                id={emailId}
                type="email"
                autoComplete="email"
                required
                aria-invalid={error ? true : undefined}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
              <Input
                id={passwordId}
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${passwordId}-error` : `${passwordId}-hint`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <FieldDescription id={`${passwordId}-hint`}>At least 8 characters.</FieldDescription>
              {error && (
                <FieldDescription id={`${passwordId}-error`} role="alert" className="text-destructive">
                  {error}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner data-icon="inline-start" />}
                Create account
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
