import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import Logo from "../../assets/Logo_Icon.svg"
import NotFound from "../../assets/404.svg"

import { Box } from "@/components/box"
import { getShortLink } from "@/http/short-links/get-short-link"

const API_URL = import.meta.env.VITE_API_URL
const COUNTDOWN_SECONDS = 5

export default function RedirectPage() {
  const [searchParams] = useSearchParams()
  const shortLink = searchParams.get("shortLink")

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [exists, setExists] = useState<boolean | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const redirectUrl = shortLink ? `${API_URL}/${shortLink}` : "/"

  useEffect(() => {
    if (!shortLink) {
      setExists(false)
      return
    }

    getShortLink(shortLink)
      .then(() => setExists(true))
      .catch(() => setExists(false))
  }, [shortLink])

  useEffect(() => {
    if (!exists) return

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1

        if (next <= 0) {
          clearInterval(intervalRef.current!)
          window.location.href = redirectUrl
          return 0
        }

        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [exists, redirectUrl])

  if (exists === null) {
    return (
      <Box>
        <img src={Logo} alt="brev.ly" width={64} height={64} />
        <p className="text-sm text-muted-foreground">Verificando link...</p>
      </Box>
    )
  }

  if (!exists) {
    return (
      <Box>
        <img src={NotFound} alt="404" className="h-[80px]" />

        <h1 className="text-2xl font-bold leading-8 text-foreground">
          Link não encontrado
        </h1>

        <p className="text-sm text-muted-foreground">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <a href="" className="text-primary font-bold">brev.ly.</a>
        </p>
      </Box>
    )
  }

  return (
    <Box>
      <img src={Logo} alt="brev.ly" className="h-[80px]" />

      <h1 className="text-2xl font-bold leading-8 text-foreground">
        Redirecionando em {countdown}...
      </h1>

      <p className="text-sm text-muted-foreground">
        O link será aberto automaticamente em alguns instantes.
      </p>

      <p className="text-sm text-muted-foreground">
        Não foi redirecionado? <a href={redirectUrl} className="text-primary font-bold">Acesse aqui</a>
      </p>
    </Box>
  )
}