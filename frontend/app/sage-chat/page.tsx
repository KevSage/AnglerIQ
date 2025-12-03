// app/sage-chat/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUserName } from "../context/UserNameContext";

type Sender = "user" | "sage";

interface ChatMessage {
  id: number;
  from: Sender;
  text: string;
}

export default function SageChatPage() {
  const { userName } = useUserName();
  const displayName = userName || "angler";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const nextId = useRef(1);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const greetedRef = useRef(false);

  // Seed a greeting once per session
  useEffect(() => {
    if (!greetedRef.current) {
      greetedRef.current = true;
      const initial: ChatMessage = {
        id: nextId.current++,
        from: "sage",
        text: `Hey ${displayName}, I’m SAGE — tell me what you’re seeing out there and I’ll help you build a gameplan.`,
      };
      setMessages([initial]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Keep chat scrolled to bottom
  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSend() {
    if (!message.trim() || isLoading) return;

    const userText = message.trim();
    setMessage("");

    const userMsg: ChatMessage = {
      id: nextId.current++,
      from: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/assistant/sage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText }),
      });

      const data = await res.json();

      const sageText: string =
        typeof data.reply === "string"
          ? data.reply
          : "I had trouble reading that response, but we’ll get it dialed in.";

      const sageMsg: ChatMessage = {
        id: nextId.current++,
        from: "sage",
        text: sageText,
      };

      setMessages((prev) => [...prev, sageMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: nextId.current++,
        from: "sage",
        text: "I couldn’t reach the pattern engine right now. Check that the backend is running on port 8000 and try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1110] text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
        <div>
          <div className="text-[14px] font-semibold tracking-tight">
            AnglerIQ
          </div>
          <div className="text-[11px] text-white/60">Fishing partner</div>
        </div>
        <div className="text-[11px] text-white/55">
          {displayName ? `Angler: ${displayName}` : "Angler"}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Title + description */}
        <section>
          <h1 className="text-[17px] font-semibold tracking-tight">
            SAGE pattern chat
          </h1>
          <p className="mt-1 text-[13px] text-white/70 leading-snug max-w-[92%]">
            Describe the water, weather, sonar, or what the bite feels like.
            SAGE will turn it into an on-water plan — without changing the
            underlying Pro / Elite / Vision engines.
          </p>
        </section>

        {/* Chat card */}
        <section className="relative flex-1 rounded-2xl bg-[#161A18] border border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden">
          {/* subtle top gradient */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/6 to-transparent" />

          {/* Message list */}
          <div
            ref={chatScrollRef}
            className="relative flex-1 overflow-y-auto px-4 pt-4 pb-3 space-y-3"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex gap-2 items-end">
                <SageAvatar />
                <div className="rounded-2xl bg-[#1E2320] px-3 py-2 text-[12px] text-white/80 inline-flex items-center gap-2">
                  <span className="text-white/60">Thinking</span>
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Footer note inside card */}
          <div className="border-t border-white/10 px-4 py-2">
            <p className="text-[11px] text-white/45 leading-snug">
              SAGE keeps tier boundaries, depth logic, and pricing rules intact
              — this chat shapes wording and guidance only.
            </p>
          </div>
        </section>

        {/* Input row */}
        <section className="space-y-1">
          <label className="text-[12px] text-white/60">
            What are you seeing out there?
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Example: clear lake, 8–10 ft grass, light wind, no bites yet..."
              className="flex-1 rounded-xl bg-[#1E2320] border border-white/12 px-3 py-2 text-[13px] placeholder-white/35 text-white focus:outline-none focus:ring-1 focus:ring-[#8FAF8F]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="px-4 py-2 rounded-xl bg-[#8FAF8F] text-[#0F1110] font-semibold text-[13px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#9BC59B] transition-colors"
            >
              {isLoading ? "…" : "Send"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ------- Small subcomponents ------- */

function SageAvatar() {
  return (
    <div className="h-8 w-8 rounded-full bg-[#0F1110] border border-[#8FAF8F]/40 flex items-center justify-center text-[11px] font-semibold text-[#8FAF8F] shadow-[0_0_0_1px_rgba(0,0,0,0.8)]">
      S
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isSage = message.from === "sage";

  if (isSage) {
    return (
      <div className="flex gap-2 items-start">
        <SageAvatar />
        <div className="max-w-[80%] rounded-2xl bg-[#1E2320] px-3 py-2 text-[13px] text-white/90 leading-snug whitespace-pre-line">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-[#8FAF8F] text-[#0F1110] px-3 py-2 text-[13px] leading-snug whitespace-pre-line">
        {message.text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-[3px]" aria-hidden="true">
      <span className="h-[6px] w-[6px] rounded-full bg-white/70 animate-bounce [animation-delay:-0.2s]" />
      <span className="h-[6px] w-[6px] rounded-full bg-white/60 animate-bounce [animation-delay:-0.05s]" />
      <span className="h-[6px] w-[6px] rounded-full bg-white/50 animate-bounce" />
    </div>
  );
}
