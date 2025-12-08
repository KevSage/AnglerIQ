"use client";

import React, { useEffect, useState } from "react";
import { useUserName } from "../context/UserNameContext";

const LOCAL_STORAGE_KEY = "angleriq_control_center_v1";

// High-level SAGE preference styles
const ALL_PREFERRED_STYLES = [
  "power",
  "finesse",
  "offshore",
  "bank",
  "dock",
  "grass",
];

// Canonical lure taxonomy groups for confidence baits / banned techniques
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
  const [newBannedTechnique, setNewBannedTechnique] = useState("");

  const [selectedLureCategory, setSelectedLureCategory] =
    useState<string>("power");
  const [selectedBannedCategory, setSelectedBannedCategory] =
    useState<string>("power");

  // ---------- Load from localStorage on mount ----------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;

      const stored = JSON.parse(raw) as any;

      if (typeof stored.dark_mode === "boolean") {
        setDarkMode(stored.dark_mode);
      }

      if (
        typeof stored.experience_level === "string" &&
        ["agnostic", "beginner", "intermediate", "advanced"].includes(
          stored.experience_level
        )
      ) {
        setExperienceLevel(stored.experience_level);
      }

      if (
        typeof stored.coaching_style === "string" &&
        [
          "agnostic",
          "calm_guide",
          "old_school_pro",
          "data_analyst",
          "hype_coach",
          "minimalist",
        ].includes(stored.coaching_style)
      ) {
        setCoachingStyle(stored.coaching_style);
      }

      if (Array.isArray(stored.preferred_styles)) {
        setPreferredStyles(
          stored.preferred_styles.filter((s: unknown) => typeof s === "string")
        );
      }

      if (Array.isArray(stored.confidence_baits)) {
        setConfidenceBaits(
          stored.confidence_baits.filter((s: unknown) => typeof s === "string")
        );
      }

      if (Array.isArray(stored.banned_techniques)) {
        setBannedTechniques(
          stored.banned_techniques.filter((s: unknown) => typeof s === "string")
        );
      }

      if (typeof stored.user_name === "string" && stored.user_name.trim()) {
        setUserName(stored.user_name.trim());
      }
    } catch (err) {
      console.error("Failed to load Control Center settings:", err);
    }
  }, [setUserName]);

  // ---------- Handlers ----------
  function togglePreferredStyle(style: string) {
    setPreferredStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  }

  function toggleConfidenceBait(lure: string) {
    setConfidenceBaits((prev) =>
      prev.includes(lure) ? prev.filter((b) => b !== lure) : [...prev, lure]
    );
  }

  function addBannedTechnique() {
    const trimmed = newBannedTechnique.trim();
    if (!trimmed) return;
    setBannedTechniques((prev) => [...prev, trimmed]);
    setNewBannedTechnique("");
  }

  function handleSaveLocal() {
    const payload = {
      dark_mode: darkMode,
      experience_level: experienceLevel,
      coaching_style: coachingStyle,
      preferred_styles: preferredStyles.length ? preferredStyles : ["agnostic"],
      confidence_baits: confidenceBaits.length ? confidenceBaits : null,
      banned_techniques: bannedTechniques.length ? bannedTechniques : null,
      user_name: userName ?? null,
    };

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      }
      console.log("Control Center (local only, persisted):", payload);
      alert("Settings saved locally for this device.");
    } catch (err) {
      console.error("Failed to save Control Center settings:", err);
      alert("Could not save settings locally. Check storage permissions.");
    }
  }

  // ---------- Render ----------
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Control Center
          </h1>

          {/* Name input */}
          <section className="mt-4">
            <label className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Your name
            </label>
            <input
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="How should SAGE address you?"
              value={userName ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setUserName(value || null);
              }}
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              SAGE will use this name in greetings to keep things personal.
            </p>
          </section>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tune how SAGE talks to you. These settings shape{" "}
            <span className="font-medium">text only</span> — they do not change
            the underlying Pro/Elite/Vision engines.
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
        <section className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Coaching style
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Shapes SAGE&apos;s tone: calm, blunt, analytical, hype, or minimal.
          </p>
          <select
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={coachingStyle}
            onChange={(e) => setCoachingStyle(e.target.value as any)}
          >
            <option value="agnostic">No preference / Agnostic</option>
            <option value="calm_guide">Calm guide</option>
            <option value="old_school_pro">Old school pro</option>
            <option value="data_analyst">Data analyst</option>
            <option value="hype_coach">Hype coach</option>
            <option value="minimalist">Minimalist</option>
          </select>
        </section>

        {/* Preferred styles */}
        <section className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Preferred fishing styles
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            SAGE will lean toward these styles in its wording only.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_PREFERRED_STYLES.map((style) => {
              const active = preferredStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => togglePreferredStyle(style)}
                  className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </section>

        {/* Confidence baits */}
        <section className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Confidence baits
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose a category, then tap baits you trust. SAGE will lean on these
            in its wording only.
          </p>

          {/* Category selector */}
          <div className="mt-2">
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Lure category
            </label>
            <select
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              value={selectedLureCategory}
              onChange={(e) => setSelectedLureCategory(e.target.value)}
            >
              {LURE_GROUPS.map((group) => (
                <option key={group.key} value={group.key}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lures within selected category */}
          <div className="mt-3">
            {LURE_GROUPS.filter((g) => g.key === selectedLureCategory).map(
              (group) => (
                <div key={group.key}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const active = confidenceBaits.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleConfidenceBait(opt)}
                          className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
                            active
                              ? "border-green-600 bg-green-600 text-white shadow-sm"
                              : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>

          {confidenceBaits.length > 0 && (
            <div className="mt-3 rounded-md bg-green-50 p-2 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-100">
              <div className="font-semibold">Your current confidence set:</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {confidenceBaits.map((bait) => (
                  <span
                    key={bait}
                    className="rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-medium text-white"
                  >
                    {bait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Banned techniques */}
        <section className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Banned techniques
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose a category, then tap techniques you don&apos;t want
            emphasized. SAGE will de-emphasize these in its wording only.
          </p>

          {/* Category selector */}
          <div className="mt-2">
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Lure category
            </label>
            <select
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              value={selectedBannedCategory}
              onChange={(e) => setSelectedBannedCategory(e.target.value)}
            >
              {LURE_GROUPS.map((group) => (
                <option key={group.key} value={group.key}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lures within selected category */}
          <div className="mt-3">
            {LURE_GROUPS.filter((g) => g.key === selectedBannedCategory).map(
              (group) => (
                <div key={group.key}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const active = bannedTechniques.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setBannedTechniques((prev) =>
                              prev.includes(opt)
                                ? prev.filter((t) => t !== opt)
                                : [...prev, opt]
                            );
                          }}
                          className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
                            active
                              ? "border-red-600 bg-red-600 text-white shadow-sm"
                              : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>

          {bannedTechniques.length > 0 && (
            <div className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-100">
              <div className="font-semibold">Your current banned set:</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {bannedTechniques.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="mt-6">
          <button
            type="button"
            onClick={handleSaveLocal}
            className="flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Save settings (local only)
          </button>
        </footer>
      </main>
    </div>
  );
}
