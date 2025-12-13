// src/components/LakeChip.tsx
import React from "react";
import { HomeLake } from "../types/lake";

type Props = {
  homeLake: HomeLake | null;
  onClick: () => void;
};

export function LakeChip({ homeLake, onClick }: Props) {
  const label = homeLake?.name ?? "Select Lake";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open lake search"
      style={{
        // Keep styling minimal; match your existing top bar tokens
        padding: "8px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.35)",
        color: "white",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}