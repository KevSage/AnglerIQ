type RecenterButtonProps = {
  visible: boolean;
  onPress: () => void;
};

export function RecenterButton({ visible, onPress }: RecenterButtonProps) {
  if (!visible) return null;

  return (
    <button
      onClick={onPress}
      className="px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-[11px] text-neutral-100 shadow-md"
    >
      Recenter
    </button>
  );
}