"use client";
// Top bar shown on every child-facing page.
// Reads timer state from SessionContext and renders CountdownTimerBar.

import { useSession } from "@/providers/SessionProvider";
import CountdownTimerBar from "./CountdownTimerBar";

export default function AppHeader() {
  const { timeRemaining, warningLevel } = useSession();

  return (
    <header>
      {/* Brand bar */}
      <div className="bg-sky-500 text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌈</span>
          <span className="text-xl font-bold tracking-tight">KidBrowse</span>
        </div>
        <span className="text-sm text-sky-100">Safe browsing for kids</span>
      </div>

      {/* Countdown bar — always visible, receives props from context */}
      <CountdownTimerBar
        timeRemaining={timeRemaining}
        warningLevel={warningLevel}
      />
    </header>
  );
}
