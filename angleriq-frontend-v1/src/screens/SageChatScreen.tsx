import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useSageChat } from "../hooks/useSageChat";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";

const SageChatScreen: React.FC = () => {
  useOnboardingGuard();
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
const chatRef = useRef<HTMLDivElement | null>(null);
const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages])

// Auto-scroll to bottom whenever messages change
useEffect(() => {
  const el = chatRef.current;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}, [messages]);

  const hasVisionAnalysis = useMemo(() => {
    if (!pattern) return false;
    const p = pattern as PatternResponse;
    return !!p.vision?.vision_enhanced_analysis;
  }, [pattern]);

  // Global loading / error states
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Interpreting today&apos;s conditions…
        </div>
      </div>
    );
  }

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
  const patternTitle =
  p.primary_technique ||
  p.technique ||
  p.pattern_of_the_moment ||
  "—";


  // Personalization snapshot
    const uiExperienceLevel =
    (localStorage.getItem("aiq_experience_level") as
      | "general"
      | "beginner"
      | "intermediate"
      | "advanced"
      | null) ?? "general";

  // Map UI → backend enum
  const backendExperienceLevel:
    | "agnostic"
    | "beginner"
    | "intermediate"
    | "advanced" =
    uiExperienceLevel === "general" ? "agnostic" : uiExperienceLevel;

  // Backend-safe coaching style slug
  const backendCoachingStyle: "calm_guide" = "calm_guide";

  const highConfidenceRaw =
    localStorage.getItem("aiq_high_confidence_baits") ?? "[]";
  const lowConfidenceRaw =
    localStorage.getItem("aiq_low_confidence_baits") ?? "[]";

  let highConfidenceBaits: string[] = [];
  let lowConfidenceBaits: string[] = [];

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
          phase: p.phase,
        },
        vision: p.vision ?? undefined,
      },
      preferences: {
        experience_level: backendExperienceLevel,
        coaching_style: backendCoachingStyle,
        preferred_styles: [],
        high_confidence_baits: highConfidenceBaits,
        low_confidence_baits: lowConfidenceBaits,
      },
    };

    await sendMessage(text, payload);
    setInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  // Derived labels for the snapshot panel

  const depthZoneLabel = p.depth_zone || "—";
  const patternWhy =
    p.pattern_blurb ||
    p.pattern_summary ||
    "Built from today’s environment so you can start with one clear technique instead of a random lure list.";
  const shortPatternWhy =
  patternWhy.length > 140
    ? `${patternWhy.slice(0, 137)}…`
    : patternWhy;
    
  return (
    <ScreenContainer>
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-3 overflow-hidden pt-2">
       {/* PATTERN SNAPSHOT — anchored but a bit tighter */}
      <section className="mb-4 w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-[11px] text-slate-200">
        {/* Header */}
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Pattern Snapshot
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Built from today&apos;s Pattern of the Day.
          </p>
        </div>

        {/* Quick stats row */}
        <div className="mt-1 grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Technique
            </p>
            <p className="mt-1 text-[11px] text-slate-100">{patternTitle}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Depth Zone
            </p>
            <p className="mt-1 text-[11px] text-slate-100">
              {depthZoneLabel}
            </p>
          </div>
        </div>

        {/* Seasonal Phase as a tertiary row, if present */}
        {p.phase && (
          <div className="mt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Seasonal Phase
            </p>
            <p className="mt-1 text-[11px] text-slate-300">{p.phase}</p>
          </div>
        )}

        {/* Main explanation */}
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Pattern of the Day
            </p>
            <p className="mt-1 text-[12px] text-slate-100">{patternTitle}</p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Why this pattern
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
              {shortPatternWhy}
            </p>
          </div>

          {isVision && hasVisionAnalysis && (
            <p className="mt-1 text-[10px] text-indigo-300">
              Vision Enhanced cues are active here — SAGE will factor them into
              how it talks about this spot.
            </p>
          )}
        </div>
      </section>

      {/* CHAT AREA */}
     <main
          ref={chatRef}
          className="
            flex-1
            min-h-[220px]
            max-h-[420px]
            space-y-2
            overflow-y-auto
            rounded-2xl
            border
            border-slate-800
            bg-slate-950/80
            p-3
            text-xs
            text-slate-100
            max-h-[60vh]
            aiq-scroll
          "
        >
          {messages.length === 0 && (
             <div className="mb-3">
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                SAGE
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                On-water guide for today&apos;s Pattern of the Day
              </p>

              <p className="mt-3 text-slate-400">
                Ask SAGE about today&apos;s conditions, your current approach,
                or how to adjust as the day changes.
              </p>
            </div>
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
                  "max-w-[80%] rounded-xl px-3 py-2 shadow-sm",
                  m.from === "user"
                    ? "bg-emerald-400 text-slate-900 border border-emerald-300"
                    : "bg-slate-800 text-slate-100 border border-slate-700",
                ].join(" ")}
      >
                <p className="whitespace-pre-wrap text-[11px] leading-relaxed">
                  {m.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </main  >
      {/* ERROR MESSAGE */}
      {chatError && (
        <div className="mt-2 rounded-xl border border-red-800/60 bg-slate-900/80 px-3 py-2 text-[11px] text-red-200">
          {chatError}
        </div>
      )}

      {/* INPUT AREA — still substantial, but SAGE panel now feels weighty too */}
      <footer className="mt-3 space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SAGE about today’s approach, your area, or what to try next…"
          className="h-18 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-400"
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
              onClick={() => (window.location.href = "/control-center")}
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] font-medium text-slate-200"
            >
              Adjust Preferences
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
    
      </div>
    </ScreenContainer>
  );
};

export default SageChatScreen;