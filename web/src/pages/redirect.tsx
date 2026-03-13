import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Logo from "../../assets/Logo_Icon.svg"

const API_URL = "http://localhost:3333"
const COUNTDOWN_SECONDS = 5

export default function RedirectPage() {
  const [searchParams] = useSearchParams()
  const shortLink = searchParams.get("shortLink")
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const redirectUrl = shortLink ? `${API_URL}/${shortLink}` : "/"

  useEffect(() => {
    if (!shortLink) return

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
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [shortLink])

  if (!shortLink) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div
          className="flex flex-col items-center bg-background rounded-lg text-center"
          style={{ width: 580, padding: "64px 48px", gap: 24 }}
        >
          <img src={Logo} alt="brev.ly" width={64} height={64} />
          <div className="flex flex-col items-center text-center" style={{ gap: 4, width: "100%" }}>
            <h1 className="text-2xl font-bold leading-8 text-foreground">
              Link não encontrado
            </h1>
            <p className="text-sm text-muted-foreground">
              O link encurtado que você acessou não existe ou foi removido.
            </p>
          </div>
          <a
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <div
        className="flex flex-col items-center bg-background rounded-lg text-center"
        style={{ width: 580, padding: "64px 48px", gap: 24 }}
      >
        <img src={Logo} alt="brev.ly" width={64} height={64} />

        <div className="flex flex-col items-center text-center" style={{ gap: 4, width: "100%" }}>
          <h1 className="text-2xl font-bold leading-8 text-foreground">
            Redirecionando em {countdown}...
          </h1>
          <p className="text-sm text-muted-foreground">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p className="text-sm text-muted-foreground">
            Não foi redirecionado?{" "}
            <a href={redirectUrl} className="text-primary font-medium hover:underline">
              Acesse aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}