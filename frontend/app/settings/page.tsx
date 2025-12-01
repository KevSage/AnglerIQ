"use client";

import React, { useState } from "react";
import { useUserName } from "../context/UserNameContext";

// High-level SAGE preference styles
const ALL_PREFERRED_STYLES = [
  "power",
  "finesse",
  "offshore",
  "bank",
  "dock",
  "grass",
];

// Canonical lure taxonomy groups for confidence baits
const LURE_GROUPS: {
  label: string;
  key: string;
  options: string[];
}[] = [
  {
    label: "Power fishing",
    key: "power",
    options: [
      "chatterbait",
      "spinnerbait",
      "buzzbait",
      "swim jig",
      "squarebill",
      "mid-depth crankbait",
      "deep crankbait",
      "lipless crankbait",
      "underspin",
      "swimbait",
      "glide bait",
      "walking bait",
      "whopper plopper",
      "prop bait",
      "wakebait",
    ],
  },
  {
    label: "Finesse",
    key: "finesse",
    options: [
      "ned rig",
      "wacky rig",
      "dropshot",
      "finesse swimbait",
      "neko rig",
      "shaky head",
      "split-shot rig",
      "flick shake",
      "finesse jig",
      "micro-jig",
    ],
  },
  {
    label: "Jigs & bottom-contact",
    key: "bottom",
    options: [
      "football jig",
      "casting jig",
      "flipping jig",
      "texas-rig worm",
      "carolina rig",
      "creature bait",
      "craw trailer",
      "beaver bait",
    ],
  },
  {
    label: "Topwater",
    key: "topwater",
    options: ["popper", "frog", "buzzing frog"],
  },
  {
    label: "Jerkbaits / minnow baits",
    key: "jerkbaits",
    options: [
      "jerkbait",
      "soft jerkbait",
      "suspending jerkbait",
      "deep jerkbait",
    ],
  },
  {
    label: "Vertical / deep-water",
    key: "vertical",
    options: ["blade bait", "jigging spoon", "flutter spoon", "damiki rig"],
  },
  {
    label: "Specialty",
    key: "specialty",
    options: ["alabama rig", "hair jig", "inline spinner", "scrounger head"],
  },
  {
    label: "Soft swimbaits / line-through",
    key: "soft-swimbaits",
    options: ["line-through swimbait", "soft swimbait", "multi-joint swimbait"],
  },
  {
    label: "Live bait (future, Vision+)",
    key: "live-bait",
    options: ["live shiner", "live worm", "live minnow"],
  },
];

export default function SettingsPage() {
  const { userName, setUserName } = useUserName();

  const [darkMode, setDarkMode] = useState(false);

  const [experienceLevel, setExperienceLevel] = useState<
    "agnostic" | "beginner" | "intermediate" | "advanced"
  >("agnostic");

  const [coachingStyle, setCoachingStyle] = useState<
    | "agnostic"
    | "calm_guide"
    | "old_school_pro"
    | "data_analyst"
    | "hype_coach"
    | "minimalist"
  >("agnostic");

  const [preferredStyles, setPreferredStyles] = useState<string[]>([]);
  const [confidenceBaits, setConfidenceBaits] = useState<string[]>([]);
  const [bannedTechniques, setBannedTechniques] = useState<string[]>([]);
  const [selectedLureCategory, setSelectedLureCategory] =
    useState<string>("power");
  const [selectedBannedCategory, setSelectedBannedCategory] =
    useState<string>("power");

  function togglePreferredStyle(style: string) {
    setPreferredStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  }

  function handleSaveLocal() {
    const payload = {
      dark_mode: darkMode,
      experience_level: experienceLevel,
      coaching_style: coachingStyle,
      preferred_styles: preferredStyles.length ? preferredStyles : ["agnostic"],
      confidence_baits: confidenceBaits.length ? confidenceBaits : null,
      banned_techniques: bannedTechniques.length ? bannedTechniques : null,
    };

    console.log("Control Center (local only, not persisted):", payload);
    alert("Settings saved locally (no backend wiring yet).");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Control Center
          </h1>

          {/* Angler name */}
          <section className="mt-4">
            <label className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Your name
            </label>
            <input
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="How should SAGE address you?"
              value={userName ?? ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                setUserName(value || null);
              }}
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              SAGE will use this name in greetings to keep things personal.
            </p>
          </section>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tune how SAGE talks to you. These settings shape{" "}
            <span className="font-medium">text only</span> &mdash; they do not
            change the underlying Pro/Elite/Vision engines.
          </p>
        </header>

        {/* Dark mode */}
        <section className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                Dark mode
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Visual theme only. Does not affect SAGE&apos;s logic.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-600"
              />
              <span>{darkMode ? "On" : "Off"}</span>
            </label>
          </div>
        </section>

        {/* Experience level */}
        <section className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Experience level
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Controls how much jargon and explanation SAGE uses in its replies.
          </p>
          <select
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value as any)}
          >
            <option value="agnostic">No preference / Agnostic</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </section>

        {/* Coaching style */}
        {/* ...rest of your sections unchanged (coaching style, preferred styles, confidence baits, banned techniques, footer)... */}
      </main>
    </div>
  );
}
