# AnglerIQ Component Specification — V1

**Path:** `/docs/product/angleriq-component-spec-v1.md`  
**Status:** Approved Source of Truth  
**Version:** 1.0  
**Last Updated:** 2025-XX-XX

---

## Table of Contents

1. Purpose
2. Design Foundations
3. Color Tokens
4. Typography System
5. Spacing, Layout, Radii
6. Core Components
7. Vision Components (Elite+)
8. Chat Components
9. Navigation Components
10. Upsell Panels
11. Loaders & Skeletons
12. Dark Mode Rules

---

## 1. Purpose

This document defines the **UI component system** for AnglerIQ V1.

It bridges product wireframes and frontend implementation to ensure:

- Visual consistency
- Faster development
- Predictable behavior
- Mobile-first design
- Clean theming (light + dark)
- Sport Hybrid identity across screens

All components here are canonical for V1.

---

## 2. Design Foundations

**Visual identity:** Sport Hybrid

- Active, modern, energetic
- Clean, rounded cards
- Sage Green + sport accent colors
- Bold but readable typography
- Strong contrast for outdoor/on-water use

**Primary platform:** mobile (360–430px width).  
Tablet/desktop are responsive expansions, not design drivers.

---

## 3. Color Tokens

### 3.1 Light Mode Palette

| Token          | Hex     | Usage                                |
| -------------- | ------- | ------------------------------------ |
| `sage-green`   | #4CAF73 | Primary accents, CTAs, active states |
| `sport-aqua`   | #40E0D0 | Vision emphasis (Elite+)             |
| `sport-yellow` | #FFCB2B | Optional emphasis / highlights       |
| `bg-light`     | #F7F9F9 | Screen background                    |
| `card-light`   | #FFFFFF | Card surfaces                        |
| `border-light` | #E3E7EA | Card borders, dividers               |
| `text-dark`    | #1A1A1A | Primary text                         |
| `text-muted`   | #6A6A6A | Secondary text                       |

---

### 3.2 Dark Mode Palette

| Token             | Hex                  | Usage              |
| ----------------- | -------------------- | ------------------ |
| `bg-dark`         | #0E1214              | Primary background |
| `card-dark`       | #161B1E              | Card surfaces      |
| `border-dark`     | #2A2F31              | Dividers, outlines |
| `text-light`      | #F2F5F5              | Primary text       |
| `text-muted-dark` | #8C9599              | Secondary text     |
| `accent-glow`     | rgba(76,175,115,0.5) | Glows/highlights   |

---

### 3.3 Status Colors

- `success`: #4CAF50
- `warning`: #FFB300
- `error`: #E53935
- `info`: #2196F3

---

## 4. Typography System

| Style   | Size | Weight    | Usage                             |
| ------- | ---- | --------- | --------------------------------- |
| H1      | 24px | Semi-bold | Major titles                      |
| H2      | 20px | Medium    | Card titles, key section headings |
| Body 1  | 16px | Regular   | Narrative, pattern text, chat     |
| Body 2  | 14px | Regular   | Labels, secondary info, chips     |
| Caption | 12px | Regular   | Metadata, timestamps, helper text |

Dark mode may slightly increase letter spacing for readability.

---

## 5. Spacing, Layout, Radii

### 5.1 Spacing Scale

- 4px — micro spacing (between small elements)
- 8px — small spacing (icon + label, chips)
- 12px — medium spacing (between stacked text blocks)
- 16px — standard card padding
- 20px — spacing between different cards/sections
- 24px — large separation between major groups

### 5.2 Radii

- Cards: 12px
- Buttons: 10px
- Inputs: 8px
- Photo frames/images: 10–12px

### 5.3 Layout Rules

- Single-column layout for mobile
- Max width for content: 360–430px
- Horizontal content padding: 16px
- Vertical gap between cards: 20–24px
- Minimum tap target: 44×44px

---

## 6. Core Components

### 6.1 Base Card

**Purpose:** Generic container for most information (pattern summary, lures, targets, narrative, vision results).

**Styles:**

- Padding: 16px
- Background: `card-light` (light mode) / `card-dark` (dark mode)
- Border: 1px solid `border-light` / `border-dark`
- Border-radius: 12px
- Margin-bottom: 20px

**Structure:**

- Title (H2)
- Optional subtitle (Body 2, muted)
- 8px vertical spacer
- Content block(s) stacked vertically with 8–12px spacing

---

### 6.2 Primary Button

**Usage:** Main actions (Generate Pattern, Apply Vision, Upgrade).

**Styles:**

- Height: 48px
- Border-radius: 10px
- Background: `sage-green`
- Text color: white
- Font: Body 1, semi-bold
- Horizontal padding: 16px
- Full-width (mobile) where appropriate

**States:**

- Default: flat color
- Pressed: slightly darker `sage-green`, optional 0.97 scale
- Disabled: background #C6D2C8, text #808080, no shadow

---

### 6.3 Secondary Button

**Usage:** Less critical actions (e.g., “Refine Pattern”, “See Details”).

**Styles:**

- Height: 44px
- Border-radius: 10px
- Border: 1px solid `sage-green`
- Background: transparent
- Text: `sage-green`

---

### 6.4 Input Field (Pro Depth Input)

**Usage:** Pro tier optional depth input only.

**Styles:**

- Height: 44px
- Padding: 12px
- Border-radius: 8px
- Background: light gray (`#F0F3F4`) or dark charcoal (`#1C2124` in dark mode)
- Border: 1px solid `border-light` / `border-dark`
- Label: Body 2 placed 12px above field
- Placeholder color: `text-muted` / `text-muted-dark`

---

### 6.5 List Items (Targets, Tips)

**Styles:**

- Font: Body 1
- Bullet or dash prefix
- 4px indent from card padding
- 8px vertical gap between items

---

## 7. Vision Components (Elite+ Only)

### 7.1 Photo Action Tiles

**Usage:** Entry points for On-Water and Fishfinder snapshot capture.

**Styles:**

- Height: ~120px
- Border-radius: 12px
- Background: gradient from `sage-green` to `sport-aqua` (or similar Sport Hybrid combo)
- Text color: white
- Internal padding: 16px
- Layout: icon + title + subtitle centered vertically

**Content:**

- Icon: 32–40px, white (camera + water or camera + fishfinder)
- Title: Body 1 or H2 (“On-Water Photo”, “Fishfinder Screen”)
- Subtitle: Body 2 (“Analyze clarity & structure”, “Analyze depth & fish activity”)

Tap state: slight darkening + subtle scale down.

---

### 7.2 On-Water Vision Analysis Card

**Purpose:** Show result of on-water photo.

**Card content:**

- Title: “On-Water Analysis” (H2)
- Clarity: label + value (e.g., “Clarity: Muddy”)
- Structure detections: chips or bullet list (docks, laydowns, grassline)
- Bank angle: description (shallow / medium / steep)
- Wind/shade notes if detectable
- Summary line(s): 1–3 lines of Body 1 text
- Apply button: Primary Button (“Apply to Pattern”)

Layout: Base card with 16px padding, 8–12px internal spacing.

---

### 7.3 Fishfinder Vision Analysis Card

**Purpose:** Show results of a fishfinder screen photo.

**Card content:**

- Title: “Fishfinder Snapshot” (H2)
- Depth & Temp row: “Depth: 14.3 ft • Temp: 52.1°F”
- Hardness indicator: small bar or 3–5-dot scale
- Bait presence: icon + text (“Bait detected”)
- Fish marks: count or simple label (“Scattered arches”, “Small cluster”)
- Behavior classification tag: e.g., “Suspended 4–6 ft off bottom”
- Decision chip: “Stop” / “Keep Moving”
- Short recommended presentation (1–2 lines)
- Apply button: “Apply to Pattern” (Primary Button)

Structure similar to on-water card with additional row for behavior/decision.

---

## 8. Chat Components (Elite & Elite+)

### 8.1 Chat Bubbles

**User bubble (right aligned):**

- Background (light): `rgba(76,175,115,0.18)`
- Background (dark): deep teal (#1E3A2F)
- Text: `text-dark` (light) / `text-light` (dark)
- Padding: 12px
- Border-radius: 16px 16px 4px 16px
- Max-width: ~82% of screen width

**SAGE bubble (left aligned):**

- Background: `card-light` / `card-dark`
- Border: 1px solid `border-light` / `border-dark`
- Text: `text-dark` / `text-light`
- Padding: 12px
- Border-radius: 16px 16px 16px 4px
- Max-width: ~82%

Vertical spacing between messages: 6–8px.

---

### 8.2 Quick Prompt Chips

- Height: 36px
- Border-radius: 16px
- Padding: 0 12px
- Background: `card-light` / `card-dark`
- Text: Body 2
- Horizontal scroll allowed if more than 3–4 chips

Tap state: background fills slightly more and text bolds.

---

### 8.3 Chat Input Bar

**Container (fixed at bottom):**

- Height: ~56px (plus safe area)
- Padding: 8px 12px
- Background: `card-light` / `card-dark`
- Border-top: 1px solid `border-light` / `border-dark`

**Input field:**

- Height: 44px
- Border-radius: 24px
- Padding: 10–12px
- Background: `bg-light` / `bg-dark`
- Text: `text-dark` / `text-light`

**Send button:**

- Right side circular icon button (Sage Green fill)
- 36–40px width/height

---

## 9. Navigation Components

### 9.1 Bottom Navigation Bar

**Usage:** Elite & Elite+ (multi-tab); Pro may only show Pattern tab.

**Styles:**

- Height: 64px (plus safe area)
- Background: `card-light` / `card-dark`
- Border-top: 1px solid `border-light` / `border-dark`
- Layout: 3 equal flex items (Pattern, Vision, Chat)

**Nav item content:**

- Icon (24px)
- Label (Body 2)

**States:**

- Active: icon + label in `sage-green`
- Inactive: icon + label in `text-muted` or `text-muted-dark`
- Locked (Elite Vision tab): icon greyed + small lock overlay

---

## 10. Upsell Panels

### 10.1 Pro → Elite

- Base card (12px radius, 16px padding)
- Accent strip on left or angled corner using `sage-green`
- Title: H2 (“Unlock AI Coaching”)
- Subtitle: Body 2 (“Get deeper explanations and chat with Sage.”)
- CTA: Primary Button “Upgrade to Elite”

### 10.2 Elite → Elite+

- Base card split visually (two thirds text, one third image placeholder)
- Title: H2 (“Unlock Vision Intelligence”)
- Subtitle: Body 2 (“Analyze your water and fishfinder with AI.”)
- Placeholder thumbnails: small water + fishfinder mock icons
- CTA: Primary Button “Upgrade to Elite+”

---

## 11. Loaders & Skeletons

### 11.1 Analysis Loader

- Circular loader with segmented ring
- Colors: `sage-green` + `sport-aqua`
- Status text below loader (Caption):
  - e.g., “Analyzing clarity…”, “Reading depth…”, “Finding bait…”

### 11.2 Skeleton States

Used while pattern/vision results load:

- Background: medium gray blocks
- Height: 14–16px, width 60–90%
- Border-radius: 8px
- Arranged to match text/card layout

---

## 12. Dark Mode Rules

- Page background → `bg-dark`
- Cards → `card-dark`
- Borders → `border-dark`
- Primary text → `text-light`
- Muted text → `text-muted-dark`
- Primary buttons still use `sage-green` but may be slightly darker tone
- Vision photos or thumbnails appear on dark card backgrounds
- Bottom nav uses `card-dark` with clear icon contrast

All components must remain fully legible and meet good contrast levels for nighttime and low-light fishing scenarios.

---

_End of Document_
