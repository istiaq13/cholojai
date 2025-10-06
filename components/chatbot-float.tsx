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
          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
          aria-label="Chat with our travel assistant"
        >
          {/* Messenger Icon */}
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <ChatbotUI isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  )
}