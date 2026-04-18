"use client";
// Parent can add/remove sites from the approved list.

import { useState } from "react";

export default function ApprovedSitesList({ sites, onSitesChange }) {
  // Controlled input for the new site form
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl]   = useState("");
  const [newEmoji, setNewEmoji] = useState("🌐");
  const [newCategory, setNewCategory] = useState("learning");
  const [error, setError] = useState("");

  function handleAdd(e) {
    e.preventDefault(); // prevent page reload
    setError("");

    // Basic URL validation
    if (!newName.trim()) { setError("Please enter a site name."); return; }
    if (!newUrl.trim())  { setError("Please enter a URL."); return; }

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith("http")) formattedUrl = `https://${formattedUrl}`;

    try { new URL(formattedUrl); } // throws if invalid
    catch { setError("Please enter a valid URL (e.g. https://example.com)"); return; }

    const newSite = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      url: formattedUrl,
      emoji: newEmoji,
      category: newCategory,
    };

    // Spread operator — add to array without mutating state
    onSitesChange([...sites, newSite]);

    // Reset controlled inputs
    setNewName("");
    setNewUrl("");
    setNewEmoji("🌐");
    setNewCategory("learning");
  }

  function handleRemove(id) {
    // array.filter() to remove the item
    onSitesChange(sites.filter((s) => s.id !== id));
  }

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        ✅ Approved Sites ({sites.length})
      </h2>

      {/* Add new site form */}
      <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-4 mb-4 flex flex-col gap-3">
        <p className="text-sm text-gray-500 font-medium">Add a new site</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            placeholder="🌐"
            className="border border-gray-300 rounded-lg px-3 py-2 text-center text-xl"
            maxLength={2}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="animals">Animals</option>
            <option value="games">Games</option>
            <option value="learning">Learning</option>
            <option value="videos">Videos</option>
          </select>
        </div>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Site name (e.g. Starfall)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="URL (e.g. https://starfall.com)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          type="url"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          className="bg-sky-500 text-white font-semibold py-2 rounded-lg text-sm hover:bg-sky-600 transition-colors"
        >
          + Add Site
        </button>
      </form>

      {/* Existing sites list — array.map() */}
      <ul className="flex flex-col gap-2">
        {sites.map((site) => (
          <li
            key={site.id}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
          >
            <span className="text-2xl">{site.emoji || "🌐"}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-800 truncate">{site.name}</p>
              <p className="text-xs text-gray-400 truncate">{site.url}</p>
            </div>
            <button
              onClick={() => handleRemove(site.id)}
              className="text-red-400 hover:text-red-600 text-sm font-medium shrink-0"
              aria-label={`Remove ${site.name}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
