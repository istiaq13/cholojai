"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MapPin, Clock, CheckCircle, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import packagesData from "@/data/packages.json"
import { VisaAccordion } from "@/components/visa-accordion"

interface QuizData {
  nickname: string
  budget: string
  destinations: string[]
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
  visa_info?: object
}

function ResultPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])

  useEffect(() => {
    const storedQuizData = sessionStorage.getItem('quizData') // Getting quiz data from sessionStorage
    if (!storedQuizData) {
      router.push('/')
      return
    }

    const parsedQuizData: QuizData = JSON.parse(storedQuizData)
    setQuizData(parsedQuizData)

    // Filter packages based on quiz responses
    const filtered = packagesData.packages.filter((pkg: Package) => {
      const budgetMatch = pkg.budget === parsedQuizData.budget
      const destinationMatch = parsedQuizData.destinations.includes(pkg.destination)
      return budgetMatch && destinationMatch
    })

    // If no exact matches, show packages from selected destinations
    if (filtered.length === 0) {
      const destinationOnlyFiltered = packagesData.packages.filter((pkg: Package) =>
        parsedQuizData.destinations.includes(pkg.destination)
      )
      setFilteredPackages(destinationOnlyFiltered)
    } else {
      setFilteredPackages(filtered)
    }
  }, [router])

  const handleWhatsAppContact = (packageData: Package) => {
    const phoneNumber = "+8801708070250"
    
    // Get UTM parameters
    const utmParams: string[] = []
    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utmParams.push(`${key}=${value}`)
      }
    })
    
    const message = `Hi! I'm ${quizData?.nickname} and I'm interested in the "${packageData.name}" package (৳${packageData.price}). ${utmParams.length > 0 ? `UTM: ${utmParams.join(', ')}` : ''}`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p>Loading your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">choloJai.</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Perfect Trips for You, {quizData.nickname}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, we&apos;ve found {filteredPackages.length} amazing {filteredPackages.length === 1 ? 'package' : 'packages'} just for you.
          </p>
        </div>

        {/* Filter Summary */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Your Preferences:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
              Budget: {packagesData.budgetRanges[quizData.budget as keyof typeof packagesData.budgetRanges]?.label}
            </span>
            {quizData.destinations.map((destId) => {
              const dest = packagesData.destinations.find(d => d.id === destId)
              return (
                <span key={destId} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {dest?.name}
                </span>
              )
            })}
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Package Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.budget === 'low' ? 'Budget' : pkg.budget === 'medium' ? 'Mid-Range' : 'Premium'}
                    </span>
                  </div>
                  {pkg.visa_required && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                        Visa Required
                      </span>
                    </div>
                  )}
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pkg.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{pkg.duration}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">৳{pkg.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm">/person</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Highlights:</h4>
                    <div className="space-y-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-teal-500" />
                          <span className="text-xs text-gray-600">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleWhatsAppContact(pkg)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Book via WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 font-bold text-gray-400">No Results</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No packages found for your preferences
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your budget or destinations to see more options.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Take Quiz Again
            </button>
          </div>
        )}

        {/* Visa Information */}
        {filteredPackages.some(pkg => pkg.visa_required) && (
          <div className="mt-12">
            <VisaAccordion />
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need help choosing? Contact us directly on WhatsApp at{" "}
            <a
              href={`https://wa.me/8801708070250`}
              className="text-teal-500 hover:text-teal-600 font-medium"
            >
              +880 1708 070250
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p>Loading your personalized recommendations...</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
}