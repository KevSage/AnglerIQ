// src/data/lures.ts

// Core lure categories for v1 tacklebox.
// This is intentionally simple and non-opinionated.
// We can expand later in v2+ if needed.

export type LureCategory =
  | "moving"
  | "bottom"
  | "finesse"
  | "topwater"
  | "utility";

export type LureId =
  | "chatterbait"
  | "texas_rig_worm"
  | "jig"
  | "spinnerbait"
  | "squarebill"
  | "lipless_crank"
  | "jerkbait"
  | "mid_crank"
  | "swimbait_soft"
  | "ned_rig"
  | "dropshot"
  | "wacky_rig"
  | "frog"
  | "popper"
  | "buzzbait"
  | "underspin";

export interface LureDefinition {
  id: LureId;
  name: string;
  category: LureCategory;
  iconKey: string; // ties into LUR library later (e.g. "chatterbait_default")
  shortDescription: string;
}

// v1: tight, sensible bass set.
// This feeds both Tacklebox and (later) Pattern Detail imagery.
export const ALL_LURES: LureDefinition[] = [
  {
    id: "chatterbait",
    name: "Chatterbait",
    category: "moving",
    iconKey: "chatterbait_default",
    shortDescription: "Bladed jig for stained water, wind, and activity.",
  },
  {
    id: "spinnerbait",
    name: "Spinnerbait",
    category: "moving",
    iconKey: "spinnerbait_default",
    shortDescription: "Classic moving bait for wind, clouds, and cover edges.",
  },
  {
    id: "squarebill",
    name: "Squarebill Crankbait",
    category: "moving",
    iconKey: "squarebill_default",
    shortDescription: "Shallow deflection bait for wood, rock, and grass.",
  },
  {
    id: "lipless_crank",
    name: "Lipless Crankbait",
    category: "moving",
    iconKey: "lipless_crank_default",
    shortDescription:
      "Great for grass flats, yo-yo retrieves, and reaction bites.",
  },
  {
    id: "mid_crank",
    name: "Mid-Depth Crankbait",
    category: "moving",
    iconKey: "mid_crank_default",
    shortDescription: "Targets mid-depth structure, humps, and edges.",
  },
  {
    id: "jerkbait",
    name: "Jerkbait",
    category: "moving",
    iconKey: "jerkbait_default",
    shortDescription: "Cold- and clear-water suspending bait for roaming fish.",
  },
  {
    id: "texas_rig_worm",
    name: "Texas-Rig Worm",
    category: "bottom",
    iconKey: "texas_rig_worm_default",
    shortDescription:
      "Foundational bottom-contact presentation for almost any lake.",
  },
  {
    id: "jig",
    name: "Flipping / Football Jig",
    category: "bottom",
    iconKey: "jig_default",
    shortDescription: "Heavy cover, rock, and deeper structure workhorse.",
  },
  {
    id: "ned_rig",
    name: "Ned Rig",
    category: "finesse",
    iconKey: "ned_rig_default",
    shortDescription: "Subtle bottom bait for tough or pressured conditions.",
  },
  {
    id: "dropshot",
    name: "Dropshot",
    category: "finesse",
    iconKey: "dropshot_default",
    shortDescription: "Vertical or precise presentation for suspended fish.",
  },
  {
    id: "wacky_rig",
    name: "Wacky Rig",
    category: "finesse",
    iconKey: "wacky_rig_default",
    shortDescription: "Easy, high-confidence shallow and dock presentation.",
  },
  {
    id: "swimbait_soft",
    name: "Soft Swimbait",
    category: "utility",
    iconKey: "swimbait_soft_default",
    shortDescription: "Versatile swimmer for banks, offshore, and grass lines.",
  },
  {
    id: "frog",
    name: "Hollow-Body Frog",
    category: "topwater",
    iconKey: "frog_default",
    shortDescription: "Heavy cover topwater for mats, pads, and vegetation.",
  },
  {
    id: "popper",
    name: "Popper",
    category: "topwater",
    iconKey: "popper_default",
    shortDescription: "Subtle topwater for calm water and targets.",
  },
  {
    id: "buzzbait",
    name: "Buzzbait",
    category: "topwater",
    iconKey: "buzzbait_default",
    shortDescription:
      "High-commitment topwater for active fish and shallow water.",
  },
  {
    id: "underspin",
    name: "Underspin",
    category: "utility",
    iconKey: "underspin_default",
    shortDescription: "Finesse swimmer with flash for cold or clear water.",
  },
];
