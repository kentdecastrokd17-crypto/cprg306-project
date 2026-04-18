"use client";
// Toggle switches for blocking content categories.

const CATEGORIES = [
  {
    id: "adult",
    label: "Adult Content",
    description: "Blocks explicit or adult-only websites",
    emoji: "🔞",
  },
  {
    id: "violence",
    label: "Violence",
    description: "Blocks sites with graphic violent content",
    emoji: "⚠️",
  },
  {
    id: "gambling",
    label: "Gambling",
    description: "Blocks online gambling and betting sites",
    emoji: "🎰",
  },
  {
    id: "socialMedia",
    label: "Social Media",
    description: "Blocks social networks (Facebook, TikTok, etc.)",
    emoji: "📱",
  },
];

export default function CategoryBlockToggles({ blockedCategories, onChange }) {
  function handleToggle(categoryId) {
    // Object spread — immutable update of blockedCategories
    const updated = {
      ...blockedCategories,
      [categoryId]: !blockedCategories[categoryId],
    };
    onChange(updated);
  }

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-1">
        🚫 Blocked Categories
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        Blocked categories are checked on every site visit in addition to the
        Google Safe Browsing scan.
      </p>

      <ul className="flex flex-col gap-2">
        {/* array.map() renders a toggle row per category */}
        {CATEGORIES.map((cat) => {
          const isBlocked = blockedCategories[cat.id] ?? false;

          return (
            <li
              key={cat.id}
              className="flex items-center gap-3 bg-white border border-gray-200
                rounded-xl px-4 py-3"
            >
              <span className="text-2xl">{cat.emoji}</span>

              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">{cat.label}</p>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </div>

              {/* Toggle switch — controlled component */}
              <button
                role="switch"
                aria-checked={isBlocked}
                onClick={() => handleToggle(cat.id)} // event handler
                className={`relative w-12 h-6 rounded-full transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-sky-400
                  ${isBlocked ? "bg-red-400" : "bg-gray-300"}`}
                aria-label={`${isBlocked ? "Unblock" : "Block"} ${cat.label}`}
              >
                {/* Sliding knob */}
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                    shadow transition-transform duration-200
                    ${isBlocked ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>

              {/* Status label — conditional rendering */}
              <span
                className={`text-xs font-semibold w-14 text-right
                  ${isBlocked ? "text-red-500" : "text-gray-400"}`}
              >
                {isBlocked ? "Blocked" : "Allowed"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
