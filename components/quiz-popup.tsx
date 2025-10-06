"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizData {
  nickname: string
  budget: string
  destinations: string[]
}

interface QuizPopupProps {
  isOpen: boolean
  onClose: () => void
}

const budgetOptions = [
  { id: "low", label: "Budget Friendly", range: "৳0 - ৳15,000", icon: "$" },
  { id: "medium", label: "Mid Range", range: "৳15,001 - ৳50,000", icon: "$$" },
  { id: "high", label: "Premium", range: "৳50,001+", icon: "$$$" }
]

const destinationOptions = [
  { id: "sajek", name: "Sajek Valley", country: "Bangladesh", emoji: "BD" },
  { id: "coxs", name: "Cox's Bazar", country: "Bangladesh", emoji: "BD" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", emoji: "TH" },
  { id: "uae", name: "Dubai/UAE", country: "UAE", emoji: "AE" }
]

export function QuizPopup({ isOpen, onClose }: QuizPopupProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [quizData, setQuizData] = useState<QuizData>({
    nickname: "",
    budget: "",
    destinations: []
  })

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Store quiz data in sessionStorage for the result page
    sessionStorage.setItem('quizData', JSON.stringify(quizData))
    
    // Preserve UTM parameters
    const urlParams = new URLSearchParams(window.location.search)
    const utmParams = new URLSearchParams()
    
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams.set(key, value)
      }
    }
    
    // Navigate to results page with UTM params
    const utmString = utmParams.toString()
    const resultUrl = utmString ? `/result?${utmString}` : '/result'
    router.push(resultUrl)
  }

  const handleDestinationToggle = (destinationId: string) => {
    setQuizData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destinationId)
        ? prev.destinations.filter(id => id !== destinationId)
        : [...prev.destinations, destinationId]
    }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return quizData.nickname.trim().length > 0
      case 2: return quizData.budget !== ""
      case 3: return quizData.destinations.length > 0
      default: return false
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'
    }`}>
      <div className={`bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 ease-out ${
        isAnimating 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-75 translate-y-8'
      }`}>

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Plan Your Trip</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out transform ${
                    step <= currentStep 
                      ? 'bg-teal-500 opacity-100 scale-100' 
                      : 'bg-gray-200 opacity-60 scale-95'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mt-2">
            {['Nickname', 'Budget', 'Destinations'].map((label, index) => (
              <span 
                key={label}
                className={`transition-all duration-500 ease-in-out ${
                  index + 1 <= currentStep 
                    ? 'text-teal-600 font-medium opacity-100 transform scale-105' 
                    : 'text-gray-500 opacity-70 transform scale-100'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/*Nickname Section in the Popup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4 font-bold text-black">Hi!</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  What should we call you?
                </h3>
                <p className="text-gray-600">
                  Let&apos;s personalize your travel experience
                </p>
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Enter your nickname"
                  value={quizData.nickname}
                  onChange={(e) => setQuizData(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 bg-white"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/*Budget Section in the Popup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4 font-bold text-black">Budget</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  What&apos;s your budget, {quizData.nickname}?
                </h3>
                <p className="text-gray-600">
                  Choose a range that works for you
                </p>
              </div>
              
              <div className="space-y-3">
                {budgetOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setQuizData(prev => ({ ...prev, budget: option.id }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      quizData.budget === option.id
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold bg-teal-100 text-teal-700 px-2 py-1 rounded">{option.icon}</span>
                      <div>
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm opacity-75">{option.range}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Destinations Section in the Popup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4 font-bold text-black">Travel</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Where would you like to go?
                </h3>
                <p className="text-gray-600">
                  Select one or more destinations
                </p>
              </div>
              
              <div className="space-y-3">
                {destinationOptions.map((destination) => (
                  <button
                    key={destination.id}
                    onClick={() => handleDestinationToggle(destination.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      quizData.destinations.includes(destination.id)
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{destination.emoji}</span>
                      <div>
                        <div className="font-semibold">{destination.name}</div>
                        <div className="text-sm opacity-75">{destination.country}</div>
                      </div>
                      {quizData.destinations.includes(destination.id) && (
                        <div className="ml-auto text-teal-500">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Section in the Popup */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-between gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105 hover:bg-gray-50 rounded-lg transform"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 hover:-translate-x-1" />
                Back
              </button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Find My Perfect Trip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}