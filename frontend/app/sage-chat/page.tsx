"use client";

import React, { useState } from "react";
import { useUserName } from "../context/UserNameContext";

export default function SageChatPage() {
  const { userName } = useUserName();
  console.log("SageChatPage userName:", userName);

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;

    setIsLoading(true);
    setReply(null);

    try {
      const res = await fetch("http://localhost:8000/sage/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: {
            pattern: {
              phase: "pre-spawn",
              depth_zone: "mid_shallow",
              tier: "elite",
            },
          },
          preferences: null, // wiring real prefs comes later
          user_name: userName, // <-- this is the important part
        }),
      });

      const data = await res.json();
      setReply(data.reply ?? "No reply from SAGE.");
    } catch (err) {
      console.error(err);
      setReply("Something went wrong talking to SAGE.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Ask SAGE
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            SAGE will greet you by name if you&apos;ve set it in the Control
            Center.
          </p>
          {userName && (
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              Current angler: <span className="font-semibold">{userName}</span>
            </p>
          )}
        </header>

        <section>
          <textarea
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            rows={3}
            placeholder="What are you seeing on the water?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            className="mt-3 flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading ? "Talking to SAGE..." : "Send"}
          </button>
        </section>

        {reply && (
          <section className="mt-4">
            <h2 className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
              SAGE&apos;s response
            </h2>
            <pre className="whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-sm text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
              {reply}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}
