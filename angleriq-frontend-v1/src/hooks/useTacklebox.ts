// src/hooks/useTacklebox.ts

import { useEffect, useState } from "react";
import type { LureId } from "../data/lures";

const STORAGE_KEY = "aiq_tacklebox_v1";

type TackleboxState = {
  lureIds: LureId[];
};

const defaultState: TackleboxState = {
  lureIds: [],
};

export const useTacklebox = () => {
  const [state, setState] = useState<TackleboxState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;

      if (raw) {
        const parsed = JSON.parse(raw) as TackleboxState;
        if (Array.isArray(parsed.lureIds)) {
          setState({
            lureIds: parsed.lureIds,
          });
        }
      }
    } catch {
      // fail silently, use default state
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist when state changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // ignore persistence failures
    }
  }, [state, hydrated]);

  const toggleLure = (id: LureId) => {
    setState((prev) => {
      const exists = prev.lureIds.includes(id);
      if (exists) {
        return { lureIds: prev.lureIds.filter((x) => x !== id) };
      }
      return { lureIds: [...prev.lureIds, id] };
    });
  };

  const clearTacklebox = () => {
    setState(defaultState);
  };

  return {
    lureIds: state.lureIds,
    hydrated,
    toggleLure,
    clearTacklebox,
  };
};
