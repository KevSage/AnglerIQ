import * as React from "react";

export const ChatterbaitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Blade */}
      <polygon points="6,10 10,8 12,12 8,14" />

      {/* Line tie */}
      <line x1="4" y1="9" x2="6" y2="10" />

      {/* Jig head */}
      <circle cx="16" cy="16" r="2.2" />

      {/* Hook shank + bend */}
      <path d="M18 16 L23 14 C25 13.5 27 14.5 27.5 16.5 C28 18.5 26.8 20.5 24.8 21 L21 22.2" />

      {/* Skirt / body */}
      <path d="M14 17 L9 19" />
      <path d="M14 18.5 L9.5 21" />
      <path d="M14 20 L10 22.5" />
    </svg>
  );
};
