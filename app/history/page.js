"use client";
// app/history/page.js — Child visual browsing history
// Shows thumbnail grid of previously visited sites.

import { useState, useEffect } from "react";
import { getHistory } from "@/lib/storage";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

const FILTERS = ["Today", "This Week"];

function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Today"); // useState

  // Load history from localStorage on mount
  useEffect(() => {
    const history = getHistory();
    // Only show successfully visited sites (not blocked attempts)
    const visited = history.filter((r) => !r.blocked); // array.filter()
    setRecords(visited);
  }, []);

  // Filter records by time period — array.filter()
  const filteredRecords = records.filter((r) => {
    const ts = new Date(r.timestamp);
    if (activeFilter === "Today") {
      const today = new Date().toISOString().slice(0, 10);
      return r.timestamp.startsWith(today);
    }
    if (activeFilter === "This Week") {
      return ts >= getWeekStart();
    }
    return true;
  });

  // Format timestamp — template literals
  function formatTime(isoString) {
    const d = new Date(isoString);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  async function handleTileClick(record) {
    // Re-run safety check before reopening from history
    try {
      const res = await fetch("/api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: record.url }),
      });
      const data = await res.json();
      if (data.safe) {
        window.open(record.url, "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(record.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <AppHeader />

      {/* Page heading + filter tabs */}
      <div className="bg-white border-b border-sky-100 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-700 mb-2">🕒 Places I visited</h1>
        <div className="flex gap-2">
          {/* array.map() renders filter tabs */}
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)} // event handler
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  activeFilter === f
                    ? "bg-sky-500 text-white"
                    : "bg-sky-50 text-gray-600 hover:bg-sky-100"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {/* Conditional rendering — empty state */}
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-6xl mb-4">📭</span>
            <p className="text-lg font-medium">No visits yet</p>
            <p className="text-sm">Sites you open will appear here!</p>
          </div>
        ) : (
          /* Thumbnail grid — array.map() */
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
          >
            {filteredRecords.map((record) => (
              <button
                key={record.id}
                onClick={() => handleTileClick(record)}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl
                  shadow-sm hover:shadow-md border-2 border-transparent
                  hover:border-sky-300 active:scale-95 transition-all"
              >
                {/* Thumbnail or emoji */}
                <div className="w-16 h-16 rounded-xl bg-sky-50 flex items-center justify-center overflow-hidden text-4xl">
                  {record.thumbnail ? (
                    <img
                      src={record.thumbnail}
                      alt={record.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{record.emoji || "🌐"}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2 leading-tight">
                  {record.title}
                </span>
                {/* Template literal for time display */}
                <span className="text-xs text-gray-400">{`${formatTime(record.timestamp)}`}</span>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="history" />
    </div>
  );
}
