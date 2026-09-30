import { Trash2Icon } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { removeWatchedCompany } from "@/lib/discovery"
import { SOURCE_LABELS } from "@/lib/discovery-format"
import { HEADING_FONT, META_FONT } from "@/lib/fonts"
import type { WatchedCompany } from "@/lib/types"

export function WatchedCompanyRow({
  company,
  onRemoved,
}: {
  company: WatchedCompany
  onRemoved: (id: string) => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setIsDeleting(true)
    try {
      await removeWatchedCompany(company.id)
      onRemoved(company.id)
    } catch (err) {
      setIsDeleting(false)
      setError(
        err instanceof ApiError ? err.message : "Unable to remove this company. Check your connection and try again.",
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <Badge variant="outline" style={{ fontFamily: META_FONT }}>
            {SOURCE_LABELS[company.source]}
          </Badge>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate" style={{ fontFamily: HEADING_FONT }}>
              {company.label}
            </CardTitle>
            <p className="truncate text-xs tracking-tight text-muted-foreground" style={{ fontFamily: META_FONT }}>
              {company.boardToken}
            </p>
          </div>
        </div>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" disabled={isDeleting} />}>
              {isDeleting ? <Spinner /> : <Trash2Icon />}
              <span className="sr-only">Remove {company.label}</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove {company.label}?</AlertDialogTitle>
                <AlertDialogDescription>
                  job-app will stop polling {company.label}'s {SOURCE_LABELS[company.source]} board for new postings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting && <Spinner data-icon="inline-start" />}
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
