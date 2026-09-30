import { Spinner } from "@/components/ui/spinner"

export function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-6" />
    </div>
  )
}
