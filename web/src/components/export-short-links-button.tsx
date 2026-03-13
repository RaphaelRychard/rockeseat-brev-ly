"use client"

import { useState } from "react"
import { DownloadSimple, CircleNotch } from "@phosphor-icons/react"
import { exportShortLinks } from "@/http/short-links/export-short-links"
import { toast } from "sonner"

interface ExportShortLinksButtonProps {
  disabled?: boolean
}

export function ExportShortLinksButton({ disabled = false }: ExportShortLinksButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const { reportUrl } = await exportShortLinks()
      window.open(reportUrl, "_blank")
      toast.success("Relatório gerado com sucesso!")
    } catch {
      toast.error("Erro ao exportar links")
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = disabled || isLoading

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className="flex items-center gap-1.5 px-3 h-8 bg-secondary text-secondary-foreground rounded
        transition-colors hover:bg-border
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
    >
      {isLoading ? (
        <CircleNotch size={16} weight="bold" className="animate-spin" />
      ) : (
        <DownloadSimple size={16} weight="regular" />
      )}
      <span className="text-xs font-semibold whitespace-nowrap">
        {isLoading ? "Gerando..." : "Baixar CSV"}
      </span>
    </button>
  )
}
