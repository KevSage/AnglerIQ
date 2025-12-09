# AnglerIQ Backend Snapshot — V1 Stable (All Tests Green)

**Tag:** `backend-v1-stable`  
**Status:** All tests passing (`pytest`).

## Core Contracts

- `/health` → `{"status": "ok"}`
- `/assistant/ask` → Builds Pro/Elite/Vision patterns, runs `generate_advice`, applies `SagePreferences` via `personalize_sage_answer`, returns `pattern_summary` (+ `sage_key_points`, `sage_meta`).
- `/sage/chat` → Text-only SAGE chat, uses `SagePreferences` + optional `SageContext` and Vision context.

## Pattern Endpoints

- `/pattern/basic` → basic summary
- `/pattern/pro` → Pro pattern engine
- `/pattern/elite` → Elite pattern engine
- `/pattern/vision-tier` → Vision-tier wrapper around Elite + Vision flags

## Vision Endpoints (Stubbed, Test-Backed)

- `/vision/on-water` → deterministic on-water read for tests.
- `/vision/fishfinder` → deterministic sonar read for tests.
- `/vision/apply-to-pattern` → returns:

  ```jsonc
  {
    "updated_conditions": {
      "tier": "...",
      "phase": "...",
      "vision_applied": true,
      "vision_enhanced": true,
      "vision_depth_zone": "...",
      "vision_on_water": { ... },
      "vision_summary": {
        "should_camp": true,
        "likely_quality_bite_zone": "primary",
        "confidence_level": "medium"
      }
    }
  }
  ```
