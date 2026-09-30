import { FolderIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { ClusterRow } from "@/components/cluster-row"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api"
import { listJobClusters } from "@/lib/job-clusters"
import type { JobCluster } from "@/lib/types"

export function ClusterList() {
  const [clusters, setClusters] = useState<JobCluster[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listJobClusters()
      .then((result) => {
        if (!cancelled) setClusters(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : "Unable to load clusters. Check your connection and try again.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Unable to load clusters</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (clusters === null) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (clusters.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>No clusters yet</EmptyTitle>
          <EmptyDescription>Postings that describe the same role get grouped here as they're discovered.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {clusters.map((cluster) => (
        <ClusterRow key={cluster.id} cluster={cluster} />
      ))}
    </div>
  )
}
