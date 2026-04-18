"use client";
// Preset daily time limit selector for the parent settings panel.

const PRESETS = [
  { value: 30,  label: "30 minutes" },
  { value: 60,  label: "1 hour" },
  { value: 90,  label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export default function TimeLimitPicker({ dailyLimitMinutes, onChange }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-1">
        ⏱ Daily Time Limit
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        The browser will count down from this limit and stop automatically when
        time runs out.
      </p>

      {/* Preset buttons — array.map() */}
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => {
          const isSelected = dailyLimitMinutes === preset.value;

          return (
            <button
              key={preset.value}
              onClick={() => onChange(preset.value)} // event handler
              // Conditional Tailwind class based on selection
              className={`py-3 rounded-xl text-sm font-semibold border-2 transition-colors
                ${
                  isSelected
                    ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-sky-300"
                }`}
            >
              {preset.label}
              {/* Checkmark on the selected option — conditional rendering */}
              {isSelected && <span className="ml-1">✓</span>}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Currently set to{" "}
        <span className="font-semibold text-sky-600">
          {PRESETS.find((p) => p.value === dailyLimitMinutes)?.label ??
            `${dailyLimitMinutes} minutes`}
        </span>{" "}
        per day.
      </p>
    </section>
  );
}
