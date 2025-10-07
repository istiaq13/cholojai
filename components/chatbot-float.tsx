"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { ChatbotUI } from "./chatbot-ui"

export function ChatBotFloat() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  
  const handleChatbotClick = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleChatbotClick}
          className="group relative text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
          style={{ backgroundColor: '#14B8A6' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F9A8A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14B8A6'}
          aria-label="Chat with our travel assistant"
        >
          {/* shows ask choloJai on hovering on the chat icon */}
          <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
              Ask choloJai
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
          
          {/* Messenger Icon */}
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <ChatbotUI isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  )
}