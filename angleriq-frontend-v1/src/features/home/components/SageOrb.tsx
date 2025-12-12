type SageOrbProps = {
  onQuickOpen?: () => void;
};

export function SageOrb({ onQuickOpen }: SageOrbProps) {
  return (
    <button
      onClick={onQuickOpen}
      className="h-12 w-12 rounded-full bg-neutral-900/90 border border-neutral-700 shadow-md flex items-center justify-center text-xs text-neutral-100"
    >
      SAGE
    </button>
  );
}