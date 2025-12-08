"use client";

import * as React from "react";
import * as LureIcons from "./index";

const lureIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  chatterbait: LureIcons.ChatterbaitIcon,
  swim_jig: LureIcons.SwimJigIcon,
  // When you add more icons, extend this map:
  // spinnerbait: LureIcons.SpinnerbaitIcon,
  // lipless_crank: LureIcons.LiplessCrankIcon,
  // swimbait_soft: LureIcons.SwimbaitSoftIcon,
  // ...
};

export function LureIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = lureIconMap[iconKey] ?? LureIcons.ChatterbaitIcon; // fallback silhouette
  return <Icon className={className} />;
}
