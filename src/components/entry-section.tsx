import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { EntryForm } from "@/components/entry-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { capitalize, emptyFormValues, entryToFormValues, type EntryConfig } from "@/lib/entry-config"

type EntryListState<TEntry> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; entries: TEntry[] }

type EntryDialogState<TEntry> = { mode: "create" } | { mode: "edit"; entry: TEntry }

interface EntryDeleteState<TEntry> {
  entry: TEntry
  error: string | null
  isDeleting: boolean
}

export function EntrySection<TEntry extends { id: string }, TInput>({
  config,
}: {
  config: EntryConfig<TEntry, TInput>
}) {
  const [state, setState] = useState<EntryListState<TEntry>>({ status: "loading" })
  const [dialogState, setDialogState] = useState<EntryDialogState<TEntry> | null>(null)
  const [deleteState, setDeleteState] = useState<EntryDeleteState<TEntry> | null>(null)

  useEffect(() => {
    let cancelled = false
    config.api
      .list()
      .then((entries) => {
        if (!cancelled) setState({ status: "ready", entries })
      })
      .catch((err) => {
        if (cancelled) return
        setState({
          status: "error",
          message:
            err instanceof ApiError
              ? err.message
              : `Unable to load ${config.title}. Check your connection and try again.`,
        })
      })
    return () => {
      cancelled = true
    }
  }, [config])

  async function handleCreate(input: TInput) {
    const created = await config.api.create(input)
    setState((prev) => (prev.status === "ready" ? { status: "ready", entries: [...prev.entries, created] } : prev))
  }

  async function handleUpdate(id: string, input: Partial<TInput>) {
    const updated = await config.api.update(id, input)
    setState((prev) =>
      prev.status === "ready"
        ? { status: "ready", entries: prev.entries.map((entry) => (entry.id === id ? updated : entry)) }
        : prev,
    )
  }

  async function handleDelete(id: string) {
    await config.api.remove(id)
    setState((prev) =>
      prev.status === "ready" ? { status: "ready", entries: prev.entries.filter((entry) => entry.id !== id) } : prev,
    )
  }

  if (state.status === "error") {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Unable to load {config.title}</EmptyTitle>
          <EmptyDescription>{state.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setDialogState({ mode: "create" })}>
          <PlusIcon data-icon="inline-start" />
          Add {config.singular}
        </Button>
      </div>

      {state.status === "loading" && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      )}

      {state.status === "ready" && state.entries.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <config.icon />
            </EmptyMedia>
            <EmptyTitle>No {config.title} yet</EmptyTitle>
            <EmptyDescription>{config.emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {state.status === "ready" && state.entries.length > 0 && (
        <div className="flex flex-col gap-3">
          {state.entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="min-w-0 flex-1">{config.renderEntry(entry)}</div>
                <CardAction className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${config.entryLabel(entry)}`}
                    onClick={() => setDialogState({ mode: "edit", entry })}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${config.entryLabel(entry)}`}
                    onClick={() => setDeleteState({ entry, error: null, isDeleting: false })}
                  >
                    <Trash2Icon />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={dialogState !== null}
        onOpenChange={(open) => {
          if (!open) setDialogState(null)
        }}
      >
        <DialogContent>
          {dialogState && (
            <EntryForm
              key={dialogState.mode === "edit" ? dialogState.entry.id : "create"}
              title={dialogState.mode === "edit" ? `Edit ${capitalize(config.singular)}` : `Add ${capitalize(config.singular)}`}
              fields={config.fields}
              initialValues={
                dialogState.mode === "edit" ? entryToFormValues(dialogState.entry, config.fields) : emptyFormValues(config.fields)
              }
              onSubmit={async (input) => {
                if (dialogState.mode === "edit") {
                  await handleUpdate(dialogState.entry.id, input as Partial<TInput>)
                } else {
                  await handleCreate(input as TInput)
                }
                setDialogState(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteState !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteState(null)
        }}
      >
        <AlertDialogContent>
          {deleteState && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {capitalize(config.singular)}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove &quot;{config.entryLabel(deleteState.entry)}&quot; from your profile. This can&apos;t
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteState.error && (
                <Alert variant="destructive">
                  <AlertTitle>Unable to delete</AlertTitle>
                  <AlertDescription>{deleteState.error}</AlertDescription>
                </Alert>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteState.isDeleting}
                  onClick={async () => {
                    const target = deleteState.entry
                    setDeleteState((prev) => (prev ? { ...prev, isDeleting: true, error: null } : prev))
                    try {
                      await handleDelete(target.id)
                      setDeleteState(null)
                    } catch (err) {
                      setDeleteState((prev) =>
                        prev
                          ? {
                              ...prev,
                              isDeleting: false,
                              error:
                                err instanceof ApiError ? err.message : "Unable to delete. Check your connection and try again.",
                            }
                          : prev,
                      )
                    }
                  }}
                >
                  {deleteState.isDeleting && <Spinner data-icon="inline-start" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
