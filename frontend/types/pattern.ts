export type Tier = "pro" | "elite" | "vision";

export interface PatternDetail {
  phase: string;
  depthZone: string;
  structure: string;

  tier: Tier;

  technique: {
    name: string;
    style: string;
    bullets: string[];
    iconKey: string;
  };

  microPattern: string;

  timeline: {
    window: string;
    action: string;
  }[];

  adjustments: {
    label: string;
    guidance: string;
  }[];

  lures: {
    name: string;
    iconKey: string;
  }[];

  colors: {
    name: string;
    hex: string;
  }[];
}
