"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, FileText, Clock, AlertCircle } from "lucide-react"
import packagesData from "@/data/packages.json"

interface VisaInfo {
  type: string
  duration: string
  requirements: string[]
  processing_time: string
}

interface VisaAccordionProps {
  className?: string
  destinations?: string[]
}

export function VisaAccordion({ className = "", destinations = [] }: VisaAccordionProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // Get visa info for all destinations that have visa information
  const allVisaData = [
    {
      id: "uae",
      destination: "uae",
      country: "United Arab Emirates (UAE)",
      flag: "AE",
      info: packagesData.packages.find(pkg => pkg.destination === "uae" && pkg.visa_info)?.visa_info as VisaInfo
    },
    {
      id: "thailand",
      destination: "bangkok",
      country: "Thailand",
      flag: "TH", 
      info: packagesData.packages.find(pkg => pkg.destination === "bangkok" && pkg.visa_info)?.visa_info as VisaInfo
    }
  ]

  // Filter visa data based on selected destinations, or show all if no destinations specified
  const visaData = destinations.length > 0 
    ? allVisaData.filter(item => item.info && destinations.includes(item.destination))
    : allVisaData.filter(item => item.info) // Only include countries with visa info

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-teal-500" />
          <h2 className="text-2xl font-bold text-gray-800">Visa Requirements</h2>
        </div>
        <p className="text-gray-600">
          Important visa information for international destinations
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {visaData.map((visa) => (
          <div key={visa.id} className="transition-all duration-200">
            <button
              onClick={() => toggleAccordion(visa.id)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{visa.flag}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {visa.country}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {visa.info.type} • {visa.info.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {openAccordion === visa.id ? 'Hide' : 'Show'} Details
                  </span>
                  {openAccordion === visa.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>

            {openAccordion === visa.id && (
              <div className="px-6 pb-6 animate-slideDown">
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {/* Processing Time */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">Processing Time</p>
                      <p className="text-sm text-blue-600">{visa.info.processing_time}</p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Required Documents
                    </h4>
                    <div className="grid gap-2">
                      {visa.info.requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-2 bg-white rounded border border-gray-200"
                        >
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Note */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-700">Important Note</p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Visa requirements may change. Please verify current requirements with the embassy or consulate before travel.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact for Help */}
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-sm text-teal-700 mb-3">
                      <span className="font-medium">Need help with visa processing?</span><br />
                      Contact us on WhatsApp for visa assistance and guidance.
                    </p>
                    <a
                      href="https://wa.me/8801708070250?text=Hi! I need help with visa processing for travel."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Get Visa Help
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}