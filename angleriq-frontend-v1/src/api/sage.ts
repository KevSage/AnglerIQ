// src/api/sage.ts

export type Tier = "pro" | "elite" | "vision";

export type SagePreferences = {
  experience_level: "general" | "beginner" | "intermediate" | "advanced";
  coaching_style:
    | "agnostic"
    | "calm_guide"
    | "old_school_pro"
    | "data_analyst"
    | "hype_coach"
    | "minimalist";
  preferred_styles: string[];
  confidence_baits?: string[] | null;
  banned_techniques?: string[] | null;
};

export type AssistantAskRequest = {
  tier: Tier;
  pattern: Record<string, unknown>;
  question: string;
  preferences?: SagePreferences;
};

export type AssistantAskResponse = {
  tier: Tier;
  question: string;
  answer: string;
  pattern_summary: Record<string, unknown>;
};

export async function askSage(
  payload: AssistantAskRequest
): Promise<AssistantAskResponse> {
  const resp = await fetch("/assistant/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`SAGE /assistant/ask failed with ${resp.status}`);
  }

  return resp.json();
}

// ---- Chat ----

export type AssistantChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantChatRequest = {
  message: string;
  history?: AssistantChatTurn[];
  tier?: Tier;
  pattern?: Record<string, unknown>;
  preferences?: SagePreferences;
};

export type AssistantChatResponse = {
  reply: string;
  pattern_summary?: Record<string, unknown> | null;
  preferences_used: SagePreferences;
};

export async function chatWithSage(
  payload: AssistantChatRequest
): Promise<AssistantChatResponse> {
  const resp = await fetch("/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`SAGE /assistant/chat failed with ${resp.status}`);
  }

  return resp.json();
}