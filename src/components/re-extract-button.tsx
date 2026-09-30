import { RefreshCwIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { reExtractAllJobs } from "@/lib/jobs"

export function ReExtractButton({ onDone }: { onDone: () => void }) {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleClick() {
    setIsRunning(true)
    setResult(null)
    try {
      const { reExtracted } = await reExtractAllJobs()
      setResult(`Re-extracted ${reExtracted} posting${reExtracted === 1 ? "" : "s"}.`)
      onDone()
    } catch (err) {
      setResult(err instanceof ApiError ? err.message : "Unable to re-extract. Check your connection and try again.")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" disabled={isRunning} onClick={handleClick}>
        {isRunning ? <Spinner data-icon="inline-start" /> : <RefreshCwIcon data-icon="inline-start" />}
        Re-extract requirements
      </Button>
      {result && <p className="text-xs text-muted-foreground">{result}</p>}
    </div>
  )
}
