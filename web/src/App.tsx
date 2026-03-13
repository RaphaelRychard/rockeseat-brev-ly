import Logo from "../assets/Logo.svg";
import { Toaster } from "./components/ui/toaster"
import { ShortLinkSection } from "./components/short-link-section"

export default function App() {
  return (
    <div className="grid place-content-center min-h-screen bg-background">
      <div className="flex flex-col items-start gap-2">
        <img src={Logo} alt="brev.ly" className="h-6" />
        <ShortLinkSection />
      </div>
      <Toaster />
    </div>
  )
}
