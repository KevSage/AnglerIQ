import { useState } from "react";

export type SageMessage = {
  id: string;
  from: "user" | "sage";
  text: string;
};

type UseSageChatState = {
  messages: SageMessage[];
  sending: boolean;
  error: string | null;
  sendMessage: (text: string, payload: unknown) => Promise<void>;
  clearChat: () => void;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const useSageChat = (): UseSageChatState => {
  const [messages, setMessages] = useState<SageMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const sendMessage = async (text: string, payload: unknown) => {
    if (!text.trim()) return;

    const userMsg: SageMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setError(null);

    try {
      const resp = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        // Helpful debug: log the actual FastAPI error body
        let bodyText = "";
        try {
          bodyText = await resp.text();
          // eslint-disable-next-line no-console
          console.error("SAGE /assistant/chat error body:", bodyText);
        } catch {
          /* ignore */
        }
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const replyText: string = data.reply ?? "SAGE reply unavailable.";

      const sageMsg: SageMessage = {
        id: `sage-${Date.now()}`,
        from: "sage",
        text: replyText,
      };

      setMessages((prev) => [...prev, sageMsg]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(
        "Something went wrong while interpreting conditions. Try again."
      );
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    sending,
    error,
    sendMessage,
    clearChat,
  };
};