// src/icons/LureIcon.tsx
"use client";

import React from "react";
import * as LureIcons from "./lures";

type LureIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Map your iconKey values (from pattern data) → actual SVG components
const lureIconMap: Record<string, LureIconComponent> = {
  chatterbait: LureIcons.ChatterbaitIcon,
  spinnerbait: LureIcons.ChatterbaitIcon,
  swim_jig: LureIcons.SwimJigIcon,
  squarebill_crank: LureIcons.ChatterbaitIcon,
  lipless_crank: LureIcons.ChatterbaitIcon,
  mid_crank: LureIcons.ChatterbaitIcon,
  deep_crank: LureIcons.ChatterbaitIcon,
  underspin: LureIcons.ChatterbaitIcon,
  swimbait_soft: LureIcons.ChatterbaitIcon,
  glide_bait: LureIcons.ChatterbaitIcon,
  finesse_worm: LureIcons.ChatterbaitIcon,
  neko_rig: LureIcons.ChatterbaitIcon,
  drop_shot: LureIcons.ChatterbaitIcon,
  shaky_head: LureIcons.ChatterbaitIcon,
  ned_rig: LureIcons.ChatterbaitIcon,
  texas_rig: LureIcons.ChatterbaitIcon,
  carolina_rig: LureIcons.ChatterbaitIcon,
  jig: LureIcons.ChatterbaitIcon,
  topwater_walker: LureIcons.ChatterbaitIcon,
  popper: LureIcons.ChatterbaitIcon,
  prop_bait: LureIcons.ChatterbaitIcon,
  plopper: LureIcons.ChatterbaitIcon,
  metal_blade: LureIcons.ChatterbaitIcon,
  spoon: LureIcons.ChatterbaitIcon,
  // add more as you implement them, this is your single source of truth
};

export function LureIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = lureIconMap[iconKey] ?? LureIcons.ChatterbaitIcon; // safe fallback

  return <Icon className={className} />;
}
