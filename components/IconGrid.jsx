"use client";
// Renders the responsive grid of SiteTile components.

import SiteTile from "./SiteTile";

export default function IconGrid({ sites }) {
  // Conditional rendering — show empty state if no sites match the filter
  if (!sites || sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-6xl mb-4">🔍</span>
        <p className="text-lg font-medium">No sites here yet</p>
        <p className="text-sm mt-1">Ask a grown-up to add some!</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4"
      // Responsive grid: 3 cols on mobile, 4 on tablet, 5 on desktop
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
    >
      {/* array.map() — render a SiteTile for each approved site */}
      {sites.map((site) => (
        <SiteTile key={site.id} site={site} />
      ))}
    </div>
  );
}
