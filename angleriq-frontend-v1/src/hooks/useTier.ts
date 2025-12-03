import { useEffect, useState } from "react";

export type Tier = "pro" | "elite" | "vision";

const TIER_STORAGE_KEY = "aiq_tier";

export const useTier = () => {
  // Initialize from localStorage synchronously so routing decisions are correct on first render
  const [tier, setTier] = useState<Tier>(() => {
    try {
      const stored = localStorage.getItem(TIER_STORAGE_KEY) as Tier | null;
      if (stored === "pro" || stored === "elite" || stored === "vision") {
        return stored;
      }
    } catch {
      // if localStorage isn't available for some reason, fall back to 'pro'
    }
    return "pro";
  });

  // Persist whenever tier changes
  useEffect(() => {
    try {
      localStorage.setItem(TIER_STORAGE_KEY, tier);
    } catch {
      // ignore persistence errors in dev
    }
  }, [tier]);

  return { tier, setTier };
};
