# 🎣 AnglerIQ — Powered by SAGE

### Seasonal Adaptive Guidance Engine for Intelligent Fishing Patterns

**AnglerIQ** is an AI-powered fishing intelligence system built on the **Seasonal Adaptive Guidance Engine (SAGE)**.  
It analyzes _real-world environmental inputs_ — including weather, water temperature, wind, clarity, seasonal transitions, and sky conditions — to generate dynamic fishing pattern recommendations.

The goal is simple:  
**Turn raw conditions into actionable, pro-level strategies.**

---

## 🚀 Features

### 🔹 Intelligent Pattern Generation

Automatically produces lure, color, cover, depth, and technique recommendations based on:

- Water temperature
- Season & month
- Water clarity
- Wind speed
- Cloud cover / sky conditions
- Depth zone
- Behavior phase (prechspawn, spawn, postspawn, summer, fall transition, etc.)

### 🔹 SAGE Engine (Seasonal Adaptive Guidance Engine)

A proprietary logic system that understands seasonal fish behavior and adjusts patterns to match real-time conditions.

### 🔹 Two Experience Modes

- **Basic Mode:** Quick pattern generator with manual inputs
- **Pro Mode:** Full advanced layout with expanded pattern details

### 🔹 Auto-Population via Location (Planned)

Pulls:

- Current temperature
- Weather conditions
- Wind
- Sky conditions
- Seasonal month  
  directly from the user’s geolocation to reduce friction and ensure accurate defaults.

---

## 🏗️ Tech Stack

- **Next.js / React** frontend
- **TypeScript** throughout
- **Node.js** backend logic (SAGE engine)
- Weather/location API integrations (upcoming)
- Modular pattern-logic system with unit tests

---

## 🧪 Testing

Unit tests cover:

- Pattern classification
- Seasonal transitions
- Lure logic mapping
- Environmental condition inference
- Guardrails and error handling

> All pattern logic is validated with test-driven development (TDD) to ensure accuracy and stability.

---

## 📦 Folder Structure (example)
