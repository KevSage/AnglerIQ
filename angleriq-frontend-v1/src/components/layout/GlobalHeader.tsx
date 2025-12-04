import { Link } from "react-router-dom";
import { useTier } from "../../hooks/useTier";

const GlobalHeader = () => {
  const { tier } = useTier();

  // Minimal tier badge styling
  const tierColor =
    tier === "vision"
      ? "bg-purple-500"
      : tier === "elite"
      ? "bg-blue-500"
      : "bg-green-500";

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-slate-800 bg-black/40 backdrop-blur-sm">
      {/* Left — App Name */}
      <Link
        to="/"
        className="text-sm font-semibold tracking-wide text-slate-100"
      >
        AnglerIQ
      </Link>

      {/* Middle — Tier Badge */}
      <span
        className={`px-2 py-0.5 text-[10px] font-medium rounded-full text-black ${tierColor}`}
      >
        {tier === "vision"
          ? "Vision Tier"
          : tier === "elite"
          ? "Elite Tier"
          : "Pro Tier"}
      </span>

      {/* Right — Control Center Icon */}
      <Link
        to="/control-center"
        className="p-2 -mr-2 rounded-md hover:bg-slate-800/60 active:bg-slate-700/50 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          className="w-4 h-4 stroke-slate-300"
          strokeWidth={1.4}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.5 10h-2m17 0h-2M10 3.5v-2m0 17v-2M5.636 5.636l-1.414-1.414m11.314 11.314l-1.414-1.414M5.636 14.364l-1.414 1.414m11.314-11.314l-1.414 1.414"
          />
        </svg>
      </Link>
    </header>
  );
};

export default GlobalHeader;
