// src/components/controlCenter/ConfidenceSpectrumEditor.tsx
import React, { useState, useEffect } from "react";
import { useUserSettings } from "@/context/UserSettingsContext";

export const ConfidenceSpectrumEditor: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();

  const [highDraft, setHighDraft] = useState("");
  const [lowDraft, setLowDraft] = useState("");

  // Initialize local drafts from current settings
  useEffect(() => {
    setHighDraft(settings.highConfidenceBaits.join(", "));
    setLowDraft(settings.lowConfidenceBaits.join(", "));
  }, [settings.highConfidenceBaits, settings.lowConfidenceBaits]);

  const syncHigh = (value: string) => {
    setHighDraft(value);
    const tokens = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateSettings({ highConfidenceBaits: tokens });
  };

  const syncLow = (value: string) => {
    setLowDraft(value);
    const tokens = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateSettings({ lowConfidenceBaits: tokens });
  };

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-gray-100">Confidence Spectrum</h2>

      <div className="space-y-1">
        <h3 className="text-xs font-medium text-gray-100">
          High-Confidence Baits
        </h3>
        <input
          type="text"
          value={highDraft}
          onChange={(e) => syncHigh(e.target.value)}
          className="w-full rounded-md border border-outline-subtle bg-background-elevated px-3 py-2 text-xs text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-medium text-gray-100">
          Low-Confidence Baits
        </h3>
        <input
          type="text"
          value={lowDraft}
          onChange={(e) => syncLow(e.target.value)}
          className="w-full rounded-md border border-outline-subtle bg-background-elevated px-3 py-2 text-xs text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
    </section>
  );
};
