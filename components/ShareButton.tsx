"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title, text, url }: { title: string; text: string; url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        console.log("Itinerary shared successfully!");
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all w-full sm:w-auto text-center inline-flex items-center justify-center gap-2"
    >
      <Share2 size={18} /> <span>Share</span>
    </button>
  );
}