import path from "path";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plane, Hotel, FileText } from "lucide-react";

interface Package {
  id: number;
  destination: string;
  name: string;
  country: string;
  duration: string;
  price: number;
  budget: string;
  image: string;
  description: string;
  visa_required: boolean;
  visa_info?: {
    type: string;
    duration: string;
    processing_time: string;
    requirements: string[];
  };
  trip_dates?: {
    start: string;
    end: string;
  };
  daily_schedule?: Array<{
    day: string;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      transport?: string;
      accommodation?: string;
    }>;
  }>;
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
}

async function getData() {
  const file = path.join(process.cwd(), "data", "packages.json");
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export async function generateStaticParams() {
  const { packages }: { packages: Package[] } = await getData();
  return packages.map((p: Package) => ({ id: p.destination }));
}

export default async function ItineraryPage({ params }: { params: { id: string } }) {
  const { packages }: { packages: Package[] } = await getData();
  const pkg = packages.find((p: Package) => p.destination === params.id);
  if (!pkg) notFound();

  return (
    <main className="bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Image src="/cholojai-logo.png" alt="CholoJai Logo" width={100} height={50} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mt-20">
        <Image
          src={pkg.image}
          alt={pkg.name}
          width={1920}
          height={1080}
          className="w-full h-[400px] object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl font-bold">{pkg.name}</h1>
          <p className="text-lg mt-2">{pkg.country} • {pkg.duration} • ৳{pkg.price.toLocaleString()}</p>
          <p className="text-sm mt-1">{pkg.trip_dates?.start} → {pkg.trip_dates?.end}</p>
          <span className="mt-3 px-3 py-1 bg-teal-600 rounded-full text-sm uppercase">{pkg.budget} budget</span>
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
                {pkg.visa_info.requirements.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Daily Schedule Timeline */}
      <section className="container mx-auto px-4 mt-14">
        <h2 className="text-2xl font-semibold mb-4">Daily Schedule</h2>
        <div className="border-l-4 border-teal-600 pl-6 space-y-8">
          {pkg.daily_schedule?.map((day, idx: number) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[34px] top-1 w-6 h-6 bg-teal-600 rounded-full"></div>
              <h3 className="text-xl font-semibold mb-2">Day {idx + 1} – {day.day}</h3>
              <ul className="space-y-2">
                {day.activities.map((a, i: number) => (
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
            {pkg.notes.map((note: string, i: number) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}

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
        <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2">
          <FileText size={18} /> Download PDF
        </button>
        <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all">
          Share
        </button>
      </div>
    </main>
  );
}

export const dynamic = "force-static";
