import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { ClusterList } from "@/components/cluster-list"
import { PostingList } from "@/components/posting-list"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HEADING_FONT } from "@/lib/fonts"

type View = "clusters" | "postings"

export function ClustersPage() {
  const [view, setView] = useState<View>("clusters")

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
          Job Clusters
        </h1>
        <ToggleGroup
          value={[view]}
          onValueChange={(value: string[]) => {
            if (value.length > 0) setView(value[0] as View)
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="clusters" aria-label="Group duplicate postings by cluster">
            By cluster
          </ToggleGroupItem>
          <ToggleGroupItem value="postings" aria-label="Show every ingested posting individually">
            All postings
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === "clusters" ? <ClusterList key="clusters" /> : <PostingList key="postings" />}
    </AppShell>
  )
}
