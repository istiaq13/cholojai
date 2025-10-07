// This file is now for server-side logic, fetching data, generating metadata, etc.

// Remove the `use client` directive from this part
import path from "path";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import ItineraryClient from "./ItineraryClient"; // Import client-side component

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

type DataFile = { packages: Package[] };

async function getData(): Promise<DataFile> {
  const file = path.join(process.cwd(), "data", "packages.json");
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export async function generateStaticParams() {
  const { packages } = await getData();
  return packages.map((p: Package) => ({ id: p.destination }));
}

// Server-side metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  const { packages } = await getData();
  const pkg = packages.find((p: Package) => p.destination === id);
  if (!pkg) return {};
  return {
    title: `${pkg.name} – Itinerary | CholoJai`,
    description: pkg.description,
  };
}

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { packages } = await getData();
  const pkg = packages.find((p: Package) => p.destination === id);

  if (!pkg) notFound();

  // Pass package data to client-side component
  return <ItineraryClient pkg={pkg} />;
}
