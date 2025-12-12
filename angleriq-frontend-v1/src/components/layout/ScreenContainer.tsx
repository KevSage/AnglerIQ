// src/components/layout/ScreenContainer.tsx

import React from "react";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  title?: string;
  tagline?: string;
  children: React.ReactNode;
  className?: string;
};

const ScreenContainer = ({
  title,
  tagline,
  children,
  className = "",
}: Props) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={[
        "min-h-screen w-full px-4 pb-10 transition-colors duration-200",
        isLight ? "bg-slate-50 text-slate-900" : "bg-black text-white",
        className,
      ].join(" ")}
    >
      {/* HEADER WRAPPER */}
      <header className="flex w-full items-start justify-between pt-2 pb-1">
        {/* LEFT-ALIGNED TEXT LOGO */}
        <div className="flex items-center">
          <span
            className={[
              "text-[18px] font-semibold tracking-[0.18em]",
              isLight ? "text-emerald-600" : "text-emerald-300",
            ].join(" ")}
          >
            AIQ
          </span>
        </div>

        {/* CENTERED BRAND BLOCK */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <h1
            className={[
              "text-lg font-semibold tracking-wide",
              isLight ? "text-slate-900" : "text-slate-100",
            ].join(" ")}
          >
            AnglerIQ
          </h1>

          <p
            className={[
              "mt-0.5 text-[10px] leading-tight text-center",
              isLight ? "text-slate-500" : "text-slate-400",
            ].join(" ")}
          >
            Environmental Understanding
            <br />
            Elevated and Interpreted
          </p>
        </div>

        {/* THEME TOGGLE PILL */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            className={[
              "rounded-full border px-3 py-1 text-[10px] font-medium",
              isLight
                ? "border-slate-300 bg-white text-slate-700 shadow-sm"
                : "border-slate-700 bg-slate-900 text-slate-200",
            ].join(" ")}
          >
            {isLight ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </header>

      {/* Per-screen Title / Tagline (optional) */}
      {(title || tagline) && (
        <section className="pb-3">
          {title && (
            <h1
              className={[
                "text-lg font-semibold tracking-wide",
                isLight ? "text-slate-900" : "text-white",
              ].join(" ")}
            >
              {title}
            </h1>
          )}

          {tagline && (
            <p
              className={[
                "mt-1 text-[12px] tracking-wide",
                isLight ? "text-slate-500" : "text-gray-400",
              ].join(" ")}
            >
              {tagline}
            </p>
          )}
        </section>
      )}

      {/* Main Content */}
      <main className="mt-2">{children}</main>
    </div>
  );
};

export default ScreenContainer;