"use client";
// The full parent settings panel, rendered after PIN is verified.
// Manages all settings state here and writes to localStorage on every change.

import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "@/lib/storage";
import ApprovedSitesList from "./ApprovedSitesList";
import CategoryBlockToggles from "./CategoryBlockToggles";
import TimeLimitPicker from "./TimeLimitPicker";
import ActivityLog from "./ActivityLog";
import Link from "next/link";

export default function SettingsLayout() {
  // Load all settings into state on mount
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  // Generic updater — merges a partial settings object and persists to localStorage
  function updateSettings(partial) {
    setSettings((prev) => {
      // Spread operator — immutable update
      const updated = { ...prev, ...partial };
      saveSettings(updated);
      return updated;
    });
    // Flash "Saved" confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  // Show loading state before settings are read from localStorage
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <h1 className="text-lg font-bold text-gray-800">Parent Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Saved confirmation — conditional rendering */}
          {saved && (
            <span className="text-green-600 text-sm font-medium animate-pulse">
              ✓ Saved
            </span>
          )}
          <Link
            href="/"
            className="text-sm text-sky-600 font-medium hover:underline"
          >
            ← Back to KidBrowse
          </Link>
        </div>
      </header>

      {/* Settings sections */}
      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-8">

        {/* Section 1: Approved Sites */}
        <div className="bg-gray-50 rounded-2xl p-1">
          <ApprovedSitesList
            sites={settings.approvedSites}
            onSitesChange={(newSites) =>
              updateSettings({ approvedSites: newSites })
            }
          />
        </div>

        <hr className="border-gray-200" />

        {/* Section 2: Category Blocklist */}
        <CategoryBlockToggles
          blockedCategories={settings.blockedCategories}
          onChange={(newCategories) =>
            updateSettings({ blockedCategories: newCategories })
          }
        />

        <hr className="border-gray-200" />

        {/* Section 3: Time Limit */}
        <TimeLimitPicker
          dailyLimitMinutes={settings.dailyLimitMinutes}
          onChange={(minutes) =>
            updateSettings({ dailyLimitMinutes: minutes })
          }
        />

        <hr className="border-gray-200" />

        {/* Section 4: Activity Log */}
        <ActivityLog />

        {/* Reset PIN option */}
        <div className="text-center pb-8">
          <button
            onClick={() => {
              if (confirm("Reset parent PIN? You will need to set a new one.")) {
                updateSettings({ pinHash: null });
                window.location.reload();
              }
            }}
            className="text-xs text-gray-400 hover:text-red-500 underline"
          >
            Reset parent PIN
          </button>
        </div>
      </main>
    </div>
  );
}
