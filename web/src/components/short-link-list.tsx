import { Link, CircleNotch } from "@phosphor-icons/react"
import { ExportShortLinksButton } from "./export-short-links-button"
import { ShortLinkRow } from "./short-link-row"
import { Separator } from "@/components/ui/separator"

export interface ShortLinkItem {
  id: string
  originUrl: string
  shortLink: string
  accessCount: number
}

interface ShortLinkListProps {
  links: ShortLinkItem[]
  isLoading: boolean
}

export function ShortLinkList({ links, isLoading }: ShortLinkListProps) {
  return (
    <div className="flex flex-col gap-5 p-8 bg-card rounded-lg w-[580px]">

      <div className="flex flex-row justify-between items-center w-full h-8">
        <span className="text-lg font-bold leading-6 text-foreground">
          Meus links
        </span>
        <ExportShortLinksButton disabled={isLoading || links.length === 0} />
      </div>

      <div className="flex flex-col gap-4 w-full">

        {isLoading ? (
          <div className="flex justify-center items-center py-10 w-full">
            <CircleNotch size={32} className="animate-spin text-muted-foreground" />
          </div>
        ) : links.length === 0 ? (
          <>
           <Separator className="bg-border" />
            <div className="flex flex-col justify-center items-center gap-3 pt-4 pb-6 w-full">
              <Link size={40} weight="regular" className="text-muted-foreground" />
              <span className="text-[10px] font-normal uppercase tracking-wider text-secondary-foreground text-center">
                Ainda não existem links cadastrados
              </span>
            </div>
          </>
        ) : (
          links.map((link) => (
            <>
              <Separator className="bg-border" />
              <ShortLinkRow key={link.id} link={link} />
            </>
          ))
        )}
      </div>
    </div>
  )
}
