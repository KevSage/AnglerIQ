import * as React from "react";

export const SwimJigIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
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
      {/* Head */}
      <path d="M10 18 C12.5 16.5 15 16.5 17.5 17.4 C18.6 17.8 19.5 18.4 20.3 19.1" />

      {/* Line tie */}
      <circle cx="11" cy="16" r="0.9" />

      {/* Hook */}
      <path d="M18 17.5 C20 17 22 18 22.5 20 C23 22 21.8 24 19.8 24.5 L17.2 25.1" />

      {/* Skirt lines */}
      <path d="M12 18.5 L7.5 21" />
      <path d="M12.5 19.8 L8 22.4" />
      <path d="M13 21 L9 23.7" />
    </svg>
  );
};
