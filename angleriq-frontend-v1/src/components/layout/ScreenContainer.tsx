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
      {/* Header Section */}
      {(title || tagline) && (
        <header className="pt-8 pb-4 text-center">
          {title && (
            <h1 className="text-xl font-semibold tracking-wide text-white">
              {title}
            </h1>
          )}

          {tagline && (
            <p className="mt-1 text-[12px] text-gray-400 tracking-wide">
              {tagline}
            </p>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="mt-2">{children}</main>
    </div>
  );
};

export default ScreenContainer;
