// src/screens/VisionDebugScreen.tsx

import { useState } from "react";
import ScreenContainer from "../components/layout/ScreenContainer";
import { uploadVisionImage, type VisionAnalysis } from "../lib/api";

const VisionDebugScreen = () => {
  const [analysis, setAnalysis] = useState<VisionAnalysis | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadVisionImage(file);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setError("Could not analyze this image. Try another screenshot.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <ScreenContainer
      title="Vision Debug"
      tagline="Real sonar & surface photos → real analysis."
    >
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Upload a sonar or surface image
        </p>
        <p className="mt-1 text-xs text-slate-300">
          This will hit <code className="text-[10px]">/vision/analyze</code> on
          your backend and show the structured result.
        </p>

        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-100">
            {uploading ? "Analyzing image…" : "Choose image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
      </section>

      {analysis && (
        <section className="mt-4 rounded-2xl border border-slate-800 bg-black/60 p-4 text-[11px] text-slate-200">
          <p className="mb-2 text-xs font-semibold text-slate-100">
            Latest Vision analysis
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>
              <span className="text-slate-500">Depth:</span>{" "}
              {analysis.depth_ft != null ? `${analysis.depth_ft} ft` : "—"}
            </span>
            <span>
              <span className="text-slate-500">Bottom:</span>{" "}
              {analysis.bottom_hardness ?? "—"}
            </span>
            <span>
              <span className="text-slate-500">Bait present:</span>{" "}
              {analysis.bait_present ? "Yes" : "No / Unknown"}
            </span>
            <span>
              <span className="text-slate-500">Fish present:</span>{" "}
              {analysis.fish_present ? "Yes" : "No / Unknown"}
            </span>
            <span>
              <span className="text-slate-500">Arches:</span>{" "}
              {analysis.arch_count ?? "—"}
            </span>
            <span>
              <span className="text-slate-500">Activity:</span>{" "}
              {analysis.activity_level ?? "—"}
            </span>
            <span>
              <span className="text-slate-500">Worth fishing:</span>{" "}
              {analysis.worth_fishing ? "Yes" : "Unclear"}
            </span>
            <span>
              <span className="text-slate-500">Move or stay:</span>{" "}
              {analysis.stop_or_keep_moving === "keep_moving"
                ? "Keep moving"
                : analysis.stop_or_keep_moving === "stop"
                ? "Stop here"
                : "—"}
            </span>
          </div>
        </section>
      )}
    </ScreenContainer>
  );
};

export default VisionDebugScreen;
