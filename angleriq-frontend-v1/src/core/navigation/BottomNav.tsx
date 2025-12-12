type TabId = "home" | "pattern" | "vision" | "tacklebox" | "library";

type BottomNavProps = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

const items: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "pattern", label: "Pattern" },
  { id: "vision", label: "Vision" },
  { id: "tacklebox", label: "Tacklebox" },
  { id: "library", label: "Library" },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="h-14 w-full bg-neutral-950/95 border-t border-neutral-800 flex items-center justify-around">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center text-[11px] ${
            active === item.id ? "text-neutral-50" : "text-neutral-500"
          }`}
        >
          <span className="h-4 w-4 rounded-full border border-neutral-600 mb-0.5" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}