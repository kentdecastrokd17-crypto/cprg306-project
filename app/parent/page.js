"use client";
// Renders PINForm first; once verified, renders SettingsLayout.


import { useState } from "react";
import PINForm from "@/components/PINForm";
import SettingsLayout from "@/components/SettingsLayout";

export default function ParentPage() {
  // isPinVerified gates the entire settings panel
  const [isPinVerified, setIsPinVerified] = useState(false);

  return (
    <>
      {/* Conditional rendering — show PIN form OR settings */}
      {isPinVerified ? (
        <SettingsLayout />
      ) : (
        <PINForm onVerified={() => setIsPinVerified(true)} />
      )}
    </>
  );
}
