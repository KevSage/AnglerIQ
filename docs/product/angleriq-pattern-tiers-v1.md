# AnglerIQ Pattern Tiers – V1 (Backend Slice)

This document describes how the `Basic`, `Pro`, and `Elite` pattern tiers behave in the backend as of V1.

> NOTE: "Basic" is an internal API tier, not a customer-facing product tier.

---

## Overview

All pattern endpoints live under the `/pattern` prefix:

- `POST /pattern/basic`
- `POST /pattern/pro`
- `POST /pattern/elite` ← Elite tier (built on top of Pro)

Each tier progressively adds more detail on top of the same core concepts:

1. **Phase** – seasonal/temperature stage ("pre-spawn", "spawn", "post-spawn", "summer", "fall", "winter")
2. **Depth Zone** – where in the water column to focus
3. **Targets** – what to aim at (cover, structure, banks, points, channels, etc.)
4. **Lures / Setups** – what to throw and how to rig it
5. **Strategy / Gameplan** – how to fish the pattern across a session or day

Other endpoints (like `/chat` and `/sonar`) exist in the backend but are **separate concerns** and not part of the pattern tier logic in this document.

---

## Basic

**Endpoint:** `POST /pattern/basic`  
**Request:** `BasicPatternRequest`  
**Response:** `BasicPatternResponse`

**Goal:** Very simple "at-a-glance" pattern:

- High-level **phase**
- Coarse **depth zone** (derived from phase)
- Short list of **techniques**
- Simple **targets** list
- A single **notes** string

Basic is intended as a _lightweight engine_ used internally (e.g., simple widget, quick suggestions), not a full-blown customer-facing tier.

---

## Pro

**Endpoint:** `POST /pattern/pro`  
**Request:** `ProPatternRequest`  
**Response:** `ProPatternResponse`

**Goal:** Full rules-based Pro engine:

- **Phase** and precise **depth zone**
- **Recommended lures** list
- **Recommended targets** (more granular than Basic)
- **Strategy tips** bullets
- **Color recommendations**
- **Lure setups** (per-lure rigging details)
- **Conditions**: a dict of inputs + derived context
- **Notes**: narrative explanation

Pro is the main pattern engine used for rich UI cards and, later, for any explanation/narration layers.

---

## Elite

**Endpoint:** `POST /pattern/elite`  
**Request:** `ElitePatternRequest` (extends `ProPatternRequest`)  
**Response:** `ElitePatternResponse`

**Additional Inputs (on top of Pro):**

- `time_of_day` – "dawn" | "midday" | "afternoon" | "night"
- `pressure_trend` – "rising" | "falling" | "stable"
- `water_level_trend` – "rising" | "falling" | "stable"
- `tournament_mode` – boolean flag

**How it works (backend behavior):**

1. Elite calls the **Pro engine** (`build_pro_pattern`) internally using the shared fields.
2. It then adds:
   - A structured **gameplan** timeline for the fishing session.
   - A set of **adjustments** ("If pressure is falling and bite dies, do X").
   - A richer **conditions** dict that includes:
     - Raw inputs (temp, clarity, depth, trends, etc.)
     - Derived context (phase, depth_zone, tier, normalized time_of_day).
3. `notes` is extended with an Elite-specific suffix to make it clear this is an expanded pattern built on top of Pro.

**Intended usage:**

- Elite powers a richer "trip planner" style UI and the highest pattern tier.
- It is structured so that external layers (e.g., UI, assistant) can easily narrate or adapt the plan.

---

## Out of Scope for This Document

The following are explicitly **not** part of this V1 pattern-tier slice:

- Sonar/vision processing logic (even though a `/sonar` endpoint exists as a placeholder).
- Any direct dependency between `/pattern/*` endpoints and `/sonar`.
- LLM-driven pattern generation (current engines are rules-based).
- Moon phase / barometric inputs (may be added in a future iteration).
