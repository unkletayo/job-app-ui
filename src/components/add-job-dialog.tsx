import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { FetchUrlForm } from "@/components/fetch-url-form"
import { ManualPasteForm } from "@/components/manual-paste-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AddJobDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add job
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a job posting</DialogTitle>
          <DialogDescription>Fetch it from a URL, or paste the description directly.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="fetch">
          <TabsList>
            <TabsTrigger value="fetch">From URL</TabsTrigger>
            <TabsTrigger value="paste">Paste description</TabsTrigger>
          </TabsList>
          <TabsContent value="fetch">
            <FetchUrlForm
              onDone={() => {
                setOpen(false)
                onAdded()
              }}
            />
          </TabsContent>
          <TabsContent value="paste">
            <ManualPasteForm
              onDone={() => {
                setOpen(false)
                onAdded()
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
