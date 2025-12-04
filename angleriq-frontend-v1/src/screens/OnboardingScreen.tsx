import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type OnboardingStep = "welcome" | "tier" | "personalization";

type ExperienceLevel = "general" | "beginner" | "intermediate" | "advanced";

type CoachingStyle =
  | "Calm Guide"
  | "Old School Pro"
  | "Data Analyst"
  | "Hype Coach"
  | "Minimalist";

const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedTier, setSelectedTier] = useState<
    "pro" | "elite" | "vision" | null
  >(null);
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle | null>(
    null
  );

  const navigate = useNavigate();

  const goToNextStep = () => {
    if (step === "welcome") {
      setStep("tier");
    } else if (step === "tier") {
      setStep("personalization");
    } else {
      // Finalize onboarding: persist basic settings and go Home
      if (selectedTier) {
        localStorage.setItem("aiq_tier", selectedTier);
      }
      if (experienceLevel) {
        localStorage.setItem("aiq_experience_level", experienceLevel);
      }
      if (coachingStyle) {
        localStorage.setItem("aiq_coaching_style", coachingStyle);
      }
      // NEW: onboarding completion flag
      localStorage.setItem("aiq_onboarding_complete", "true");
      navigate("/", { replace: true });
    }
  };

  // ─────────────────────────────────────────
  // Step 1 — Welcome
  // ─────────────────────────────────────────
  if (step === "welcome") {
    return (
      <div className="min-h-screen px-4 py-4 text-slate-100">
        <header className="mb-8">
          <h1 className="text-lg font-semibold">Welcome to AnglerIQ</h1>
          <p className="mt-1 text-xs text-slate-400">
            Environmental Understanding — Elevated and Interpreted.
          </p>
        </header>

        <main className="mt-8">
          <button
            type="button"
            onClick={goToNextStep}
            className="w-full rounded-full border border-emerald-400 bg-emerald-400 px-3 py-2 text-[11px] font-medium text-black"
          >
            Continue
          </button>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Step 2 — Tier Explanation
  // ─────────────────────────────────────────
  if (step === "tier") {
    return (
      <div className="min-h-screen px-4 py-4 text-slate-100">
        <header className="mb-4">
          <h1 className="text-lg font-semibold">Choose Your Tier</h1>
        </header>

        <main className="space-y-3 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTier("pro")}
            className={[
              "w-full rounded-2xl border px-4 py-3 text-left",
              selectedTier === "pro"
                ? "border-emerald-400 bg-slate-900"
                : "border-slate-700 bg-slate-950",
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-slate-100">Pro</p>
            <p className="mt-1 text-xs text-slate-300">
              Clear and reliable patterns based on today’s conditions.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTier("elite")}
            className={[
              "w-full rounded-2xl border px-4 py-3 text-left",
              selectedTier === "elite"
                ? "border-emerald-400 bg-slate-900"
                : "border-slate-700 bg-slate-950",
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-slate-100">Elite</p>
            <p className="mt-1 text-xs text-slate-300">
              Automated interpretation with a full gameplan and adjustments.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTier("vision")}
            className={[
              "w-full rounded-2xl border px-4 py-3 text-left",
              selectedTier === "vision"
                ? "border-emerald-400 bg-slate-900"
                : "border-slate-700 bg-slate-950",
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-slate-100">Vision</p>
            <p className="mt-1 text-xs text-slate-300">
              Real-time environmental interpretation using sonar and surface
              cues.
            </p>
          </button>

          <button
            type="button"
            onClick={goToNextStep}
            disabled={!selectedTier}
            className={[
              "mt-6 w-full rounded-full px-3 py-2 text-[11px] font-medium",
              selectedTier
                ? "border border-emerald-400 bg-emerald-400 text-black"
                : "border border-slate-700 bg-slate-900 text-slate-500",
            ].join(" ")}
          >
            Continue
          </button>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Step 3 — Personalization
  // ─────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-4 text-slate-100">
      <header className="mb-4">
        <h1 className="text-lg font-semibold">Personalize your Guidance</h1>
      </header>

      <main className="space-y-6 text-xs">
        {/* Experience Level */}
        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Experience Level
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "general",
                "beginner",
                "intermediate",
                "advanced",
              ] as ExperienceLevel[]
            ).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setExperienceLevel(value)}
                className={[
                  "rounded-full border px-3 py-1 text-[11px]",
                  experienceLevel === value
                    ? "border-emerald-400 bg-slate-900 text-slate-100"
                    : "border-slate-700 bg-slate-950 text-slate-300",
                ].join(" ")}
              >
                {value}
              </button>
            ))}
          </div>
        </section>

        {/* Coaching Style */}
        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Coaching Style
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "Calm Guide",
                "Old School Pro",
                "Data Analyst",
                "Hype Coach",
                "Minimalist",
              ] as CoachingStyle[]
            ).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCoachingStyle(value)}
                className={[
                  "rounded-full border px-3 py-1 text-[11px]",
                  coachingStyle === value
                    ? "border-emerald-400 bg-slate-900 text-slate-100"
                    : "border-slate-700 bg-slate-950 text-slate-300",
                ].join(" ")}
              >
                {value}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={goToNextStep}
          disabled={!experienceLevel || !coachingStyle}
          className={[
            "mt-4 w-full rounded-full px-3 py-2 text-[11px] font-medium",
            experienceLevel && coachingStyle
              ? "border border-emerald-400 bg-emerald-400 text-black"
              : "border border-slate-700 bg-slate-900 text-slate-500",
          ].join(" ")}
        >
          Finish Setup
        </button>
      </main>
    </div>
  );
};

export default OnboardingScreen;
