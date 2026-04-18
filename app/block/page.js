"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function BlockPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "This page isn't for kids yet.";
  const siteName = searchParams.get("site") || "That site";

  // useState flag to show the Ask Mum/Dad prompt
  const [showAskPrompt, setShowAskPrompt] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
        {/* Mascot */}
        <div className="text-9xl animate-bounce-slow select-none">🐻</div>

        {/* Block message — child-friendly, no technical detail */}
        <div className="bg-white rounded-3xl shadow-md p-8 max-w-md w-full border-2 border-orange-200">
          <h1 className="text-3xl font-bold text-orange-500 mb-3">
            Oops! 🙈
          </h1>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            {siteName} isn&apos;t for kids yet.
          </p>
          <p className="text-gray-500 text-base">
            Ask a grown-up if you really need it — they can unlock it for you!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Go Back Home */}
          <Link
            href="/"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8
              rounded-2xl text-lg text-center transition-colors shadow-sm active:scale-95"
          >
            🏠 Go Back Home
          </Link>

          {/* Ask Mum/Dad button — toggles prompt via useState */}
          <button
            onClick={() => setShowAskPrompt(true)}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-4 px-8
              rounded-2xl text-lg transition-colors shadow-sm active:scale-95"
          >
            📬 Ask Mum / Dad
          </button>
        </div>

        {/* Conditional rendering — Ask prompt appears on button tap */}
        {showAskPrompt && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 max-w-md w-full mt-2">
            <p className="text-amber-800 font-semibold text-base text-center">
              💬 Go find a grown-up and show them this screen.
              <br />
              They can open the parent panel to unlock sites!
            </p>
            <button
              onClick={() => setShowAskPrompt(false)}
              className="mt-4 w-full text-sm text-amber-600 hover:text-amber-800 underline"
            >
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
