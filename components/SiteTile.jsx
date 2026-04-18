"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { addHistoryRecord } from "@/lib/storage";

export default function SiteTile({ site }) {
  const [checking, setChecking] = useState(false); // loading state
  const router = useRouter();

  async function handleTap() {
    if (checking) return;
    setChecking(true);

    try {
      // Fetch the Next.js API route proxy
      const res = await fetch("/api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site.url }),
      });

      if (!res.ok) throw new Error("Check failed");

      const data = await res.json();

      if (data.safe) {
        // Record the visit in localStorage before opening
        addHistoryRecord({
          url: site.url,
          title: site.name,
          thumbnail: site.thumbnail || null,
          emoji: site.emoji,
          timestamp: new Date().toISOString(),
        });
        // PRIMARY: open in new tab — avoids X-Frame-Options / CSP blocking
        window.open(site.url, "_blank", "noopener,noreferrer");
      } else {
        // Navigate to the block screen with reason as a query param
        router.push(
          `/block?reason=${encodeURIComponent(data.reason || "Safety check failed")}&site=${encodeURIComponent(site.name)}`
        );
      }
    } catch (err) {
      // User-facing error: show block screen with a generic message
      console.error("Safety check error:", err);
      router.push(
        `/block?reason=${encodeURIComponent("Could not verify this site. Please try again.")}&site=${encodeURIComponent(site.name)}`
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <button
      onClick={handleTap}
      disabled={checking}
      className={`flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm
        border-2 border-transparent hover:border-sky-300 hover:shadow-md
        active:scale-95 transition-all duration-150 w-full
        ${checking ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
      aria-label={`Open ${site.name}`}
    >
      {/* Site icon — emoji or thumbnail */}
      <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-sky-50 text-4xl">
        {site.thumbnail ? (
          <img
            src={site.thumbnail}
            alt={site.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span role="img" aria-label={site.name}>
            {site.emoji || "🌐"}
          </span>
        )}
      </div>

      {/* Site name */}
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-2">
        {site.name}
      </span>

      {/* Loading indicator — conditional rendering */}
      {checking && (
        <span className="text-xs text-sky-500 animate-pulse">Checking...</span>
      )}
    </button>
  );
}
