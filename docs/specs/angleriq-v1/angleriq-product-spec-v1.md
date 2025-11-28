# AnglerIQ Product Specification — V1

**Path:** `/docs/product/angleriq-product-spec-v1.md`  
**Status:** Approved Source of Truth  
**Version:** 1.0  
**Last Updated:** 2025-XX-XX

---

# Table of Contents

1. Overview
2. Tier Model (Pro, Elite, Elite+)
3. Core Features by Tier
4. Vision Features (Elite+)
5. Pattern Engine Overview
6. Inference & Automation
7. Mobile-First Experience
8. V1 Exclusions
9. Future Versions (V1.5 & V2)

---

# 1. Overview

AnglerIQ is a mobile-first AI fishing assistant designed to give everyday bass anglers professional-grade decision making on the water. It provides pattern generation, forage intelligence, lure recommendations, and Elite+ vision analysis through computer vision.

This document is the **canonical product overview** for V1 of the app.

---

# 2. Tier Model (Pro, Elite, Elite+)

AnglerIQ uses a **3-tier model**:

## **Pro (Base Tier)**

- Rules-driven pattern engine
- Requires minimal manual inputs
- No AI chat
- No Vision features
- Fast, reliable, structured patterns

## **Elite (Mid Tier)**

- Everything from Pro
- - AI Chat ("Ask SAGE")
- - Weather auto-inference
- - Phase-aware forage intelligence
- - Narrative fishing insights
- Optional photo upload that improves clarity/structure inference
- Elite does _not_ include fishfinder or on-water advanced analysis

## **Elite+ (Top Tier)**

- Everything in Elite
- - Vision Intelligence (On-water)
- - Fishfinder Snapshot MVP
- - Vision → Pattern integration
- Highest-level AI features
- Intended as the premium experience

---

# 3. Core Features by Tier

## **Pro**

- Pattern generation (phase, depth zone, lures, techniques)
- Angular (rule-based) logic only
- Inputs:
  - Temp
  - Wind speed
  - Sky conditions
  - Water clarity
- No chat
- No photo features
- Fast + simple UX

---

## **Elite**

Adds intelligence and convenience:

- Automatic weather inference
- Phase-optimized forage selection
- Narrative explanation of _why_ the pattern works
- Personalized insights based on conditions
- Optional photo (on-water) for enhanced clarity + structure inference
- Chat with Sage AI

Elite produces a **richer, more human, more confident pattern**, but remains structured.

---

## **Elite+**

Adds Vision:

### 1. **On-Water Snapshot (Vision)**

User uploads a photo taken from the bank or boat. AI extracts:

- Water clarity
- Visible structure
- Grass / vegetation
- Bank angle
- Light penetration
- Shade cover / overhead structure
- General recommendation if “worth fishing”

### 2. **Fishfinder Snapshot MVP**

User uploads picture of a basic fishfinder screen. AI extracts:

- Depth
- Bottom hardness (approx)
- Bait presence
- Arch presence/count
- General fish activity level
- High-level “Stop or keep moving” assessment

### 3. Vision → Pattern Integration

All above feeds directly into an enhanced Elite pattern.

---

# 4. Vision Features (Elite+)

### **Vision Stack**

- On-water analysis
- Fishfinder snapshot analysis
- Vision-to-Pattern injection
- Vision results card
- Vision CTA: “Apply to Pattern”

All components use the Sport Hybrid theme, mobile-first.

---

# 5. Pattern Engine Overview

Pattern engine is rules-based with AI narrative on Elite/Elite+.

Core Logic Includes:

- Phase determination
- Depth zone refinement
- Lure selection + style variants
- Temperature window filtering
- Clarity adjustments
- Bottom composition adjustments
- Forage intelligence
- Wind-driven aggression modifier
- Seasonal structure prediction
- Narrative layer (Elite/Elite+)

Pattern output always includes:

- Phase
- Depth zone
- Recommended lures
- Techniques
- Targets
- Strategy tips
- Notes
- Conditions snapshot

Elite+ patterns may also include:

- Vision-processed clarity
- Visible structure identification
- Fishfinder-induced adjustments

---

# 6. Inference & Automation

## **Elite Weather Automation**

Elite auto-fetches:

- Temperature
- Wind speed
- Sky condition
- Time of day
- Month
- Seasonal average adjustments

Pro does not.

## **Elite Clarity Handling**

If a user does _not_ upload a photo:

- Sage infers clarity from conditions + region.  
  If they upload a photo:
- Vision overrides with accurate clarity.

No manual clarity input required for Elite.

## **Elite+ Vision Pipeline**

If photo uploaded, pattern automatically enriches:

- clarity
- structure
- shade
- bank angle
- vegetation
- fishfinder depth/bait/fish

---

# 7. Mobile-First Experience

AnglerIQ V1 is **mobile-first**, not desktop-first.

### Navigation

- Bottom navigation bar:
  - Pattern
  - Vision (Elite+ only)
  - Chat

### Layout Rules

- Stacked vertical, thumb zone optimized
- Cards 16 px padding
- Tap targets 44–48 px
- Vision results use bold, clean sections

---

# 8. V1 Exclusions

These are explicitly _not_ part of V1:

- Automatic map analysis
- Contour inference
- Waterbody classification
- Sonar interpretation
- Real-time analysis
- Multi-photo stitching
- School-size prediction
- Species identification
- Location-aware history
- Trip logging

---

# 9. Future Versions

## **V1.5 (High Priority)**

- _None_ (Snapshot MVP already included in V1)

## **V2 (Must-Have)**

- Fully realized Fishfinder Vision
- Advanced Vision Behavior Analysis
- Contour/Map Vision
- Location-aware patterns
- History + saved sessions
- Offline mode

---

# End of Document
