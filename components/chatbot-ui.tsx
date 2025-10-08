"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, MessageCircle, MapPin, Clock, CheckCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import databank from '@/data/packages.json';

interface ChatbotUIProps {
  isOpen: boolean
  onClose: () => void
}

interface Package {
  id: number
  name: string
  destination: string
  country: string
  budget: string
  price: number
  duration: string
  image: string
  description: string
  includes: string[]
  highlights: string[]
  visa_required: boolean
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isAnswerCard?: boolean
  source?: 'faq' | 'package' | 'ai' | 'error'
  packageData?: Package | Package[]
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
  const [utmParams, setUtmParams] = useState<string>("")
  const [showWhatsAppCTA, setShowWhatsAppCTA] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      const utmValues = utmKeys
        .map(key => {
          const value = params.get(key);
          return value ? `${key}=${value}` : null;
        })
        .filter(Boolean)
        .join('&');
      
      setUtmParams(utmValues);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const searchFAQ = (query: string): typeof databank.faqs[0] | null => {
    const normalizedQuery = query.toLowerCase().trim();
    
    let bestMatch = databank.faqs.find(faq => 
      faq.keywords.some(keyword => normalizedQuery.includes(keyword.toLowerCase()))
    );

    if (!bestMatch) {
      bestMatch = databank.faqs.find(faq => 
        faq.question.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.split(' ').some(word => 
          word.length > 3 && faq.keywords.some(kw => kw.toLowerCase().includes(word))
        )
      );
    }
    
    return bestMatch || null;
  }

  const searchPackages = (query: string): Package[] => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if user is asking for all packages
    const allPackageKeywords = [
      'all packages',
      'show all',
      'all package',
      'available packages',
      'what packages',
      'which packages',
      'packages available',
      'list packages',
      'show packages',
      'view all',
      'see all',
      'all trips',
      'all destinations',
      'what do you have',
      'what do you offer',
      'your packages',
      'package list'
    ];
    
    const isAskingForAll = allPackageKeywords.some(keyword => 
      normalizedQuery.includes(keyword)
    );
    
    if (isAskingForAll) {
      return databank.packages; // Return all packages
    }
    
    // Extract budget range from query (if mentioned)
    let budgetMin: number | null = null;
    let budgetMax: number | null = null;
    
    // Check for budget numbers in query (e.g., "15000", "50000", "15,000 to 50,000")
    const numberMatches = normalizedQuery.match(/[\d,]+/g);
    if (numberMatches) {
      const numbers = numberMatches.map(n => parseInt(n.replace(/,/g, '')));
      if (numbers.length >= 2) {
        budgetMin = Math.min(...numbers);
        budgetMax = Math.max(...numbers);
      } else if (numbers.length === 1) {
        // Single number mentioned
        const singleNum = numbers[0];
        if (normalizedQuery.includes('under') || normalizedQuery.includes('below') || normalizedQuery.includes('less than')) {
          budgetMax = singleNum;
        } else if (normalizedQuery.includes('above') || normalizedQuery.includes('more than') || normalizedQuery.includes('over')) {
          budgetMin = singleNum;
        } else {
          // Assume it's a range around the number
          budgetMin = singleNum * 0.8;
          budgetMax = singleNum * 1.2;
        }
      }
    }
    
    // Search for multiple packages
    const matches = databank.packages.filter(pkg => {
      // Budget-based filtering
      if (budgetMin !== null || budgetMax !== null) {
        if (budgetMin !== null && pkg.price < budgetMin) return false;
        if (budgetMax !== null && pkg.price > budgetMax) return false;
        return true; // Within budget range
      }
      
      // Keyword-based search
      const searchTerms = [
        pkg.destination.toLowerCase(),
        pkg.name.toLowerCase(),
        pkg.country.toLowerCase(),
        pkg.budget.toLowerCase()
      ];
      
      return searchTerms.some(term => 
        normalizedQuery.includes(term) || term.includes(normalizedQuery)
      );
    });
    
    return matches;
  }

  const callAI = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.response || "I'm having trouble right now. Please chat with our team on WhatsApp! 😊";
    } catch (error) {
      console.error('AI Error:', error);
      return "I'm having trouble connecting right now. Please chat with our team on WhatsApp for immediate help! 😊";
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    let responseContent = "";
    let messageSource: 'faq' | 'package' | 'ai' = 'ai';
    let isAnswerCard = false;
    let packageData: Package | Package[] | undefined;

    // Step 1: Check FAQs first
    const faqMatch = searchFAQ(currentQuery);
    if (faqMatch) {
      responseContent = faqMatch.answer;
      messageSource = 'faq';
      isAnswerCard = true;
      // Show WhatsApp CTA for booking-related FAQs
      if (faqMatch.id === 'booking' || faqMatch.id === 'contact') {
        setShowWhatsAppCTA(true);
      }
    } 
    // Step 2: Check Packages
    else {
      const packageMatches = searchPackages(currentQuery);
      if (packageMatches.length > 0) {
        // Check if showing all packages
        const isShowingAll = packageMatches.length === databank.packages.length;
        
        responseContent = isShowingAll
          ? `Here are all our ${packageMatches.length} amazing travel packages! 🌍✨`
          : packageMatches.length === 1 
            ? `Here's the perfect package for you! 🎉`
            : `I found ${packageMatches.length} amazing packages for you! 🎉`;
        messageSource = 'package';
        isAnswerCard = false;
        packageData = packageMatches;
        // Show WhatsApp CTA when packages are shown
        setShowWhatsAppCTA(true);
      } 
      // Step 3: Call AI for fallback
      else {
        responseContent = await callAI(currentQuery);
        messageSource = 'ai';
        isAnswerCard = false;
        // Always show WhatsApp CTA for AI responses (means we don't have the answer)
        setShowWhatsAppCTA(true);
      }
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: responseContent,
      timestamp: new Date(),
      isAnswerCard: isAnswerCard,
      source: messageSource,
      packageData: packageData
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botResponse]);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const handleWhatsAppClick = (pkg?: Package) => {
    const lastUserMessage = messages
      .filter(m => m.type === 'user')
      .slice(-1)[0]?.content || '';

    const message = pkg 
      ? `Hi! I'm interested in the "${pkg.name}" package (৳${pkg.price.toLocaleString()}).`
      : lastUserMessage 
        ? `Hi! I was asking about: "${lastUserMessage}". Can you help me with this?`
        : "Hi! I have questions about your travel packages.";

    const fullMessage = utmParams 
      ? `${message}\n\n[Via: ${utmParams}]`
      : message;

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER
    if (!phoneNumber) {
      console.error('NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER is not set')
      return
    }

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`,
      "_blank"
    );
  }

  const PackageCard = ({ pkg }: { pkg: Package }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 mb-3">
      <div className="relative h-32">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {pkg.budget === 'low' ? 'Budget' : pkg.budget === 'medium' ? 'Mid-Range' : 'Premium'}
          </span>
        </div>
        {pkg.visa_required && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">Visa Required</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-bold text-gray-800 text-sm mb-1">{pkg.name}</h4>
        
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <MapPin className="h-3 w-3" />
          <span className="text-xs">{pkg.country}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <Clock className="h-3 w-3" />
          <span className="text-xs">{pkg.duration}</span>
        </div>

        <div className="mb-2">
          <span className="text-lg font-bold text-gray-800">৳{pkg.price.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">/person</span>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-600 space-y-1">
            {pkg.highlights.slice(0, 2).map((highlight, index) => (
              <div key={index} className="flex items-start gap-1">
                <CheckCircle className="h-2.5 w-2.5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleWhatsAppClick(pkg)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded text-xs font-semibold transition-all"
          >
            Book Now
          </button>
          <a
            href={`/itinerary/${pkg.destination}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded text-xs font-semibold transition-all"
          >
            <ExternalLink className="h-3 w-3" />
            Details
          </a>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-w-md">
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
              aria-label="Close chat"
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
                <div className={`${message.type === "user" ? "max-w-[85%]" : "max-w-full flex-1"}`}>
                  {/* Text Message */}
                  <div className={`${
                    message.isAnswerCard 
                      ? "bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-4 shadow-md" 
                      : message.type === "user"
                      ? "bg-teal-500 text-white rounded-2xl rounded-br-md px-4 py-2"
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm"
                  }`}>
                    {message.isAnswerCard && (
                      <div className="flex items-center gap-2 mb-2 text-teal-700">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                        <span className="text-xs font-semibold uppercase tracking-wide">Quick Answer</span>
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

                  {/* Package Cards */}
                  {message.packageData && (
                    <div className="mt-3 space-y-3">
                      {Array.isArray(message.packageData) ? (
                        message.packageData.map((pkg) => (
                          <PackageCard key={pkg.id} pkg={pkg} />
                        ))
                      ) : (
                        <PackageCard pkg={message.packageData} />
                      )}
                    </div>
                  )}
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

        {/* WhatsApp CTA Bar - Only show after user interaction */}
        {showWhatsAppCTA && (
          <div className="bg-emerald-50 border-t border-emerald-100 p-3">
            <button
              onClick={() => handleWhatsAppClick()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp for Booking</span>
            </button>
          </div>
        )}

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
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}