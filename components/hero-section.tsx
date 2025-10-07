"use client"

import { useState } from "react"
import { QuizPopup } from "./quiz-popup"

export function HeroSection() {
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  const handleWhatsAppContact = () => {
    const phoneNumber = "+8801708070250"
    const message = "Hello! I'm interested in your travel services and would like to know more about your packages."
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/image-bg.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight">
              Discover Your Next
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-teal-400 text-[0.96em]">Dream Destination</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Take our quick 3-step quiz and get personalized travel recommendations just for you
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setIsQuizOpen(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-7 py-3.5 sm:px-9 sm:py-4.5 text-base sm:text-lg font-semibold rounded-full transform transition-all hover:scale-105 shadow-lg"
              >
                Find My Trip
              </button>
              <button 
                onClick={handleWhatsAppContact}
                className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-7 py-3.5 sm:px-9 sm:py-4.5 text-base sm:text-lg font-semibold rounded-full transform transition-all hover:scale-105"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <QuizPopup isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  )
}
