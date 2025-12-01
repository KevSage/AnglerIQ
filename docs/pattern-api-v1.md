# AnglerIQ V1 – Pattern & Vision API (Unified Reference)

## 1. BASIC Pattern — /pattern/basic

### POST `/pattern/basic`

**Request**

```json
{
  "temp_f": 60.0,
  "month": 3,
  "clarity": "stained",
  "wind_speed": 5.0
}
```

**Response**

```json
{
  "phase": "pre-spawn",
  "depth_zone": "mid-depth",
  "recommended_techniques": ["..."],
  "notes": "string"
}
```

---

## 2. PRO Pattern — /pattern/pro

### POST `/pattern/pro`

**Option A – Explicit weather**

```json
{
  "temp_f": 60.0,
  "wind_speed": 5.0,
  "sky_condition": "partly_cloudy",
  "month": 3,
  "clarity": "stained",
  "bottom_composition": "mixed",
  "depth_ft": 10.0,
  "forage": ["shad"]
}
```

**Option B – Auto-weather**

```json
{
  "location_name": "Test Lake",
  "clarity": "stained",
  "bottom_composition": "mixed",
  "depth_ft": 10.0,
  "forage": ["shad"]
}
```

**Response includes**

- phase
- depth_zone
- recommended_lures
- recommended_targets
- strategy_tips
- color_recommendations
- lure_setups
- conditions
- notes

---

## 3. ELITE Pattern — /pattern/elite

### POST `/pattern/elite`

```json
{
  "location_name": "Test Lake",
  "clarity": "stained",
  "bottom_composition": "mixed",
  "depth_ft": 10.0,
  "forage": ["shad"],
  "time_of_day": "dawn",
  "pressure_trend": "falling",
  "water_level_trend": "rising",
  "tournament_mode": true
}
```

**Adds**

- gameplan
- adjustments
- session_context
- time_of_day_normalized
- tier → always `"elite"`

---

## 4. VISION TIER — /pattern/vision-tier

Elite + Vision Fusion

### POST `/pattern/vision-tier`

**Request**

```json
{
  "pattern": {
    "location_name": "Test Lake",
    "time_of_day": "dawn",
    "pressure_trend": "falling",
    "water_level_trend": "rising",
    "tournament_mode": false
  },
  "vision": {
    "depth_ft": 12.5,
    "arch_count": 5,
    "activity_level": "medium",
    "bait_present": true,
    "bottom_hardness": "hard",
    "stop_or_keep_moving": "stop"
  }
}
```

**Vision adds fields**

- vision_enhanced: true
- base_depth_zone
- vision_depth_zone
- vision_depth_band
- vision_signals
- vision (clean UI block)
- vision_summary
- fusion { sonar, weather, strength, should_camp, likely_quality_bite_zone }

**Never overwritten**

- phase
- depth_zone

**Tier always**

```json
{ "tier": "elite" }
```

---

## 5. Vision Endpoints

### 5.1 `/vision/on-water`

Stubbed response:

```json
{
  "water_clarity": "stained",
  "visible_structure": "riprap",
  "vegetation": "none",
  "bank_angle": "steep",
  "shade_cover": "low",
  "light_penetration": "medium",
  "worth_fishing": true,
  "raw_attributes": {}
}
```

---

### 5.2 `/vision/fishfinder`

Stubbed response:

```json
{
  "depth_ft": 14.0,
  "bottom_hardness": "hard",
  "bait_present": true,
  "fish_present": true,
  "arch_count": 7,
  "activity_level": "medium",
  "worth_fishing": true,
  "stop_or_keep_moving": "keep_moving",
  "raw_attributes": {}
}
```

---

### 5.3 `/vision/apply-to-pattern`

```json
{
  "pattern_conditions": {...},
  "on_water": {...},
  "fishfinder": {...}
}
```

Adds:

- vision_on_water
- vision_fishfinder
- vision_flags
- vision_applied: true

---

## 6. Guarantees

- Vision Tier always returns `"tier": "elite"`
- Vision never overrides rule-engine depth_zone
- Vision always adds:
  - vision_enhanced
  - base_depth_zone
  - vision_depth_zone
  - vision_depth_band
  - vision_signals
  - vision
  - vision_summary
  - fusion
