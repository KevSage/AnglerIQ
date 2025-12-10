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
      {/* HEADER WRAPPER */}
<header className="w-full pt-2 pb-1">
  {/* LEFT-ALIGNED TEXT LOGO */}
  <div className="absolute left-5 top-1 flex items-center">
    <span className="text-[18px] font-semibold tracking-[0.18em] text-emerald-300">
      AIQ
    </span>
  </div>

  {/* CENTERED BRAND BLOCK */}
  <div className="flex flex-col items-center justify-center">
    <h1 className="text-lg font-semibold tracking-wide text-slate-100">
      AnglerIQ
    </h1>

    <p className="mt-0.5 text-[10px] leading-tight text-slate-400 text-center">
      Environmental Understanding
      <br />
      Elevated and Interpreted
    </p>
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
