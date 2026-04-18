"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSettings } from "@/lib/storage";
import { useSession } from "@/providers/SessionProvider";
import AppHeader from "@/components/AppHeader";
import CategoryTabBar from "@/components/CategoryTabBar";
import IconGrid from "@/components/IconGrid";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sites, setSites] = useState([]);
  const { sessionEnded, warningLevel } = useSession();
  const router = useRouter();

  // Load approved sites from localStorage on mount
  useEffect(() => {
    const settings = getSettings();
    setSites(settings.approvedSites);
  }, []);

  // Redirect to goodbye screen when session time runs out
  useEffect(() => {
    if (sessionEnded) {
      router.push("/goodbye");
    }
  }, [sessionEnded, router]);

  // Filter sites by active category — array.filter()
  const filteredSites =
    activeCategory === "all"
      ? sites
      : sites.filter((site) => site.category === activeCategory);

  // Warning overlay at 1 minute — conditional rendering
  const showWarningOverlay = warningLevel === 3;

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <AppHeader />

      {/* Category filter tabs — setActiveCategory lifts state up */}
      <CategoryTabBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <IconGrid sites={filteredSites} />
      </main>

      <BottomNav active="home" />

      {/* 1-minute warning full-screen overlay */}
      {showWarningOverlay && (
        <div className="fixed inset-0 bg-orange-500/90 z-50 flex flex-col items-center justify-center gap-6 p-8">
          <span className="text-8xl animate-bounce">⏰</span>
          <h2 className="text-white text-3xl font-bold text-center">
            Almost done for today!
          </h2>
          <p className="text-white text-xl text-center">
            You have less than 1 minute left. Time to wrap up!
          </p>
        </div>
      )}
    </div>
  );
}
