import React from "react";

type Props = {
  isVisible: boolean;         // Drop 1: always false
  lakeName: string | null;    // Drop 1: unused
  onConfirm: () => void;      // Drop 1: unused
  onDismiss: () => void;      // Drop 1: unused
};

export function LakeSoftLockPrompt({
  isVisible,
  lakeName,
  onConfirm,
  onDismiss,
}: Props) {
  if (!isVisible || !lakeName) return null;

  return (
    <div
      className="aiq-soft-lock-prompt"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        top: 72, // adjust to your top bar height
        zIndex: 20,
        background: "rgba(0,0,0,0.72)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: 12,
        color: "white",
      }}
    >
      <div style={{ fontSize: 13, marginBottom: 10 }}>
        Set <strong>{lakeName}</strong> as active lake?
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" onClick={onDismiss} style={{ flex: 1, padding: 10, borderRadius: 10 }}>
          Not now
        </button>
        <button type="button" onClick={onConfirm} style={{ flex: 1, padding: 10, borderRadius: 10 }}>
          Set Active
        </button>
      </div>
    </div>
  );
}