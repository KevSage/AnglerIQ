import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenContainer from "../components/layout/ScreenContainer";
import { useTier } from "../hooks/useTier";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";

type ExperienceLevel = "general" | "beginner" | "intermediate" | "advanced";

const EXPERIENCE_STORAGE_KEY = "aiq_experience_level";
const HIGH_CONF_STORAGE_KEY = "aiq_high_confidence_baits";
const LOW_CONF_STORAGE_KEY = "aiq_low_confidence_baits";

const parseStoredList = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((v) => String(v).trim())
        .filter((v) => v.length > 0);
    }
  } catch {
    // fall through
  }
  return [];
};

const ControlCenterScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier();

  const [experience, setExperience] = useState<ExperienceLevel>("general");
  const [highConfBaits, setHighConfBaits] = useState<string[]>([]);
  const [lowConfBaits, setLowConfBaits] = useState<string[]>([]);
  const [highInput, setHighInput] = useState("");
  const [lowInput, setLowInput] = useState("");

  // Hydrate from localStorage on first mount
  useEffect(() => {
    const rawExp = localStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (
      rawExp === "general" ||
      rawExp === "beginner" ||
      rawExp === "intermediate" ||
      rawExp === "advanced"
    ) {
      setExperience(rawExp);
    } else {
      setExperience("general");
    }

    setHighConfBaits(parseStoredList(localStorage.getItem(HIGH_CONF_STORAGE_KEY)));
    setLowConfBaits(parseStoredList(localStorage.getItem(LOW_CONF_STORAGE_KEY)));
  }, []);

  const updateExperience = (level: ExperienceLevel) => {
    setExperience(level);
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, level);
  };

  const persistHigh = (items: string[]) => {
    setHighConfBaits(items);
    localStorage.setItem(HIGH_CONF_STORAGE_KEY, JSON.stringify(items));
  };

  const persistLow = (items: string[]) => {
    setLowConfBaits(items);
    localStorage.setItem(LOW_CONF_STORAGE_KEY, JSON.stringify(items));
  };

  const addHighBait = () => {
    const trimmed = highInput.trim();
    if (!trimmed) return;
    if (highConfBaits.includes(trimmed)) {
      setHighInput("");
      return;
    }
    const next = [...highConfBaits, trimmed];
    persistHigh(next);
    setHighInput("");
  };

  const addLowBait = () => {
    const trimmed = lowInput.trim();
    if (!trimmed) return;
    if (lowConfBaits.includes(trimmed)) {
      setLowInput("");
      return;
    }
    const next = [...lowConfBaits, trimmed];
    persistLow(next);
    setLowInput("");
  };

  const removeHighBait = (bait: string) => {
    persistHigh(highConfBaits.filter((b) => b !== bait));
  };

  const removeLowBait = (bait: string) => {
    persistLow(lowConfBaits.filter((b) => b !== bait));
  };

  const resetAll = () => {
    setExperience("general");
    setHighConfBaits([]);
    setLowConfBaits([]);
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, "general");
    localStorage.setItem(HIGH_CONF_STORAGE_KEY, "[]");
    localStorage.setItem(LOW_CONF_STORAGE_KEY, "[]");
  };

  const tierLabel =
    tier === "pro" ? "Pro Tier" : tier === "elite" ? "Elite Tier" : "Vision Tier";

  return (
    <ScreenContainer>
      {/* Header */}
      <header className="mb-4 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">
          Control Center
        </div>

        <h1 className="mt-2 text-base font-semibold text-slate-100">
          Personalize SAGE
        </h1>

        <p className="mt-1 max-w-md text-xs text-slate-400">
          Set your experience level and Confidence Spectrum so SAGE can talk to you
          the way you prefer—without changing the underlying pattern engines.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] font-medium text-slate-200"
        >
          Back to Home
        </button>
      </header>

      {/* Tier pill */}
      <div className="mb-3 inline-flex rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
        {tierLabel}
      </div>

      {/* Experience Level */}
      <section className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-100">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Experience Level
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          This shapes how SAGE explains patterns — same engines, different tone.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["general", "beginner", "intermediate", "advanced"] as ExperienceLevel[]).map(
            (level) => {
              const label =
                level === "general"
                  ? "General"
                  : level === "beginner"
                  ? "Beginner"
                  : level === "intermediate"
                  ? "Intermediate"
                  : "Advanced";
              const active = experience === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateExperience(level)}
                  className={[
                    "rounded-xl border px-3 py-2 text-[11px] font-medium",
                    active
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-200"
                      : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Confidence Spectrum */}
      <section className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-100">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Confidence Spectrum
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          High-Confidence baits are what you trust most. Low-Confidence baits
          stay in the conversation, but SAGE only nudges you toward them when
          conditions really favor them.
        </p>

        {/* High-Confidence */}
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            High-Confidence Baits
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={highInput}
              onChange={(e) => setHighInput(e.target.value)}
              placeholder="Add a confidence bait (e.g., jig)…"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-slate-100 outline-none focus:border-emerald-400"
            />
            <button
              type="button"
              onClick={addHighBait}
              className="rounded-xl border border-emerald-400 bg-emerald-400 px-3 py-2 text-[11px] font-semibold text-black hover:bg-emerald-300"
            >
              Add
            </button>
          </div>
          {highConfBaits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {highConfBaits.map((bait) => (
                <span
                  key={bait}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-100"
                >
                  {bait}
                  <button
                    type="button"
                    onClick={() => removeHighBait(bait)}
                    className="text-[10px] text-emerald-200 hover:text-emerald-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Low-Confidence */}
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">
            Low-Confidence Baits
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            These are growth baits — SAGE will treat them as optional, not as
            first picks.
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={lowInput}
              onChange={(e) => setLowInput(e.target.value)}
              placeholder="Add a low-confidence bait (e.g., ned rig)…"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-slate-100 outline-none focus:border-emerald-400"
            />
            <button
              type="button"
              onClick={addLowBait}
              className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
            >
              Add
            </button>
          </div>
          {lowConfBaits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {lowConfBaits.map((bait) => (
                <span
                  key={bait}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-[10px] text-slate-100"
                >
                  {bait}
                  <button
                    type="button"
                    onClick={() => removeLowBait(bait)}
                    className="text-[10px] text-slate-300 hover:text-slate-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reset */}
      <section className="mb-8">
        <button
          type="button"
          onClick={resetAll}
          className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          Reset preferences to default
        </button>
      </section>
    </ScreenContainer>
  );
};

export default ControlCenterScreen;