
import path from "path";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


type VisaInfo = {
  type: string;
  duration: string;
  requirements: string[];
  processing_time: string;
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
};

type DataFile = { packages: Package[] };

// ---- Read JSON on the server ----
async function getData(): Promise<DataFile> {
  const file = path.join(process.cwd(), "data", "packages.json"); 
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json) as DataFile;
}

// ---- Pre-generate the dynamic routes ----
export async function generateStaticParams() {
  const { packages } = await getData();
  return packages.map((p) => ({ id: p.destination })); 
}

//  Nice SEO per package
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { packages } = await getData();
  const pkg = packages.find((p) => p.destination === params.id);
  if (!pkg) return {};
  return {
    title: `${pkg.name} – Itinerary | CholoJai`,
    description: pkg.description,
  };
}

// ---- Page component ----
export default async function ItineraryPage({
  params,
}: {
  params: { id: string };
}) {
  const { packages } = await getData();
  const pkg = packages.find((p) => p.destination === params.id);
  if (!pkg) notFound();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{pkg!.name}</h1>
      <p className="text-gray-600 mb-4">
        {pkg!.country} • {pkg!.duration} • ৳{pkg!.price.toLocaleString("en-US")}
      </p>

      <Image
        src={pkg!.image}
        alt={pkg!.name}
        width={1200}
        height={675}
        className="rounded-xl mb-6"
      />

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p>{pkg!.description}</p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Included</h3>
          <ul className="list-disc pl-5 space-y-1">
            {pkg!.includes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Highlights</h3>
          <ul className="list-disc pl-5 space-y-1">
            {pkg!.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {pkg!.visa_required && pkg!.visa_info && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-2">
            Visa requirements for {pkg!.country}
          </h3>
          <p>
            {pkg!.visa_info.type} • {pkg!.visa_info.duration} • Processing:{" "}
            {pkg!.visa_info.processing_time}
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {pkg!.visa_info.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex gap-3 mt-8">
        <Link
          href={`https://wa.me/8801708070250?text=${encodeURIComponent(
            `Hi! I'm interested in ${pkg!.name} (${pkg!.duration}) priced at ৳${pkg!.price}.`
          )}`}
          className="px-4 py-2 rounded bg-emerald-600 text-white"
        >
          Book via WhatsApp
        </Link>
        <Link href="/" className="px-4 py-2 rounded border">
          Back to Home
        </Link>
      </div>
    </main>
  );
}


export const dynamic = "force-static";
