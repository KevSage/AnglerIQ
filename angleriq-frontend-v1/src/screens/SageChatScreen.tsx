import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useSageChat } from "../hooks/useSageChat";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";

const SageChatScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);
  const {
    messages,
    sending,
    error: chatError,
    sendMessage,
    clearChat,
  } = useSageChat();

  const [input, setInput] = useState("");

  const isVision = tier === "vision";

  const hasVisionAnalysis = useMemo(() => {
    if (!pattern) return false;
    const p = pattern as PatternResponse;
    return !!p.vision?.vision_enhanced_analysis;
  }, [pattern]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Interpreting your Pattern-of-the-Moment…
        </div>
      </div>
    );
  }

  // Error / missing pattern
  if (error || !pattern) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="space-y-3 rounded-xl border border-red-800/60 bg-slate-900/80 p-4 text-sm text-slate-200">
          <p>Something went wrong while interpreting conditions. Try again.</p>
        </div>
      </div>
    );
  }

  const p = pattern as PatternResponse;

  // Preferences from localStorage (Control Center)
  const experienceLevel =
    (localStorage.getItem("aiq_experience_level") as
      | "general"
      | "beginner"
      | "intermediate"
      | "advanced"
      | null) ?? "general";

  const coachingStyle =
    (localStorage.getItem("aiq_coaching_style") as
      | "Calm Guide"
      | "Old School Pro"
      | "Data Analyst"
      | "Hype Coach"
      | "Minimalist"
      | null) ?? "Calm Guide";

  const preferredStylesRaw =
    localStorage.getItem("aiq_preferred_styles") ?? "[]";
  const highConfidenceRaw =
    localStorage.getItem("aiq_high_confidence_baits") ?? "[]";
  const lowConfidenceRaw =
    localStorage.getItem("aiq_low_confidence_baits") ?? "[]";

  let preferredStyles: string[] = [];
  let highConfidenceBaits: string[] = [];
  let lowConfidenceBaits: string[] = [];

  try {
    preferredStyles = JSON.parse(preferredStylesRaw);
  } catch {
    preferredStyles = [];
  }
  try {
    highConfidenceBaits = JSON.parse(highConfidenceRaw);
  } catch {
    highConfidenceBaits = [];
  }
  try {
    lowConfidenceBaits = JSON.parse(lowConfidenceRaw);
  } catch {
    lowConfidenceBaits = [];
  }

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const payload = {
      message: text,
      context: {
        pattern: {
          tier,
          pattern_of_the_moment: p.pattern_of_the_moment,
          technique: p.technique,
          depth_zone: p.depth_zone,
          conditions: p.conditions,
        },
        vision: p.vision ?? undefined,
      },
      preferences: {
        experience_level: experienceLevel,
        coaching_style: coachingStyle,
        preferred_styles: preferredStyles,
        high_confidence_baits: highConfidenceBaits,
        low_confidence_baits: lowConfidenceBaits,
      },
    };

    await sendMessage(text, payload);
    setInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleChangeSettings = () => {
    navigate("/control-center");
  };

  const tierLabel =
    tier === "pro"
      ? "Pro Tier"
      : tier === "elite"
      ? "Elite Tier"
      : "Vision Tier";

  const patternTechnique = p.technique || p.pattern_of_the_moment || "—";
  const depthZoneLabel = p.depth_zone ?? "—";

  return (
    <ScreenContainer>
      {/* Header */}
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-100">SAGE</h1>
          {isVision && hasVisionAnalysis && (
            <p className="mt-1 text-xs text-slate-400">
              Vision Enhanced Analysis Active
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200"
        >
          Back to Home
        </button>
      </header>

      {/* Context panel */}
      <section className="mb-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-200">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
            {tierLabel}
          </span>
          <span className="text-[10px] text-slate-400">
            Experience Level: {experienceLevel}
          </span>
        </div>

        <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Pattern-of-the-Moment
            </p>
            <p className="mt-1 text-[11px] text-slate-100">
              {patternTechnique}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Depth Zone
            </p>
            <p className="mt-1 text-[11px] text-slate-100">{depthZoneLabel}</p>
          </div>
        </div>
      </section>

      {/* Chat area */}
      <main className="flex-1 space-y-2 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-100">
        {messages.length === 0 && (
          <p className="text-slate-400">
            Ask SAGE anything about today’s conditions or your approach.
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={[
                "max-w-[80%] rounded-2xl px-3 py-2",
                m.from === "user"
                  ? "bg-slate-100 text-slate-900"
                  : "bg-slate-800 text-slate-100",
              ].join(" ")}
            >
              <p className="whitespace-pre-wrap text-[11px] leading-relaxed">
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </main>

      {/* Error message (chat-level) */}
      {chatError && (
        <div className="mt-2 rounded-xl border border-red-800/60 bg-slate-900/80 px-3 py-2 text-[11px] text-red-200">
          {chatError}
        </div>
      )}

      {/* Input + actions */}
      <footer className="mt-3 space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SAGE about your approach…"
          className="h-20 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearChat}
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] font-medium text-slate-200"
            >
              Clear Chat
            </button>
            <button
              type="button"
              onClick={handleChangeSettings}
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] font-medium text-slate-200"
            >
              Change Settings
            </button>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className={[
              "rounded-full px-4 py-1 text-[11px] font-semibold",
              sending || !input.trim()
                ? "border border-slate-700 bg-slate-900 text-slate-500"
                : "border border-emerald-400 bg-emerald-400 text-black",
            ].join(" ")}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </footer>
    </ScreenContainer>
  );
};

export default SageChatScreen;
