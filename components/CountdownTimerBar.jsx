"use client";
// Always-visible progress bar at the top of every child page.

export default function CountdownTimerBar({ timeRemaining, warningLevel }) {
  if (timeRemaining === null) return null;

  const totalMinutes =
    typeof window !== "undefined"
      ? (() => {
          try {
            const s = JSON.parse(
              localStorage.getItem("kidbrowse_settings") || "{}"
            );
            return s.dailyLimitMinutes || 60;
          } catch {
            return 60;
          }
        })()
      : 60;

  const totalSeconds = totalMinutes * 60;
  const percentage = Math.max(0, Math.min(100, (timeRemaining / totalSeconds) * 100));

  // Format mm:ss for display
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const display = `${mins}:${secs.toString().padStart(2, "0")}`;

  // Conditional Tailwind classes based on warningLevel
  const barColour =
    warningLevel === 3
      ? "bg-red-500"
      : warningLevel === 2
      ? "bg-orange-400"
      : warningLevel === 1
      ? "bg-amber-400"
      : "bg-green-400";

  const pulseClass = warningLevel >= 2 ? "animate-pulse" : "";

  return (
    <div className="w-full bg-white border-b border-sky-100 px-4 py-2">
      <div className="flex items-center gap-3 max-w-2xl mx-auto">
        <span className="text-xs text-gray-500 shrink-0">⏱ Time left</span>
        {/* Progress bar track */}
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Fill — width driven by percentage */}
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColour} ${pulseClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span
          className={`text-sm font-semibold shrink-0 tabular-nums ${
            warningLevel >= 2 ? "text-red-600" : "text-gray-700"
          }`}
        >
          {display}
        </span>
      </div>

      {/* 1-minute warning overlay message */}
      {warningLevel === 3 && (
        <p className="text-center text-xs text-red-600 font-medium mt-1 animate-bounce">
          ⚠️ Less than 1 minute left!
        </p>
      )}
    </div>
  );
}
