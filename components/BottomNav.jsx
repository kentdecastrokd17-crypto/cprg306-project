"use client";
// Bottom navigation bar for child-facing pages.

import Link from "next/link";

const NAV_ITEMS = [
  { href: "/",        label: "Home",    emoji: "🏠" },
  { href: "/history", label: "History", emoji: "🕒" },
];

export default function BottomNav({ active }) {
  return (
    <nav className="bg-white border-t border-sky-100 shadow-sm">
      <div className="flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium
              transition-colors
              ${
                active === item.label.toLowerCase()
                  ? "text-sky-600 border-t-2 border-sky-500"
                  : "text-gray-500 hover:text-sky-500"
              }`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
