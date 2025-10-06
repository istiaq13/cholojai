import { Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AnimatedHeroCards } from "@/components/animated-hero-cards"
import { WhatsAppContact } from "@/components/whatsapp-contact"

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <div className="relative">
        <HeroSection />
        <AnimatedHeroCards />
      </div>
      <Suspense fallback={null}>
        <WhatsAppContact />
      </Suspense>
    </main>
  )
}
