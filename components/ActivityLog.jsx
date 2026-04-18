"use client";
// Displays today's browsing activity for the parent to review.

import { useState, useEffect } from "react";
import { getHistoryToday } from "@/lib/storage";

export default function ActivityLog() {
  const [records, setRecords] = useState([]);

  // Load today's history from localStorage on mount
  useEffect(() => {
    const today = getHistoryToday();
    // Most recent first — the history is already prepended so just set it
    setRecords(today);
  }, []);

  // Template literal to format a timestamp
  function formatTime(isoString) {
    const d = new Date(isoString);
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }

  // Separate visited vs blocked — array.filter()
  const visited = records.filter((r) => !r.blocked);
  const blocked = records.filter((r) => r.blocked);

  if (records.length === 0) {
    return (
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-2">
          📋 Today&apos;s Activity
        </h2>
        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400">
          <p className="text-sm">No activity recorded today.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-1">
        📋 Today&apos;s Activity
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        {visited.length} visited · {blocked.length} blocked
      </p>

      {/* All records list — array.map() */}
      <ul className="flex flex-col gap-2">
        {records.map((record) => (
          <li
            key={record.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 border
              ${
                record.blocked
                  ? "bg-red-50 border-dashed border-red-200"
                  : "bg-white border-gray-200"
              }`}
          >
            {/* Emoji or thumbnail */}
            <span className="text-xl shrink-0">
              {record.emoji || "🌐"}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {record.title || record.url}
              </p>
              {/* Template literal for time */}
              <p className="text-xs text-gray-400">
                {`${formatTime(record.timestamp)}`}
              </p>
            </div>

            {/* Status badge — conditional rendering */}
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0
                ${
                  record.blocked
                    ? "bg-red-100 text-red-600 border border-dashed border-red-300"
                    : "bg-green-100 text-green-700"
                }`}
            >
              {record.blocked ? "Blocked" : "Visited"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
