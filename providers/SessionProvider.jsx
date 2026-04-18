"use client";
// Manages the countdown timer state and makes it available to all
// child-facing pages via React Context.
// createContext / useContext for sharing state without prop-drilling.

import { createContext, useContext, useState, useEffect } from "react";
import {
  getSettings,
  getTimeUsedTodaySeconds,
  saveTimeUsedTodaySeconds,
} from "@/lib/storage";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  // timeRemaining: seconds left in today's session (null = not yet loaded)
  const [timeRemaining, setTimeRemaining] = useState(null);
  // warningLevel: 0 = normal, 1 = 5-min warning, 2 = 2-min warning, 3 = 1-min warning
  const [warningLevel, setWarningLevel] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Load time remaining from localStorage on first mount
  useEffect(() => {
    const settings = getSettings();
    const limitSeconds = settings.dailyLimitMinutes * 60;
    const usedSeconds = getTimeUsedTodaySeconds();
    const remaining = Math.max(0, limitSeconds - usedSeconds);
    setTimeRemaining(remaining);
    if (remaining === 0) setSessionEnded(true);
  }, []);

  // Countdown interval — only starts once timeRemaining is loaded
  useEffect(() => {
    if (timeRemaining === null || sessionEnded) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;

        // Persist to localStorage every 15 seconds to avoid too many writes
        if (next % 15 === 0) {
          const settings = getSettings();
          const limitSeconds = settings.dailyLimitMinutes * 60;
          saveTimeUsedTodaySeconds(limitSeconds - next);
        }

        // Update warning level based on time remaining
        if (next <= 60) setWarningLevel(3);
        else if (next <= 120) setWarningLevel(2);
        else if (next <= 300) setWarningLevel(1);
        else setWarningLevel(0);

        if (next <= 0) {
          // Save full session used
          const settings = getSettings();
          saveTimeUsedTodaySeconds(settings.dailyLimitMinutes * 60);
          setSessionEnded(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    // Cleanup: clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timeRemaining, sessionEnded]);

  return (
    <SessionContext.Provider
      value={{ timeRemaining, warningLevel, sessionEnded }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook so any child component can access session state
export function useSession() {
  return useContext(SessionContext);
}
