"use client"

import { FaWhatsapp } from "react-icons/fa"

export function WhatsAppContact() {
  const phoneNumber = "+8801708070250"
  const message = "Hello! I'm interested in your travel services."
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
        aria-label="Chat with us on WhatsApp"
      >
        {/* WhatsApp Icon */}
        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>
  )
}