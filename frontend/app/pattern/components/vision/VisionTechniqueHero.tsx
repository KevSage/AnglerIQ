// src/components/vision/VisionTechniqueHero.tsx
"use client";

import React from "react";
import type { PatternDetail } from "@/types/pattern";
// If your PatternDetail type lives elsewhere, point this import there.

interface VisionTechniqueHeroProps {
  technique: PatternDetail["technique"];
}

export function VisionTechniqueHero({ technique }: VisionTechniqueHeroProps) {
  // Later we can map iconKey → hero silhouette.
  // For now we give you the final cinematic layout with a generic gradient.
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#181818] to-[#101010] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
      {/* Hero gradient silhouette layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -inset-x-16 -bottom-16 -top-6 rotate-[14deg] bg-gradient-to-br from-[#4A7BA7]/22 to-[#1B314A]/22" />
      </div>

      <div className="relative p-4">
        {/* Title block */}
        <div className="mb-3">
          <div className="text-[16px] font-semibold drop-shadow-sm">
            {technique.name}
          </div>
          <div className="text-[12px] text-white/70">{technique.style}</div>
        </div>

        {/* Bullets */}
        <ul className="space-y-1 text-[13px] text-white/85">
          {technique.bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-[6px] h-1 w-1 rounded-full bg-white/70" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
