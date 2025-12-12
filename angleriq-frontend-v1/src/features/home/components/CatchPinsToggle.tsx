type CatchPinsToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function CatchPinsToggle({ enabled, onToggle }: CatchPinsToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1 rounded-full bg-neutral-900/85 border border-neutral-700 text-[11px] text-neutral-100"
    >
      {enabled ? "Pins On" : "Pins Off"}
    </button>
  );
}