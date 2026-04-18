// All localStorage read/write operations for KidBrowse
// localStorage is only available in the browser, so every function
// guards against server-side rendering with a typeof window check.

import defaultSites from "./defaultSites";

const KEYS = {
  SETTINGS: "kidbrowse_settings",
  HISTORY: "kidbrowse_history",
  TIME_USED: "kidbrowse_time_used",
  SESSION_DATE: "kidbrowse_session_date",
};

// ── Default settings applied on first launch ────────────────
const DEFAULT_SETTINGS = {
  approvedSites: defaultSites,
  blockedCategories: {
    adult: true,
    violence: true,
    gambling: true,
    socialMedia: false,
  },
  dailyLimitMinutes: 60,
  pinHash: null, // null = PIN not yet set
};

// ── Settings ────────────────────────────────────────────────

export function getSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    // Merge saved settings with defaults so new keys always exist
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// ── History ──────────────────────────────────────────────────
// Each record: { id, url, title, thumbnail, timestamp }

export function getHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryRecord(record) {
  if (typeof window === "undefined") return;
  const existing = getHistory();
  // Spread operator — immutable prepend (Week 7: immutability)
  const updated = [{ ...record, id: Date.now() }, ...existing].slice(0, 200);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
}

export function getHistoryToday() {
  const today = getTodayString();
  return getHistory().filter(
    (r) => r.timestamp && r.timestamp.startsWith(today)
  );
}

// ── Screen-time tracking ─────────────────────────────────────

export function getTodayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function getTimeUsedTodaySeconds() {
  if (typeof window === "undefined") return 0;
  const savedDate = localStorage.getItem(KEYS.SESSION_DATE);
  const today = getTodayString();
  // Reset if a new day has started
  if (savedDate !== today) {
    localStorage.setItem(KEYS.SESSION_DATE, today);
    localStorage.setItem(KEYS.TIME_USED, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(KEYS.TIME_USED) || "0", 10);
}

export function saveTimeUsedTodaySeconds(seconds) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.TIME_USED, String(seconds));
  localStorage.setItem(KEYS.SESSION_DATE, getTodayString());
}
