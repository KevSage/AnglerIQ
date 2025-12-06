// src/hooks/useTier.ts

import { useEffect, useState } from "react";

export type Tier = "pro" | "elite" | "vision";

const TIER_STORAGE_KEY = "aiq_tier";
const ONBOARD_KEY = "aiq_onboarded";

const isValidTier = (value: unknown): value is Tier =>
  value === "pro" || value === "elite" || value === "vision";

const loadInitialTier = (): Tier => {
  if (typeof window === "undefined") return "pro";

  try {
    const raw = window.localStorage.getItem(TIER_STORAGE_KEY);
    if (!raw) return "pro";

    // First try: JSON (our normal path)
    try {
      const parsed = JSON.parse(raw);
      if (isValidTier(parsed)) return parsed;
    } catch {
      // Second try: raw string (what you type in the console)
      if (isValidTier(raw)) return raw;
    }

    return "pro";
  } catch {
    return "pro";
  }
};

export const useTier = () => {
  const [tier, setTier] = useState<Tier>(loadInitialTier);

  // Persist changes safely
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(TIER_STORAGE_KEY, JSON.stringify(tier));
    } catch {
      // fail silently – tier still lives in state
    }
  }, [tier]);

  const markOnboarded = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ONBOARD_KEY, "true");
    } catch {
      // ignore
    }
  };

  const isOnboarded = (() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(ONBOARD_KEY) === "true";
    } catch {
      return false;
    }
  })();

  return {
    tier,
    setTier,
    isOnboarded,
    markOnboarded,
  };
};
