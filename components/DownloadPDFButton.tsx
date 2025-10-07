'use client';

import { useEffect, useState } from 'react';
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
        return;
      }

     
     // Generate canvas with error handling for unsupported CSS
      const canvas = await html2canvas(itineraryElement, {
        allowTaint: true,
        useCORS: true,
        scale: 2, 
        logging: false,
        backgroundColor: '#f9fafb', 
        ignoreElements: (element) => {
          // Ignore fixed elements
          return element.classList.contains('fixed') || 
                 element.id === 'navbar-exclude';
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("itinerary-content");
          if (clonedElement) {
            // Force all elements to use standard RGB colors
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              const element = el as HTMLElement;
              
              // Override all color properties with inline styles
              element.style.color = element.style.color || 'rgb(0, 0, 0)';
              element.style.backgroundColor = element.style.backgroundColor || 'transparent';
              element.style.borderColor = element.style.borderColor || 'transparent';
              
              // Remove any computed styles that might use lab()
              try {
                const computed = window.getComputedStyle(element);
                const props = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 
                               'borderRightColor', 'borderBottomColor', 'borderLeftColor'];
                
                props.forEach(prop => {
                  const value = computed.getPropertyValue(prop);
                  if (value && value.includes('lab')) {
                    // Map common Tailwind colors to RGB equivalents
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

      // Handle multi-page PDFs if content is too long
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

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`px-4 py-2 rounded-lg transition ${
        isGenerating 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700'
      } text-white`}
    >
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </button>
  );
}
