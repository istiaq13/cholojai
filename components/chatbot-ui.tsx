"use client"

import { useState } from "react"
import { X, Send, Bot } from "lucide-react"

interface ChatbotUIProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatbotUI({ isOpen, onClose }: ChatbotUIProps) {
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    setInputMessage("") 
  }



  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">choloJai Assistant</h3>
                <p className="text-xs text-teal-100">Online now</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Static Bot Message */}
        <div className="h-80 overflow-y-auto p-4">
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-teal-600" />
            </div>
            <div className="max-w-xs px-3 py-2 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md">
              <p className="text-sm">Hello! I&apos;m your travel assistant. How can I help you plan your perfect trip today?</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>



        {/* Input msg */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder-gray-500 bg-white"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}