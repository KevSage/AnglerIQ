type PatternChipProps = {
  hasPattern: boolean;
};

export function PatternChip({ hasPattern }: PatternChipProps) {
  if (!hasPattern) {
    return (
      <button className="px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs text-neutral-200 shadow-sm">
        Generate Pattern of the Day
      </button>
    );
  }

  return (
    <div className="px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs text-neutral-100 shadow-sm flex items-center gap-2">
      {/* placeholder silhouette */}
      <div className="h-4 w-8 rounded-full bg-neutral-300/80" />
      <div className="flex flex-col">
        <span className="font-medium">Football Jig</span>
        <span className="text-[10px] text-neutral-400">Secondary points · mid-depth</span>
      </div>
    </div>
  );
}