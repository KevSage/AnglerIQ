"use client";

import * as React from "react";
import { useUserName } from "../context/UserNameContext";

// ---------- Types from Control Center spec ----------

type ExperienceLevel = "beginner" | "intermediate" | "advanced";
type CoachingStyle = "calm" | "direct" | "pro";

interface ControlCenterData {
  experienceLevel: ExperienceLevel;
  coachingStyle: CoachingStyle;
  preferredStyles: string[]; // e.g. ["power", "grass"]
  confidenceBaits: string[]; // lure keys
  bannedTechniques: string[]; // lure keys

  theme?: "dark" | "light" | "auto";
  textSize?: "normal" | "large";
  motion?: "full" | "reduced";
}

interface LureCategory {
  key: string; // "power"
  label: string; // "Power"
  description?: string; // "Fast-moving baits..."
}

interface LureDefinition {
  key: string; // "chatterbait"
  label: string; // "Chatterbait"
  categoryKey: string; // "power"
  iconKey?: string;
}

interface LureRecommendations {
  recommendedConfidence: string[];
  recommendedBanned: string[];
}

interface ControlCenterPreviewContext {
  currentPhase?: string;
  currentLakeName?: string;
}

// ---------- Stub lure taxonomy for now (hook to canonical list later) ----------

const LURE_CATEGORIES: LureCategory[] = [
  {
    key: "power",
    label: "Power",
    description:
      "Fast-moving baits that cover water and trigger reaction bites.",
  },
  {
    key: "finesse",
    label: "Finesse",
    description:
      "Subtle, detail-oriented presentations for pressured or cold-water fish.",
  },
  {
    key: "bottom",
    label: "Bottom-contact",
    description:
      "Jigs, rigs, and dragging baits that stay close to the lake floor.",
  },
];

const ALL_LURES: LureDefinition[] = [
  // Power
  { key: "chatterbait", label: "Chatterbait", categoryKey: "power" },
  { key: "spinnerbait", label: "Spinnerbait", categoryKey: "power" },
  { key: "swim_jig", label: "Swim Jig", categoryKey: "power" },
  { key: "squarebill_crank", label: "Squarebill Crank", categoryKey: "power" },

  // Finesse
  { key: "ned_rig", label: "Ned Rig", categoryKey: "finesse" },
  { key: "dropshot", label: "Drop Shot", categoryKey: "finesse" },
  { key: "shaky_head", label: "Shaky Head", categoryKey: "finesse" },

  // Bottom-contact
  { key: "football_jig", label: "Football Jig", categoryKey: "bottom" },
  { key: "texas_rig", label: "Texas Rig", categoryKey: "bottom" },
  { key: "carolina_rig", label: "Carolina Rig", categoryKey: "bottom" },
];

// ---------- Initial local state ----------

const INITIAL_DATA: ControlCenterData = {
  experienceLevel: "intermediate",
  coachingStyle: "calm",
  preferredStyles: ["power"],
  confidenceBaits: ["chatterbait"],
  bannedTechniques: [],
  theme: "dark",
  textSize: "normal",
  motion: "full",
};

// ---------- MAIN PAGE COMPONENT ----------

export default function SettingsPage() {
  const [data, setData] = React.useState<ControlCenterData>(INITIAL_DATA);
  const { userName, setUserName } = useUserName();

  const handleUpdate = (update: Partial<ControlCenterData>) => {
    setData((prev) => ({ ...prev, ...update }));
  };

  const previewContext: ControlCenterPreviewContext = {
    currentPhase: "Pre-Spawn",
    currentLakeName: "Lanier",
  };

  const recommendations: LureRecommendations = {
    recommendedConfidence: ["chatterbait", "swim_jig"],
    recommendedBanned: ["ned_rig"],
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <header className="border-b border-white/8 px-4 pt-4 pb-3">
        <div className="text-[13px] font-semibold">Control Center</div>
        <div className="text-[11px] text-white/60">
          Tell SAGE how you fish. These settings shape tone and emphasis, not
          the underlying engines.
        </div>
      </header>

      {/* Name input lives right under header */}
      <section className="border-b border-white/8 px-4 py-3 text-[12px]">
        <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/60">
          YOUR NAME
        </div>
        <input
          className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-[12px] text-white placeholder:text-white/40"
          placeholder="How should SAGE address you?"
          value={userName ?? ""}
          onChange={(e) => {
            const value = e.target.value.trim();
            setUserName(value || null);
          }}
        />
        <p className="mt-1 text-[11px] text-white/50">
          SAGE will use this name in greetings to keep things personal.
        </p>
      </section>

      {/* SAGE preview + identity summary */}
      <div className="px-4 pt-3 space-y-3">
        <SagePreviewBubble data={data} context={previewContext} />
        <FishingIdentityCard data={data} />
      </div>

      {/* Main control cards */}
      <main className="space-y-4 px-4 pt-4 pb-8">
        <ExperienceCard data={data} onUpdate={handleUpdate} />
        <CoachingStyleCard data={data} onUpdate={handleUpdate} />
        <PreferredStylesCard data={data} onUpdate={handleUpdate} />

        <LureSelectionPanel
          title="Confidence Baits"
          mode="confidence"
          categories={LURE_CATEGORIES}
          lures={ALL_LURES}
          selectedKeys={data.confidenceBaits}
          onChange={(keys) => handleUpdate({ confidenceBaits: keys })}
          recommendedKeys={recommendations.recommendedConfidence}
        />

        <LureSelectionPanel
          title="Banned Techniques"
          mode="banned"
          categories={LURE_CATEGORIES}
          lures={ALL_LURES}
          selectedKeys={data.bannedTechniques}
          onChange={(keys) => handleUpdate({ bannedTechniques: keys })}
          recommendedKeys={recommendations.recommendedBanned}
        />

        <DisplaySettingsCard data={data} onUpdate={handleUpdate} />
      </main>
    </div>
  );
}

// ---------- SAGE Preview Bubble ----------

function SagePreviewBubble({
  data,
  context,
}: {
  data: ControlCenterData;
  context?: ControlCenterPreviewContext;
}) {
  const {
    experienceLevel,
    coachingStyle,
    preferredStyles,
    confidenceBaits,
    bannedTechniques,
  } = data;

  const phase = context?.currentPhase ?? "pre-spawn";
  const lake = context?.currentLakeName ?? "your lake";

  const styleLabel =
    coachingStyle === "calm"
      ? "calm guidance"
      : coachingStyle === "direct"
      ? "direct calls"
      : "pro shorthand";

  const expLabel =
    experienceLevel === "beginner"
      ? "simple, clear explanations"
      : experienceLevel === "intermediate"
      ? "balanced detail"
      : "advanced nuance";

  const styleBias = preferredStyles.slice(0, 2).join(" & ");
  const oneConfidence = confidenceBaits[0];
  const oneBanned = bannedTechniques[0];

  let body = "";

  if (coachingStyle === "calm") {
    body += `I’ll keep things steady and clear while we pick apart this ${phase} pattern on ${lake}. `;
  } else if (coachingStyle === "direct") {
    body += `I’ll give you straight, no-fluff calls on this ${phase} pattern at ${lake}. `;
  } else {
    body += `I’ll talk to you like a seasoned tournament partner working a ${phase} pattern on ${lake}. `;
  }

  if (experienceLevel === "beginner") {
    body += `I’ll explain the “why” behind each move and keep jargon to a minimum. `;
  } else if (experienceLevel === "intermediate") {
    body += `I’ll assume you know the basics and focus on what really matters today. `;
  } else {
    body += `I’ll keep it tight and technical so we can move fast. `;
  }

  if (styleBias) {
    body += `When multiple options make sense, I’ll lean toward your style bias (${styleBias}). `;
  }

  if (oneConfidence) {
    body += `I’ll try to work in your confidence bait (${oneConfidence}) when the situation fits. `;
  }

  if (oneBanned) {
    body += `And I’ll avoid pushing ${oneBanned} unless you explicitly ask for it.`;
  }

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-3 py-3 text-[12px]">
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
        SAGE PREVIEW
      </div>
      <p className="text-white/85">{body}</p>
      <div className="mt-2 text-[10px] text-white/40">
        Style: {styleLabel} · Experience: {expLabel}
      </div>
    </section>
  );
}

// ---------- Fishing Identity Card ----------

function FishingIdentityCard({ data }: { data: ControlCenterData }) {
  const {
    experienceLevel,
    coachingStyle,
    preferredStyles,
    confidenceBaits,
    bannedTechniques,
  } = data;

  const expLabel =
    experienceLevel === "beginner"
      ? "Learning-focused"
      : experienceLevel === "intermediate"
      ? "Dialing in"
      : "Advanced angler";

  const coachingLabel =
    coachingStyle === "calm"
      ? "Calm guidance"
      : coachingStyle === "direct"
      ? "Direct calls"
      : "Pro shorthand";

  const styleBias = preferredStyles.slice(0, 3);
  const conf = confidenceBaits.slice(0, 2);
  const banned = bannedTechniques.slice(0, 2);

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-4 py-3 text-[12px]">
      <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/60">
        YOUR FISHING IDENTITY
      </div>
      <div className="space-y-1 text-white/85">
        <div>
          <span className="text-white/55">Experience: </span>
          <span>{expLabel}</span>
        </div>
        <div>
          <span className="text-white/55">Coaching: </span>
          <span>{coachingLabel}</span>
        </div>
        {styleBias.length > 0 && (
          <div>
            <span className="text-white/55">Style bias: </span>
            <span>{styleBias.join(" · ")}</span>
          </div>
        )}
        {conf.length > 0 && (
          <div>
            <span className="text-white/55">Confidence: </span>
            <span>{conf.join(", ")}</span>
          </div>
        )}
        {banned.length > 0 && (
          <div>
            <span className="text-white/55">Avoiding: </span>
            <span>{banned.join(", ")}</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Experience Card ----------

function ExperienceCard({
  data,
  onUpdate,
}: {
  data: ControlCenterData;
  onUpdate: (u: Partial<ControlCenterData>) => void;
}) {
  const options: { value: ExperienceLevel; label: string; desc: string }[] = [
    {
      value: "beginner",
      label: "Beginner",
      desc: "Explain things clearly and avoid heavy jargon.",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      desc: "Assume basic knowledge; still explain key moves.",
    },
    {
      value: "advanced",
      label: "Advanced",
      desc: "Skip the basics and focus on nuance.",
    },
  ];

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-4 py-3">
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
        EXPERIENCE LEVEL
      </div>
      <div className="space-y-2">
        {options.map((opt) => {
          const active = data.experienceLevel === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate({ experienceLevel: opt.value })}
              className={`w-full rounded-xl px-3 py-2 text-left text-[12px] transition ${
                active
                  ? "bg-white/10 border border-white/30"
                  : "bg-black/10 border border-white/10"
              }`}
            >
              <div className="text-[12px] font-medium">{opt.label}</div>
              <div className="text-[11px] text-white/60">{opt.desc}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Coaching Style Card ----------

function CoachingStyleCard({
  data,
  onUpdate,
}: {
  data: ControlCenterData;
  onUpdate: (u: Partial<ControlCenterData>) => void;
}) {
  const options: { value: CoachingStyle; label: string; desc: string }[] = [
    {
      value: "calm",
      label: "Calm",
      desc: "Steady, reassuring tone — like a patient guide.",
    },
    {
      value: "direct",
      label: "Direct",
      desc: "Crisp calls and straight talk, little fluff.",
    },
    {
      value: "pro",
      label: "Pro",
      desc: "Talks like a seasoned tournament partner.",
    },
  ];

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-4 py-3">
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
        COACHING STYLE
      </div>
      <div className="space-y-2">
        {options.map((opt) => {
          const active = data.coachingStyle === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate({ coachingStyle: opt.value })}
              className={`w-full rounded-xl px-3 py-2 text-left text-[12px] transition ${
                active
                  ? "bg.white/10 border border-white/30"
                  : "bg-black/10 border border-white/10"
              }`.replace("bg.white", "bg-white")}
            >
              <div className="text-[12px] font-medium">{opt.label}</div>
              <div className="text-[11px] text-white/60">{opt.desc}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Preferred Styles Card ----------

const ALL_STYLE_KEYS = [
  "power",
  "finesse",
  "offshore",
  "bank",
  "dock",
  "grass",
  "wood",
  "rock",
  "moving_baits",
  "slow_baits",
];

function PreferredStylesCard({
  data,
  onUpdate,
}: {
  data: ControlCenterData;
  onUpdate: (u: Partial<ControlCenterData>) => void;
}) {
  const toggleStyle = (key: string) => {
    const current = data.preferredStyles;
    if (current.includes(key)) {
      onUpdate({ preferredStyles: current.filter((k) => k !== key) });
    } else {
      onUpdate({ preferredStyles: [...current, key] });
    }
  };

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-4 py-3">
      <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/60">
        PREFERRED STYLES
      </div>
      <p className="mb-2 text-[11px] text-white/60">
        SAGE will lean toward these when multiple tactics are valid.
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_STYLE_KEYS.map((key) => {
          const active = data.preferredStyles.includes(key);
          const label = key.replace(/_/g, " ");
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleStyle(key)}
              className={`rounded-full px-3 py-1 text-[11px] capitalize border transition ${
                active
                  ? "border-[#8FAF8F] bg-[#8FAF8F]/20 text-[#8FAF8F]"
                  : "border-white/15 bg-black/20 text-white/80"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Lure Selection Panel (confidence / banned) ----------

interface LureSelectionPanelProps {
  title: string;
  mode: "confidence" | "banned";
  categories: LureCategory[];
  lures: LureDefinition[];
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
  recommendedKeys?: string[];
}

function LureSelectionPanel({
  title,
  mode,
  categories,
  lures,
  selectedKeys,
  onChange,
  recommendedKeys,
}: LureSelectionPanelProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>(
    categories[0]?.key ?? ""
  );

  const selectedSet = new Set(selectedKeys);
  const activeLures = lures.filter((l) => l.categoryKey === activeCategory);
  const activeCategoryObj = categories.find((c) => c.key === activeCategory);

  const toggleLure = (key: string) => {
    if (selectedSet.has(key)) {
      onChange(selectedKeys.filter((k) => k !== key));
    } else {
      onChange([...selectedKeys, key]);
    }
  };

  const isConfidence = mode === "confidence";
  const accentBg = isConfidence ? "bg-[#8FAF8F]/20" : "bg-[#A74A4A]/15";
  const accentText = isConfidence ? "text-[#8FAF8F]" : "text-[#FFB3B3]";

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-4 py-3 text-[12px]">
      <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/60">
        {title.toUpperCase()}
      </div>
      <p className="mb-2 text-[11px] text-white/60">
        {isConfidence
          ? "Choose baits you trust. SAGE will lean on these in its wording only."
          : "Choose techniques you don’t want pushed. SAGE will de-emphasize these in wording only."}
      </p>

      {/* Recommended row */}
      {recommendedKeys && recommendedKeys.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {recommendedKeys.map((key) => {
            const lure = lures.find((l) => l.key === key);
            if (!lure) return null;
            const active = selectedSet.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleLure(key)}
                className={`rounded-full border px-2.5 py-0.5 text-[10px] ${
                  active
                    ? `${accentBg} ${accentText} border-transparent`
                    : "border-white/20 bg-black/20 text-white/70"
                }`}
              >
                Recommended: {lure.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Hoisted selected pills */}
      {selectedKeys.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedKeys.map((key) => {
            const lure = lures.find((l) => l.key === key);
            if (!lure) return null;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleLure(key)}
                className={`rounded-full px-2.5 py-0.5 text-[10px] ${accentBg} ${accentText}`}
              >
                {lure.label} ✕
              </button>
            );
          })}
        </div>
      )}

      {/* Category tabs */}
      <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const active = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] transition ${
                active
                  ? "border-white/40 bg-white/10"
                  : "border-white/10 bg-black/20 text-white/70"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Category description */}
      {activeCategoryObj?.description && (
        <div className="mb-2 text-[11px] text-white/55">
          {activeCategoryObj.description}
        </div>
      )}

      {/* Lure cloud */}
      <div className="flex flex-wrap gap-1.5">
        {activeLures.map((lure) => {
          const active = selectedSet.has(lure.key);
          return (
            <button
              key={lure.key}
              type="button"
              onClick={() => toggleLure(lure.key)}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition ${
                active
                  ? `${accentBg} ${accentText} border-transparent`
                  : "border-white/15 bg-black/20 text-white/80"
              }`}
            >
              {/* Placeholder icon; later wire to LureIcon system */}
              <span className="h-3 w-3 rounded-full bg-white/25" />
              <span>{lure.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Display Settings Card ----------

function DisplaySettingsCard({
  data,
  onUpdate,
}: {
  data: ControlCenterData;
  onUpdate: (u: Partial<ControlCenterData>) => void;
}) {
  const theme = data.theme ?? "dark";
  const textSize = data.textSize ?? "normal";
  const motion = data.motion ?? "full";

  return (
    <section className="rounded-2xl bg-[#141414] border border-white/10 px-4 py-3 text-[12px]">
      <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
        DISPLAY SETTINGS
      </div>

      {/* Theme */}
      <div className="mb-3">
        <div className="mb-1 text-[11px] text-white/55">Theme</div>
        <div className="flex gap-2">
          {["dark", "light", "auto"].map((t) => {
            const active = theme === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onUpdate({ theme: t as any })}
                className={`flex-1 rounded-xl border px-3 py-1.5 text-[11px] capitalize ${
                  active
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-black/20 text-white/70"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text size */}
      <div className="mb-3">
        <div className="mb-1 text-[11px] text-white/55">Text size</div>
        <div className="flex gap-2">
          {["normal", "large"].map((sz) => {
            const active = textSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onUpdate({ textSize: sz as any })}
                className={`flex-1 rounded-xl border px-3 py-1.5 text-[11px] capitalize ${
                  active
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-black/20 text-white/70"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Motion */}
      <div>
        <div className="mb-1 text-[11px] text-white/55">Motion</div>
        <div className="flex gap-2">
          {["full", "reduced"].map((m) => {
            const active = motion === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onUpdate({ motion: m as any })}
                className={`flex-1 rounded-xl border px-3 py-1.5 text-[11px] capitalize ${
                  active
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-black/20 text-white/70"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
