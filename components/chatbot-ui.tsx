"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, MessageCircle } from "lucide-react"
import databank from '@/data/packages.json';

interface ChatbotUIProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isAnswerCard?: boolean
  source?: 'faq' | 'package' | 'ai' | 'error'
}

export function ChatbotUI({ isOpen, onClose }: ChatbotUIProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! 👋 I'm your choloJai travel assistant.\n\nI can help you with:\n• Package information\n• Booking process\n• Visa requirements\n• Pricing & discounts\n\nWhat would you like to know?",
      timestamp: new Date(),
      isAnswerCard: true
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Search FAQs
  const searchFAQ = (query: string): typeof databank.faqs[0] | null => {
    const normalizedQuery = query.toLowerCase().trim()
    
    return databank.faqs.find(faq => 
      faq.keywords.some(keyword => normalizedQuery.includes(keyword))
    ) || null
  }

  // Search Packages
  const searchPackage = (query: string): typeof databank.packages[0] | null => {
    const normalizedQuery = query.toLowerCase().trim()
    
    return databank.packages.find(pkg => 
      pkg.keywords.some(keyword => normalizedQuery.includes(keyword))
    ) || null
  }

  // Call AI for fallback
  const callAI = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })

      if (!response.ok) throw new Error('API failed')

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('AI Error:', error)
      return "I'm having trouble right now. Please chat with our team on WhatsApp for immediate help! 😊"
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentQuery = inputMessage
    setInputMessage("")
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    let responseContent = ""
    let messageSource: 'faq' | 'package' | 'ai' = 'ai'
    let isAnswerCard = false

    // Step 1: Check FAQs
    const faqMatch = searchFAQ(currentQuery)
    if (faqMatch) {
      responseContent = faqMatch.answer
      messageSource = 'faq'
      isAnswerCard = true
    } 
    // Step 2: Check Packages
    else {
      const packageMatch = searchPackage(currentQuery)
      if (packageMatch) {
        responseContent = `Great choice! Here's our ${packageMatch.name}:\n\n💰 Price: ৳${packageMatch.price.toLocaleString()}\n⏱️ Duration: ${packageMatch.duration}\n✨ ${packageMatch.description}\n\nWant to know more details?`
        messageSource = 'package'
        isAnswerCard = true
      } 
      // Step 3: Call AI for fallback
      else {
        responseContent = await callAI(currentQuery)
        messageSource = 'ai'
        isAnswerCard = false
      }
    }

    // Add bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: responseContent,
      timestamp: new Date(),
      isAnswerCard: isAnswerCard,
      source: messageSource
    }

    setIsTyping(false)
    setMessages(prev => [...prev, botResponse])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleWhatsAppClick = () => {
    const message = "Hi! I have questions about your travel packages."
    window.open(
      `https://wa.me/8801708070250?text=${encodeURIComponent(message)}`,
      "_blank"
    )
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
                <p className="text-xs text-teal-100">Online • Ready to help</p>
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

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-teal-600" />
                  </div>
                )}
                <div className={`max-w-xs ${
                  message.isAnswerCard 
                    ? "bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-4 shadow-md" 
                    : message.type === "user"
                    ? "bg-teal-500 text-white rounded-2xl rounded-br-md px-4 py-2"
                    : "bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm"
                }`}>
                  {message.isAnswerCard && (
                    <div className="flex items-center gap-2 mb-2 text-teal-700">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {message.source === 'faq' ? 'Quick Answer' : 'Package Info'}
                      </span>
                    </div>
                  )}
                  <p className={`text-sm whitespace-pre-line ${message.isAnswerCard ? 'text-gray-800' : ''}`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.isAnswerCard ? 'text-gray-500' :
                    message.type === "user" ? "text-teal-100" : "text-gray-500"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-bl-md shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp CTA Bar */}
        <div className="bg-emerald-50 border-t border-emerald-100 p-3">
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp for Booking</span>
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
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