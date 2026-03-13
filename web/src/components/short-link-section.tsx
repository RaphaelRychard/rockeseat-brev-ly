import { useQuery } from "@tanstack/react-query"
import { fetchShortLinks } from "@/http/short-links/fetch-short-links"
import { ShortLinkForm } from "./short-link-form"
import { ShortLinkList } from "./short-link-list"

export function ShortLinkSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["short-links"],
    queryFn: fetchShortLinks,
  })

  return (
    <div className="flex gap-5 items-start">
      <ShortLinkForm />
      <ShortLinkList links={data?.shortLinks ?? []} isLoading={isLoading} />
    </div>
  )
}
