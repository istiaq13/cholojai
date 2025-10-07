'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plane, Hotel } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import DownloadPDFButton from "@/components/DownloadPDFButton";

type VisaInfo = {
  type: string;
  duration: string;
  requirements: string[];
  processing_time: string;
};

type Activity = {
  time: string;
  activity: string;
  location: string;
  transport?: string;
  accommodation?: string;
};

type Day = {
  day: string;
  activities: Activity[];
};

type Package = {
  id: number;
  name: string;
  destination: string;
  country: string;
  budget: "low" | "medium" | "high";
  price: number;
  duration: string;
  image: string;
  description: string;
  includes: string[];
  highlights: string[];
  visa_required: boolean;
  visa_info?: VisaInfo;
  trip_dates?: {
    start: string;
    end: string;
  };
  daily_schedule?: Day[];
  accommodation?: {
    hotel: string;
    address: string;
    check_in: string;
    check_out: string;
  };
  transportation?: {
    flight: string;
    departure: string;
    arrival: string;
    flight_details: string;
  };
  notes?: string[];
};

export default function ItineraryClient({ pkg }: { pkg: Package }) {
  return (
    <main className="bg-gray-50 pb-20">
      {/* Navbar - Not included in PDF */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50" id="navbar-exclude">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">choloJai.</h1>
        </div>
      </nav>

      {/* Itinerary Content */}
      <div id="itinerary-content">
        {/* Hero Section */}
        <section className="relative mt-20">
          <Image
            src={pkg.image}
            alt={pkg.name}
            width={1920}
            height={1080}
            className="w-full h-[400px] object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-4xl font-bold text-teal-500">{pkg.name}</h1>
            <p className="text-lg mt-2">
              {pkg.country} • {pkg.duration} • ৳{pkg.price.toLocaleString()}
            </p>
            <p className="text-sm mt-1">
              {pkg.trip_dates?.start} → {pkg.trip_dates?.end}
            </p>
            <span className="mt-3 px-3 py-1 bg-teal-600 rounded-full text-sm uppercase">
              {pkg.budget} budget
            </span>
          </div>
        </section>

        {/* Trip Summary */}
        <div className="container mx-auto px-4 mt-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Trip Overview</h2>
              <p className="text-gray-700 mb-4">{pkg.description}</p>

              <ul className="text-gray-600 space-y-2">
                <li><strong>Start Location:</strong> Dhaka (default)</li>
                <li><strong>Destination:</strong> {pkg.destination.toUpperCase()}</li>
                <li><strong>Price:</strong> ৳{pkg.price.toLocaleString()}</li>
                <li><strong>Duration:</strong> {pkg.duration}</li>
              </ul>
            </div>

            {/* Visa Info if Required */}
            {pkg.visa_required && pkg.visa_info && (
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-xl font-semibold mb-2 text-teal-700">Visa Information</h3>
                <p><strong>Type:</strong> {pkg.visa_info.type}</p>
                <p><strong>Duration:</strong> {pkg.visa_info.duration}</p>
                <p><strong>Processing Time:</strong> {pkg.visa_info.processing_time}</p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  {pkg.visa_info.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Daily Schedule */}
        <section className="container mx-auto px-4 mt-14">
          <h2 className="text-2xl font-semibold mb-4">Daily Schedule</h2>
          <div className="border-l-4 border-teal-600 pl-6 space-y-8">
            {pkg.daily_schedule?.map((day, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[34px] top-1 w-6 h-6 bg-teal-600 rounded-full"></div>
                <h3 className="text-xl font-semibold mb-2">Day {idx + 1} – {day.day}</h3>
                <ul className="space-y-2">
                  {day.activities.map((a, i) => (
                    <li key={i} className="bg-white shadow rounded-lg p-3">
                      <p><span className="font-semibold">{a.time}</span> — {a.activity}</p>
                      <p className="text-sm text-gray-500">{a.location}</p>
                      {a.transport && <p className="text-sm"><strong>Transport:</strong> {a.transport}</p>}
                      {a.accommodation && <p className="text-sm"><strong>Accommodation:</strong> {a.accommodation}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Accommodation & Transport */}
        <section className="container mx-auto px-4 mt-14 grid md:grid-cols-2 gap-8">
          {pkg.accommodation && (
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-2 mb-2">
                <Hotel size={20} className="text-teal-600" />
                <h3 className="text-xl font-semibold">Accommodation</h3>
              </div>
              <p>{pkg.accommodation.hotel}</p>
              <p className="text-sm text-gray-500">{pkg.accommodation.address}</p>
              <p className="text-sm text-gray-500">Check-in: {pkg.accommodation.check_in}</p>
              <p className="text-sm text-gray-500">Check-out: {pkg.accommodation.check_out}</p>
            </div>
          )}

          {pkg.transportation && (
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center gap-2 mb-2">
                <Plane size={20} className="text-teal-600" />
                <h3 className="text-xl font-semibold">Transportation</h3>
              </div>
              <p>{pkg.transportation.flight}</p>
              <p className="text-sm text-gray-500">Departure: {pkg.transportation.departure}</p>
              <p className="text-sm text-gray-500">Arrival: {pkg.transportation.arrival}</p>
              <p className="text-sm text-gray-500">{pkg.transportation.flight_details}</p>
            </div>
          )}
        </section>

        {/* Notes */}
        {pkg.notes && (
          <section className="container mx-auto px-4 mt-14">
            <h2 className="text-2xl font-semibold mb-4">Notes / Special Instructions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {pkg.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 flex justify-center gap-4">
        <Link
          href={`https://wa.me/8801708070250?text=${encodeURIComponent(
            `Hi! I'm interested in ${pkg.name} (${pkg.duration}) priced at ৳${pkg.price}.`
          )}`}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
        >
          Book via WhatsApp
        </Link>
        <DownloadPDFButton fileName={`${pkg.destination}-itinerary`} />
        <ShareButton
          title={`Check out this trip to ${pkg.name}!`}
          text={`I'm planning a trip to ${pkg.name} (${pkg.duration}) — looks amazing!`}
          url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/itinerary/${pkg.destination}`}
        />
      </div>
    </main>
  );
}