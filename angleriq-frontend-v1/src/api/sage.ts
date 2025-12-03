// src/api/sage.ts

// Canonical SAGE preferences shape (frontend)
export type SagePreferences = {
  experience_level: "general" | "beginner" | "intermediate" | "advanced";
  coaching_style:
    | "calm_guide"
    | "old_school_pro"
    | "data_analyst"
    | "hype_coach"
    | "minimalist";
  preferred_styles: string[];
  high_confidence_baits: string[];
  low_confidence_baits: string[];
};

// Minimal pattern context for SAGE (matches canon fields we care about)
export type SagePatternContext = {
  phase?: string;
  depth_zone?: string;
  tier?: "pro" | "elite" | "vision";
  conditions?: Record<string, unknown>;
};

// Minimal Vision context for SAGE (analysis only for now)
export type SageVisionContext = {
  surface_enhanced?: Record<string, unknown>;
  sonar_enhanced?: Record<string, unknown>;
  vision_enhanced_analysis?: Record<string, unknown>;
};

export type SageChatRequest = {
  message: string;
  context?: {
    pattern?: SagePatternContext;
    vision?: SageVisionContext;
  };
  preferences?: SagePreferences;
};

export type SageChatResponse = {
  reply: string;
};

// TEMP: stubbed implementation.
// Later we will replace this with a real fetch to the FastAPI backend.
export async function sendSageMessage(
  _req: SageChatRequest
): Promise<SageChatResponse> {
  // Placeholder: simulate network + SAGE reply
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    reply:
      "SAGE reply placeholder from API layer. (Real backend wiring comes next.)",
  };
}
