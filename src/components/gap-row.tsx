import { Badge } from "@/components/ui/badge"
import { META_FONT } from "@/lib/fonts"
import type { MatchGap } from "@/lib/types"

export function GapRow({ gap }: { gap: MatchGap }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-3">
      <p className="text-sm text-pretty text-muted-foreground">{gap.requirement}</p>
      <Badge variant="outline" className="shrink-0" style={{ fontFamily: META_FONT }}>
        Gap
      </Badge>
    </li>
  )
}
