"use client";
// Shown automatically when the daily time limit reaches zero.

import Link from "next/link";

export default function GoodbyePage() {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-8 text-center gap-6">
      <span className="text-9xl">🌙</span>
      <h1 className="text-4xl font-bold text-sky-700">All done for today!</h1>
      <p className="text-xl text-gray-600 max-w-sm">
        You&apos;ve used up all your browsing time for today. Come back tomorrow!
      </p>
      <p className="text-gray-400 text-sm">
        If you need more time, ask a grown-up to change the settings.
      </p>
      {/* Parent link — small and discreet */}
      <Link
        href="/parent"
        className="mt-8 text-xs text-gray-400 hover:text-gray-600 underline"
      >
        Parent / Guardian access
      </Link>
    </div>
  );
}
