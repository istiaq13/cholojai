"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


const destinations = [
  {
    id: 1,
    name: "Sajek",
    destination: "sajek", 
    country: "Bangladesh",
    price: 150,
    image: "/sajek.jpg",
  },
  {
    id: 2,
    name: "Cox's Bazar",
    destination: "coxs", 
    country: "Bangladesh",
    price: 120,
    image: "/coxs.jpg",
  },
  {
    id: 3,
    name: "Bangkok",
    destination: "bangkok", 
    country: "Thailand",
    price: 300,
    image: "/bangkok.jpg",
  },
  {
    id: 4,
    name: "UAE",
    destination: "uae", 
    country: "United Arab Emirates",
    price: 500,
    image: "/uae.jpg",
  },
]

export function AnimatedHeroCards() {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldTransform, setShouldTransform] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < -100) {
            setShouldTransform(true)
          } else if (entry.isIntersecting || entry.boundingClientRect.top >= -100) {
            setShouldTransform(false)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`relative -mt-16 sm:-mt-24 lg:-mt-32 z-10 transition-all duration-1000 ease-in-out ${
        shouldTransform ? "opacity-0 translate-y-32 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={destination.id}
              href={`/itinerary/${destination.destination}`} // correctly link to itinerary page
              className={`relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-lg sm:shadow-xl hover:shadow-2xl bg-white transition-all duration-700 min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="absolute inset-0">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              <div className="relative h-full p-4 sm:p-6 flex flex-col justify-end text-white">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 group-hover:text-teal-400 transition-colors">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-teal-400" />
                  <span className="text-xs sm:text-sm">{destination.country}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
