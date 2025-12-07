type SageQuickAccessButtonProps = {
  onClick: () => void;
};

export function SageQuickAccessButton({ onClick }: SageQuickAccessButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
      }}
    >
      Ask SAGE
    </button>
  );
}
