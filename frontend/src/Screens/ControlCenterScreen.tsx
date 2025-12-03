// src/screens/ControlCenterScreen.tsx
import React from "react";
import { ExperienceLevelSelect } from "@/components/controlCenter/ExperienceLevelSelect";
import { CoachingStyleSelect } from "@/components/controlCenter/CoachingStyleSelect";
import { PreferredStylesGrid } from "@/components/controlCenter/PreferredStylesGrid";
import { ConfidenceSpectrumEditor } from "@/components/controlCenter/ConfidenceSpectrumEditor";
import { DarkModeToggle } from "@/components/controlCenter/DarkModeToggle";

export const ControlCenterScreen: React.FC = () => {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-gray-100">Control Center</h1>
      </header>

      <section className="space-y-4 rounded-xl border border-outline-subtle bg-background-elevated px-3 py-3">
        <ExperienceLevelSelect />
        <CoachingStyleSelect />
        <PreferredStylesGrid />
        <ConfidenceSpectrumEditor />
        <DarkModeToggle />
      </section>
    </div>
  );
};
