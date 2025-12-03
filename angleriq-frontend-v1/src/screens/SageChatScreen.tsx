import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";
import {
  sendSageMessage,
  type SageChatRequest,
  type SagePreferences,
} from "../api/sage";

type ChatMessage = {
  id: number;
  from: "user" | "sage" | "system";
  text: string;
};

const SageChatScreen = () => {
  const { tier } = useTier();
  const { pattern } = usePattern(tier);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildDefaultPreferences = (): SagePreferences => {
    // TEMP: default preferences until wired to Control Center
    return {
      experience_level: "general",
      coaching_style: "calm_guide",
      preferred_styles: [],
      high_confidence_baits: [],
      low_confidence_baits: [],
    };
  };

  const buildSageRequest = (message: string): SageChatRequest => {
    const preferences = buildDefaultPreferences();

    const patternContext = pattern
      ? {
          phase: pattern.conditions?.season_phase,
          depth_zone: pattern.depth_zone,
          tier: pattern.tier,
          conditions: pattern.conditions as Record<string, unknown>,
        }
      : undefined;

    const visionContext =
      tier === "vision" && pattern?.vision
        ? {
            surface_enhanced: pattern.vision.surface_enhanced,
            sonar_enhanced: pattern.vision.sonar_enhanced,
            vision_enhanced_analysis: pattern.vision.vision_enhanced_analysis,
          }
        : undefined;

    return {
      message,
      context: {
        ...(patternContext ? { pattern: patternContext } : {}),
        ...(visionContext ? { vision: visionContext } : {}),
      },
      preferences,
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setError(null);

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;

    const userMessage: ChatMessage = {
      id: nextId,
      from: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const req = buildSageRequest(trimmed);
      const response = await sendSageMessage(req);

      const sageMessage: ChatMessage = {
        id: nextId + 1,
        from: "sage",
        text: response.reply,
      };

      setMessages((prev) => [...prev, sageMessage]);
    } catch {
      setError(
        "Something went wrong while interpreting conditions. Try again."
      );

      const systemMessage: ChatMessage = {
        id: nextId + 1,
        from: "system",
        text: "Unable to get a reply from SAGE right now.",
      };

      setMessages((prev) => [...prev, systemMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  const handleChangeSettings = () => {
    navigate("/control-center");
  };

  const showVisionSubheader = tier === "vision" && !!pattern?.vision;

  return (
    <div className="flex min-h-screen flex-col px-4 py-4 text-gray-100">
      {/* Header */}
      <header className="mb-3">
        <h1 className="text-lg font-semibold">SAGE</h1>
        {showVisionSubheader && (
          <p className="text-xs text-gray-400">
            Vision Enhanced Analysis Active
          </p>
        )}
      </header>

      {/* Error banner (canon copy) */}
      {error && (
        <section className="mb-2 rounded-xl border border-red-500 bg-red-900/30 p-3 text-xs text-red-200">
          {error}
        </section>
      )}

      {/* Chat area */}
      <main className="flex flex-1 flex-col rounded-xl border border-gray-700 bg-black/40 p-3 text-xs">
        <div className="mb-2 flex justify-between gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full border border-gray-600 px-3 py-1 text-[11px] text-gray-100"
          >
            Clear Chat
          </button>
          <button
            type="button"
            onClick={handleChangeSettings}
            className="rounded-full border border-gray-600 px-3 py-1 text-[11px] text-gray-100"
          >
            Change Settings
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto rounded-lg border border-gray-800 bg-black/30 p-2">
          {messages.length === 0 && (
            <p className="text-[11px] text-gray-400">
              Ask SAGE anything about today’s conditions or your approach.
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-[11px] ${
                msg.from === "user"
                  ? "ml-auto bg-green-500 text-black"
                  : msg.from === "sage"
                  ? "mr-auto bg-gray-800 text-gray-100"
                  : "mx-auto bg-red-900/50 text-red-100"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {sending && (
            <div className="mr-auto max-w-[60%] rounded-lg bg-gray-800 px-3 py-2 text-[11px] text-gray-300">
              Interpreting your Pattern-of-the-Moment…
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SAGE about your approach..."
            className="flex-1 rounded-full border border-gray-700 bg-black/60 px-3 py-2 text-[11px] text-gray-100 outline-none placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-full border border-green-400 bg-green-400 px-3 py-2 text-[11px] font-medium text-black disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default SageChatScreen;
