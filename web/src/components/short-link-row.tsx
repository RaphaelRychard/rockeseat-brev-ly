"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Copy, Trash } from "@phosphor-icons/react"
import { toast } from "sonner"
import { deleteShortLink } from "@/http/short-links/delete-short-link"
import type { ShortLinkItem } from "./short-link-list"

const API_URL = import.meta.env.VITE_API_URL as string

export function ShortLinkRow({ link }: { link: ShortLinkItem }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteShortLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["short-links"] })
      toast.success("Link removido com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao remover link")
    },
  })

  const shortLinkUrl = `${API_URL}/short-links/${link.shortLink}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortLinkUrl)
    toast.success("Link copiado!", { description: shortLinkUrl })
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-border first:border-0">
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <a
          href={`/redirect?shortLink=${link.shortLink}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-primary hover:underline truncate"
        >
          brev.ly/{link.shortLink}
        </a>
        <span className="text-xs text-muted-foreground truncate">{link.originUrl}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {link.accessCount} acessos
        </span>

        <button
          onClick={copyToClipboard}
          title="Copiar link"
          className="text-muted-foreground hover:text-secondary-foreground transition-colors"
        >
          <Copy size={16} weight="regular" />
        </button>

        <button
          onClick={() => deleteMutation.mutate(link.id)}
          disabled={deleteMutation.isPending}
          className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        >
          <Trash size={16} weight="regular" />
        </button>
      </div>
    </div>
  )
}