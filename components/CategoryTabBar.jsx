"use client";
// Renders category filter tabs for the child home screen.

const CATEGORIES = [
  { id: "all",      label: "All",      emoji: "🏠" },
  { id: "animals",  label: "Animals",  emoji: "🦁" },
  { id: "games",    label: "Games",    emoji: "🎮" },
  { id: "learning", label: "Learning", emoji: "📚" },
  { id: "videos",   label: "Videos",   emoji: "📺" },
];

export default function CategoryTabBar({ activeCategory, setActiveCategory }) {
  return (
    <nav className="bg-white border-b border-sky-100 px-2 overflow-x-auto">
      <div className="flex gap-1 py-2 min-w-max mx-auto">
        {/* array.map() renders a tab button for each category */}
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)} // event handler
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
              transition-colors whitespace-nowrap
              ${
                activeCategory === cat.id
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-sky-50 text-gray-600 hover:bg-sky-100"
              }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
