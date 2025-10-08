'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from "jspdf";

// TypeScript interfaces for the package data
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

interface DownloadPDFButtonProps {
  fileName: string;
  pkg?: Package;
}

export default function DownloadPDFButton({ fileName, pkg }: DownloadPDFButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateProfessionalPDF = () => {
    if (!pkg) {
      console.error("Package data not available");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with website branding
    pdf.setFillColor(20, 184, 166); // Teal color
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(26);
    pdf.setFont("helvetica", "bold");
    pdf.text("choloJai.", 15, 20);
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Your Travel Companion", pageWidth - 15, 20, { align: 'right' });
    
    yPosition = 45;

    // Trip Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    const title = pdf.splitTextToSize(pkg.name, pageWidth - 30);
    pdf.text(title, 15, yPosition);
    yPosition += title.length * 10 + 8;

    // Trip Basic Info
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    const basicInfo = `${pkg.country} | ${pkg.duration} | BDT ${pkg.price.toLocaleString()}`;
    pdf.text(basicInfo, 15, yPosition);
    yPosition += 10;

    if (pkg.trip_dates) {
      pdf.setFontSize(12);
      pdf.text(`${pkg.trip_dates.start} to ${pkg.trip_dates.end}`, 15, yPosition);
      yPosition += 8;
    }

    // Budget level
    pdf.setFillColor(20, 184, 166);
    pdf.roundedRect(15, yPosition, 35, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${pkg.budget.toUpperCase()} BUDGET`, 17, yPosition + 5.5);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    yPosition += 18;

    // Add a separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 10;

    // Description
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("TRIP OVERVIEW", 15, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    const descriptionLines = pdf.splitTextToSize(pkg.description, pageWidth - 30);
    pdf.text(descriptionLines, 15, yPosition);
    yPosition += descriptionLines.length * 6 + 12;

    // Trip Details
    const details = [
      `Start Location: Dhaka (default)`,
      `Destination: ${pkg.destination.toUpperCase()}`,
      `Price: BDT ${pkg.price.toLocaleString()}`,
      `Duration: ${pkg.duration}`
    ];

    details.forEach(detail => {
      pdf.text(`- ${detail}`, 15, yPosition);
      yPosition += 6;
    });
    yPosition += 5;

    // Package Inclusions
    if (pkg.includes && pkg.includes.length > 0) {
      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("WHAT'S INCLUDED", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pkg.includes.forEach(item => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`+ ${item}`, 15, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Highlights
    if (pkg.highlights && pkg.highlights.length > 0) {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("HIGHLIGHTS", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pkg.highlights.forEach(highlight => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`* ${highlight}`, 15, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Visa Information
    if (pkg.visa_required && pkg.visa_info) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("VISA INFORMATION", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Type: ${pkg.visa_info.type}`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Duration: ${pkg.visa_info.duration}`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Processing Time: ${pkg.visa_info.processing_time}`, 15, yPosition);
      yPosition += 8;

      pdf.setFont("helvetica", "bold");
      pdf.text("Requirements:", 15, yPosition);
      yPosition += 6;
      pdf.setFont("helvetica", "normal");

      pkg.visa_info.requirements.forEach(req => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`- ${req}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    // Daily Schedule
    if (pkg.daily_schedule && pkg.daily_schedule.length > 0) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("DAILY SCHEDULE", 15, yPosition);
      yPosition += 12;

      pkg.daily_schedule.forEach((day, dayIdx) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        // Day header
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${dayIdx + 1} - ${day.day}`, 15, yPosition);
        yPosition += 8;

        // Activities
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        day.activities.forEach(activity => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFont("helvetica", "bold");
          pdf.text(`${activity.time}`, 20, yPosition);
          pdf.setFont("helvetica", "normal");
          pdf.text(`- ${activity.activity}`, 40, yPosition);
          yPosition += 5;
          
          if (activity.location) {
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Location: ${activity.location}`, 25, yPosition);
            pdf.setTextColor(0, 0, 0);
            yPosition += 4;
          }
          
          if (activity.transport) {
            pdf.text(`Transport: ${activity.transport}`, 25, yPosition);
            yPosition += 4;
          }
          
          if (activity.accommodation) {
            pdf.text(`Accommodation: ${activity.accommodation}`, 25, yPosition);
            yPosition += 4;
          }
          
          yPosition += 2;
        });
        yPosition += 5;
      });
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Generated by choloJai", 15, footerY);

    // Save the PDF
    const safeName = fileName.toLowerCase().replace(/\s+/g, "-");
    pdf.save(`${safeName}-itinerary.pdf`);
  };

  const handleDownload = async () => {
    if (!isClient || isGenerating) return;
    
    setIsGenerating(true);

    try {
      generateProfessionalPDF();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return (
      <button
        disabled
        className="px-6 py-3 rounded-lg transition w-full sm:w-auto bg-gray-400 cursor-not-allowed text-white flex items-center justify-center gap-2"
      >
        <Download size={18} />
        <span>Download PDF</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`px-6 py-3 rounded-lg transition w-full sm:w-auto flex items-center justify-center gap-2 ${
        isGenerating 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700'
      } text-white`}
    >
      <Download size={18} />
      <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
    </button>
  );
}