# AnglerIQ Style Tokens — V1

Purpose: Define the exact reusable design tokens that all mockups, screens, and UI components must reference to eliminate drift and inconsistency.

Status: FINAL  
Version: 1.0

---

# 1. Color Tokens

All colors referenced using semantic naming — not raw hex — to keep consistency as brand evolves.

## 1.1 Core Brand

- `color.sage.primary` — #6EA77D
- `color.sage.primaryLight` — #86C79A
- `color.charcoal.primary` — #0F1113
- `color.charcoal.secondary` — #1A1D20
- `color.blue.water` — #1F3C88
- `color.blue.waterLight` — #2A4EB5

## 1.2 Neutral Grays

- `gray.100` — #F7F8FA
- `gray.200` — #ECEEF1
- `gray.300` — #D7D9DC
- `gray.400` — #B6B8BC
- `gray.900` — #101214

## 1.3 Depth Zone Colors

Sports-style gradient blocks for depth clarity.

- `depth.shallow` — #D9A441 (golden shallow)
- `depth.mid` — #6EA77D (sage mid)
- `depth.deep` — #1F3C88 (blue deep)

## 1.4 Status Colors

- `status.success` — #6EA77D
- `status.warning` — #E9A23B
- `status.info` — #3FA7F5

---

# 2. Typography Tokens

## 2.1 Font Families

- `font.primary` — Inter
- `font.metrics` — Roboto Condensed (sports stats)

## 2.2 Font Sizes

- `text.h1` — 28px / 700
- `text.h2` — 22px / 600
- `text.h3` — 18px / 600
- `text.body` — 16px / 400
- `text.label` — 14px / 500
- `text.stat` — 24px / 700 (Roboto Condensed)

---

# 3. Spacing Tokens (4pt system)

- `space.xs` — 4px
- `space.sm` — 8px
- `space.md` — 12px
- `space.lg` — 16px
- `space.xl` — 24px
- `space.2xl` — 32px

---

# 4. Radius Tokens

Sports-premium rounded edges.

- `radius.sm` — 8px
- `radius.md` — 12px
- `radius.lg` — 16px
- `radius.xl` — 20px (card default)

---

# 5. Shadow Tokens

## Sports-Hybrid Shadow System

- `shadow.card` — 0px 3px 12px rgba(0,0,0,0.14)
- `shadow.cardStrong` — 0px 4px 18px rgba(0,0,0,0.22)
- `shadow.stat` — subtle outer glow for sports style
  - rgba(110,167,125,0.25) or rgba(31,60,136,0.20) depending on depth

---

# 6. Gradient Tokens

## Light Mode

- `gradient.hero.light` — linear(white → #F0F7F2)
- `gradient.card.light` — linear(#FFFFFF → #F5F7F7)

## Dark Mode

- `gradient.hero.dark` — linear(#0F1113 → #1A1D20)
- `gradient.card.dark` — linear(#1A1D20 → #141618)

---

# 7. Component-Specific Tokens

### Buttons

- Height: 48px
- Radius: `radius.lg`
- Primary background: `color.sage.primary`
- Text: White

### Cards

- Radius: `radius.xl`
- Shadow: `shadow.card`
- Padding: `space.lg`

### Input Fields

- Border radius: `radius.md`
- Border color (light): `gray.300`
- Border color (dark): `gray.400`

### Navigation

- Height: 64px
- Background (light): white
- Background (dark): `gray.900`

---

# 8. Interaction Tokens

- `motion.fast` — 120ms
- `motion.med` — 240ms
- `motion.slow` — 360ms
- `motion.curve` — cubic-bezier(0.25, 0.1, 0.25, 1.0)

---

# 9. Usage Notes

All mockups **must** reference these tokens, not raw values.

Example:  
Instead of “blue”, use `color.blue.water`.  
Instead of “border-radius 16px”, use `radius.lg`.

This eliminates drift and guarantees consistency across:

- Full-color mockups
- Front-end code
- Future iterations
