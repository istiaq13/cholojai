import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { WhatsAppContact } from "@/components/whatsapp-contact"

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <div className="relative">
        <HeroSection />
      </div>
      <WhatsAppContact />
    </main>
  )
}
