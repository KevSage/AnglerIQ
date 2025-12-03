import { useState } from "react";
import { useUserSettings } from "../../context/UserSettingsContext";

const ConfidenceSpectrumEditor = () => {
  const { settings, updateSettings } = useUserSettings();

  const [highInput, setHighInput] = useState("");
  const [lowInput, setLowInput] = useState("");

  const high = settings.highConfidenceBaits || [];
  const low = settings.lowConfidenceBaits || [];

  const addHigh = () => {
    const value = highInput.trim();
    if (!value || high.includes(value)) return;
    updateSettings({ highConfidenceBaits: [...high, value] });
    setHighInput("");
  };

  const addLow = () => {
    const value = lowInput.trim();
    if (!value || low.includes(value)) return;
    updateSettings({ lowConfidenceBaits: [...low, value] });
    setLowInput("");
  };

  const removeHigh = (value: string) => {
    updateSettings({
      highConfidenceBaits: high.filter((bait) => bait !== value),
    });
  };

  const removeLow = (value: string) => {
    updateSettings({
      lowConfidenceBaits: low.filter((bait) => bait !== value),
    });
  };

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-gray-100">Confidence Spectrum</h2>

      {/* High-Confidence Baits */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-gray-100">
          High-Confidence Baits
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={highInput}
            onChange={(e) => setHighInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHigh();
              }
            }}
            placeholder="Add a bait"
            className="flex-1 rounded border border-gray-600 bg-black px-2 py-1 text-xs text-gray-100"
          />
          <button
            type="button"
            onClick={addHigh}
            className="rounded border border-green-400 px-3 py-1 text-xs text-gray-100"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {high.map((bait) => (
            <button
              key={bait}
              type="button"
              onClick={() => removeHigh(bait)}
              className="rounded-full border border-green-400 bg-green-400 px-3 py-1 text-xs text-black"
            >
              {bait}
            </button>
          ))}
        </div>
      </div>

      {/* Low-Confidence Baits */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-gray-100">
          Low-Confidence Baits
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={lowInput}
            onChange={(e) => setLowInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLow();
              }
            }}
            placeholder="Add a bait"
            className="flex-1 rounded border border-gray-600 bg-black px-2 py-1 text-xs text-gray-100"
          />
          <button
            type="button"
            onClick={addLow}
            className="rounded border border-gray-400 px-3 py-1 text-xs text-gray-100"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {low.map((bait) => (
            <button
              key={bait}
              type="button"
              onClick={() => removeLow(bait)}
              className="rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-300"
            >
              {bait}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConfidenceSpectrumEditor;
