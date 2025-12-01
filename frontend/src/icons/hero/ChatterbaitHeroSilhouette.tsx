import * as React from "react";

export const ChatterbaitHeroSilhouette: React.FC<
  React.SVGProps<SVGSVGElement>
> = (props) => {
  return (
    <svg viewBox="0 0 100 60" {...props} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient
          id="chatterbaitHeroGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4A7BA7" />
          <stop offset="100%" stopColor="#1B314A" />
        </linearGradient>
      </defs>
      <g fill="url(#chatterbaitHeroGrad)" opacity={0.16}>
        {/* Very simple silhouette – blade + head + skirt mass */}
        <polygon points="8,16 24,10 28,18 12,22" />
        <circle cx="40" cy="28" r="5" />
        <path d="M44 28 Q60 22 76 26 Q84 28 88 32 Q92 36 90 40 Q88 44 82 46 L68 49" />
        <path d="M36 30 L22 38" />
        <path d="M38 34 L24 42" />
        <path d="M40 38 L26 46" />
      </g>
    </svg>
  );
};
