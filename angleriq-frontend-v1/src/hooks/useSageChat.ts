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
      // Adjust URL to match your backend/proxy setup
      const resp = await fetch("http://localhost:8000/sage/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
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
