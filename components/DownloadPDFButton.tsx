'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function DownloadPDFButton({ fileName }: { fileName: string }) {
  const [isClient, setIsClient] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    if (!isClient || isGenerating) return;
    
    setIsGenerating(true);

    try {
      const itineraryElement = document.getElementById("itinerary-content");
      if (!itineraryElement) {
        console.error("Itinerary element not found");
        setIsGenerating(false);
        return;
      }

      const canvas = await html2canvas(itineraryElement, {
        allowTaint: true,
        useCORS: true,
        scale: 2, 
        logging: false,
        backgroundColor: '#f9fafb', 
        ignoreElements: (element) => {
          return element.classList.contains('fixed') || 
                 element.id === 'navbar-exclude';
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("itinerary-content");
          if (clonedElement) {
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              const element = el as HTMLElement;
              
              element.style.color = element.style.color || 'rgb(0, 0, 0)';
              element.style.backgroundColor = element.style.backgroundColor || 'transparent';
              element.style.borderColor = element.style.borderColor || 'transparent';
              
              try {
                const computed = window.getComputedStyle(element);
                const props = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 
                               'borderRightColor', 'borderBottomColor', 'borderLeftColor'];
                
                props.forEach(prop => {
                  const value = computed.getPropertyValue(prop);
                  if (value && value.includes('lab')) {
                    if (value.includes('teal')) {
                      element.style.setProperty(prop, 'rgb(20, 184, 166)');
                    } else if (value.includes('emerald')) {
                      element.style.setProperty(prop, 'rgb(5, 150, 105)');
                    } else if (value.includes('gray')) {
                      element.style.setProperty(prop, 'rgb(107, 114, 128)');
                    } else {
                      element.style.setProperty(prop, 'rgb(0, 0, 0)');
                    }
                  }
                });
              } catch (e) {
                // Silently handle errors
              }
            });
          }
        }
      }).catch(err => {
        console.error('html2canvas error:', err);
        throw new Error('Failed to capture page content');
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const safeName = fileName.toLowerCase().replace(/\s+/g, "-");
      pdf.save(`${safeName}-itinerary.pdf`);
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