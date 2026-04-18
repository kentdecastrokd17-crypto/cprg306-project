"use client";
// PIN entry gate for the parent settings panel.
// Handles both SET PIN (first launch) and VERIFY PIN flows.

import { useState } from "react";
import { hashPIN, verifyPIN } from "@/lib/crypto";
import { getSettings, saveSettings } from "@/lib/storage";

export default function PINForm({ onVerified }) {
  const settings = getSettings();
  const isFirstLaunch = !settings.pinHash; // no hash stored yet = first launch

  // Controlled input state
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState(""); // only used during SET flow
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission — event.preventDefault()
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isFirstLaunch) {
        // SET PIN flow — validate and hash a new PIN
        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          setError("PIN must be exactly 4 digits.");
          return;
        }
        if (pin !== confirmPin) {
          setError("PINs do not match. Please try again.");
          return;
        }
        // Hash with SHA-256 via Web Crypto API (lib/crypto.js)
        const hash = await hashPIN(pin);
        // Save hash to settings in localStorage (never the raw PIN)
        const updated = { ...settings, pinHash: hash };
        saveSettings(updated);
        onVerified(); // notify parent component
      } else {
        // VERIFY PIN flow — compare entered PIN against stored hash
        const matched = await verifyPIN(pin, settings.pinHash);
        if (!matched) {
          setError("Incorrect PIN. Please try again.");
          setPin("");
          return;
        }
        onVerified();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        {/* Icon + heading */}
        <div className="text-center mb-6">
          <span className="text-5xl">🔒</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">
            {isFirstLaunch ? "Set a Parent PIN" : "Parent Access"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isFirstLaunch
              ? "Create a 4-digit PIN to protect settings."
              : "Enter your 4-digit PIN to continue."}
          </p>
        </div>

        {/* Form — controlled inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isFirstLaunch ? "New PIN" : "PIN"}
            </label>
            {/* Controlled input — value bound to useState */}
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3
                text-center text-2xl tracking-widest focus:outline-none
                focus:ring-2 focus:ring-sky-400"
              autoComplete="off"
            />
          </div>

          {/* Conditional — confirm field only shown during SET flow */}
          {isFirstLaunch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, ""))
                }
                placeholder="••••"
                className="w-full border border-gray-300 rounded-xl px-4 py-3
                  text-center text-2xl tracking-widest focus:outline-none
                  focus:ring-2 focus:ring-sky-400"
                autoComplete="off"
              />
            </div>
          )}

          {/* Error message — conditional rendering */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300
              text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? "Checking..." : isFirstLaunch ? "Set PIN" : "Enter"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          PIN is hashed with SHA-256 before storage — never stored as plain text.
        </p>
      </div>
    </div>
  );
}
