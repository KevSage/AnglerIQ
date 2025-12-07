// src/components/layout/ScreenContainer.tsx

import React from "react";

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
  return (
    <div
      className={`min-h-screen w-full bg-black text-white px-4 pb-10 ${className}`}
    >
      {/* Global Brand Header (AIQ + tagline) */}
      <header className="flex items-center gap-3 pt-6 pb-4">
        {/* Circle AIQ mark */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/70 bg-black">
          <span className="text-[11px] font-semibold tracking-[0.18em]">
            AIQ
          </span>
        </div>

        {/* Brand text */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">AnglerIQ</span>
          <span className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
            Environmental Understanding — Elevated and Interpreted.
          </span>
        </div>
      </header>

      {/* Per-screen Title / Tagline (optional) */}
      {(title || tagline) && (
        <section className="pb-3">
          {title && (
            <h1 className="text-lg font-semibold tracking-wide text-white">
              {title}
            </h1>
          )}

          {tagline && (
            <p className="mt-1 text-[12px] text-gray-400 tracking-wide">
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
