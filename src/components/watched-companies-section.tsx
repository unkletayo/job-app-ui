import { Building2Icon, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { AddWatchedCompanyForm } from "@/components/add-watched-company-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { WatchedCompanyRow } from "@/components/watched-company-row"
import { ApiError } from "@/lib/api"
import { listWatchedCompanies } from "@/lib/discovery"
import { HEADING_FONT } from "@/lib/fonts"
import type { WatchedCompany } from "@/lib/types"

export function WatchedCompaniesSection() {
  const [companies, setCompanies] = useState<WatchedCompany[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    listWatchedCompanies()
      .then((result) => {
        if (!cancelled) setCompanies(result)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof ApiError ? err.message : "Unable to load watched companies. Check your connection and try again.",
        )
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleAdded(company: WatchedCompany) {
    setCompanies((prev) => (prev ? [...prev, company] : [company]))
    setIsAddOpen(false)
  }

  function handleRemoved(id: string) {
    setCompanies((prev) => prev?.filter((company) => company.id !== id) ?? prev)
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
          Watched companies
        </h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <PlusIcon data-icon="inline-start" />
            Add company
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add watched company</DialogTitle>
              <DialogDescription>Poll a company's job board for new postings.</DialogDescription>
            </DialogHeader>
            <AddWatchedCompanyForm onAdded={handleAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Unable to load watched companies</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!error && companies === null && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!error && companies !== null && companies.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2Icon />
            </EmptyMedia>
            <EmptyTitle>No watched companies yet</EmptyTitle>
            <EmptyDescription>Add a company's job board to start polling it for new postings.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!error && companies !== null && companies.length > 0 && (
        <div className="flex flex-col gap-3">
          {companies.map((company) => (
            <WatchedCompanyRow key={company.id} company={company} onRemoved={handleRemoved} />
          ))}
        </div>
      )}
    </section>
  )
}
