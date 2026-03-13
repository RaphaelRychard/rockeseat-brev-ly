"use client"

import type React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { HTTPError } from "ky"
import { z } from "zod"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createShortLink } from "@/http/short-links/create-short-link"
import { toast } from "sonner"

const createSchema = z.object({
  originUrl: z.string().url("URL inválida"),
  shortLink: z
    .string()
    .min(4, "O link deve ter pelo menos 4 caracteres")
    .max(20, "O link deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9-_]+$/, "Apenas letras, números, hífen e underscore"),
})

export function ShortLinkForm() {
  const queryClient = useQueryClient()
  const [originUrl, setOriginUrl] = useState("")
  const [shortLink, setShortLink] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isFormFilled = originUrl.trim() !== "" && shortLink.trim() !== ""

  const mutation = useMutation({
    mutationFn: createShortLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["short-links"] })
      toast.success("Link criado com sucesso!")
      setOriginUrl("")
      setShortLink("")
      setErrors({})
      setErrorMessage(null)
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        try {
          const { message } = await error.response.json()
          setErrorMessage(message)
        } catch {
          setErrorMessage("Erro ao criar link")
        }
      } else {
        setErrorMessage("Erro inesperado. Tente novamente mais tarde.")
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setErrorMessage(null)

    const parsed = createSchema.safeParse({ originUrl, shortLink })

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    mutation.mutate(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit} className="w-[380px]">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <Warning className="size-4" />
          <AlertTitle>Erro ao criar link</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-6 p-8 bg-card rounded-lg w-full">
        <h2 className="text-lg font-bold leading-6 text-foreground">
          Novo link
        </h2>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Label
              htmlFor="originUrl"
              className="text-[10px] font-normal uppercase tracking-wider text-secondary-foreground"
            >
              Link Original
            </Label>
            <Input
              id="originUrl"
              type="url"
              placeholder="www.exemplo.com.br"
              className="h-12 border-input text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              value={originUrl}
              onChange={(e) => setOriginUrl(e.target.value)}
            />
            {errors.originUrl && (
              <p className="text-xs text-destructive">{errors.originUrl}</p>
            )}
          </div>

          {/* Link Encurtado */}
          <div className="flex flex-col gap-2 w-full">
            <Label
              htmlFor="shortLink"
              className="text-[10px] font-normal uppercase tracking-wider text-secondary-foreground"
            >
              Link Encurtado
            </Label>
            <Input
              id="shortLink"
              type="text"
              placeholder="brev.ly/"
              className="h-12 border-input text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              value={shortLink}
              onChange={(e) => setShortLink(e.target.value)}
            />
            {errors.shortLink && (
              <p className="text-xs text-destructive">{errors.shortLink}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormFilled || mutation.isPending}
            className="w-full h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
              transition-opacity hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <CircleNotch size={16} weight="bold" className="animate-spin mx-auto" />
            ) : (
              "Salvar link"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}