// src/hooks/useTier.ts

import { useEffect, useState } from "react";

export type Tier = "pro" | "elite" | "vision";

const TIER_STORAGE_KEY = "aiq_tier";
const ONBOARD_KEY = "aiq_onboarded";

// Utility: ensure string is one of our allowed tiers
const normalizeTier = (value: unknown): Tier => {
  if (!value) return "pro";

  const lower = String(value).toLowerCase();

  if (lower === "elite") return "elite";
  if (lower === "vision") return "vision";
  return "pro";
};

// Load tier from storage safely
const loadStoredTier = (): Tier => {
  if (typeof window === "undefined") return "pro";

  try {
    const raw = window.localStorage.getItem(TIER_STORAGE_KEY);
    if (!raw) return "pro";

    // Try JSON first
    try {
      const parsed = JSON.parse(raw);
      return normalizeTier(parsed);
    } catch {
      // Fallback: plain string
      return normalizeTier(raw);
    }
  } catch {
    return "pro";
  }
};

export const useTier = () => {
  // Load once
  const [tier, setTier] = useState<Tier>(loadStoredTier);

  // Persist tier whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(TIER_STORAGE_KEY, JSON.stringify(tier));
    } catch {
      // ignore
    }
  }, [tier]);

  // Onboarding flags
  const markOnboarded = () => {
    try {
      window.localStorage.setItem(ONBOARD_KEY, "true");
    } catch {
      // ignore
    }
  };

  const isOnboarded = (() => {
    try {
      return window.localStorage.getItem(ONBOARD_KEY) === "true";
    } catch {
      return false;
    }
  })();

  return {
    tier,
    setTier,        // ← THIS was missing due to early return
    isOnboarded,
    markOnboarded,
  };
};