import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <HeroSection />
    </main>
  )
}
