# AnglerIQ — Tier Architecture (V1)

Version: 1.0  
Status: Finalized  
Owner: Kevin Sage  
Updated: 2025-11-28

---

# 1. Overview

AnglerIQ uses a **tiered pattern-intelligence architecture** intentionally designed to scale from simple beginner-friendly logic (Basic) to advanced environmental intelligence (Pro), with future tiers enabling weather ingestion, sonar analysis, and historical patterning.

V1 officially includes:

- **Tier 0: Foundational Deterministic Logic**
- **Tier 1: Basic Pattern Engine**
- **Tier 2: Pro Pattern Engine**

Higher tiers (3–5) are defined for roadmap planning but not implemented yet.

---

# 2. Tier Definitions

## **Tier 0 — Deterministic Foundation Layer**

The shared logic that all tiers use.

Includes:

- Phase classifier (temp + month)
- Depth inference logic
- Clarity normalization
- Bottom-type adjustments
- Targets & tips generator
- Lure inference (base-level)

Purpose:

- Ensure reproducible, deterministic outputs
- Provide stable “ground truth” for LLM summaries
- Prevent hallucination by constraining decision pathways

---

## **Tier 1 — Basic Pattern Engine (V1 Live)**

The simplest user-facing intelligence tier.

Inputs:

- Water temp
- Month

Outputs:

- Seasonal phase
- Depth zone
- 2–3 basic techniques
- Beginner-friendly summary

Characteristics:

- No clarity or bottom logic
- No lure-forage matching
- No setups
- No environmental adjustments

Audience:

- Beginners
- Casual anglers
- “Quick pattern in 10 seconds” use case

---

## **Tier 2 — Pro Pattern Engine (V1 Live)**

Adds structured environmental modifiers and pro-level detail.

Additional Inputs:

- Clarity
- Bottom type

Outputs:

- All Tier 1 outputs
- - clarity band
- - environmental lure adjustments
- - forage matching notes
- - pro setups (rod, reel, line)
- - structured targets
- - tactical tips
- - long-form expert summary

Decision layers:

- 2-stage lure inference
- Clarity & bottom-driven modifications
- Seasonal forage alignment
- Pattern stability scoring (internal)

Audience:

- Experienced anglers
- Tournament-level users
- Users who want deeper tactical guidance

---

## **Tier 3 — Adaptive Environmental Engine (Roadmap)**

Not included in V1. Defined for future use.

Adds:

- Wind
- Sun/Cloud
- Barometric pressure
- Recent front activity
- Temperature trend (rising/falling)

Purpose:

- Enable “day-to-day pattern modulation”
- Improve real-time accuracy

Status:

- Spec drafted
- Requires new schemas

---

## **Tier 4 — Weather API + Historical Pattern Engine (Roadmap)**

Not included in V1.

Adds:

- Automatic weather ingestion by GPS
- Seasonal archives
- User catch-history modeling

Enables:

- Predictive adjustments
- “Best 2-hour window” recommendations
- Historical pattern matching

---

## **Tier 5 — Sonar & Spatial Intelligence Engine (Long-Term Roadmap)**

Not included in V1.

Adds:

- Sonar log ingestion
- Structure detection
- Fish density/size estimation
- Spatial heatmaps

Endgame:

- “Real-time augmented fishing assistant”

---

# 3. Tier Relationships
