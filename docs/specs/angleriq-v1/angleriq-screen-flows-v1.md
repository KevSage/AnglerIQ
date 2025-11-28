# AnglerIQ Screen Flows — V1

---

## 1. High-Level Flow

Home → Input → Results(Basic)  
 ↳ → **Pro (Upgrade)** → Results(Pro)  
 ↳ → Technique Detail  
 ↳ → Settings  
 ↳ → History

---

## 2. Detailed Flows

### **Home → Input**

Trigger:

- Tap “Start”
- Tap any quick tile

State: Open InputForm pre-filled with known values.

---

### **Input → Basic Results**

Requirements: Temp + Month  
Process:

- Validate
- API POST /pattern/basic
- Render BasicPatternResponse

---

### **Basic Results → Pro (if not Pro user)**

Trigger:

- Tap “Unlock Full Pattern”  
  Outcome:
- Show Pro Upgrade Screen
- On success, re-run logic with /pattern/pro

---

### **Basic Results → Technique Detail**

Trigger:

- Tap any TechniqueCardBasic

---

### **Pro Results → Technique Detail**

Same as above, but with deeper context.

---

### **Settings Flow**

Home → Settings  
From settings:

- Theme toggle
- Unit adjustments
- Manage subscription

---

## 3. Error / Edge Flows

### Invalid Input

- Highlight field
- Soft error message
- Disable CTA

### API Failure

- Retry banner
- Offline mode fallback (optional future spec)

---

## 4. Navigation Map (Bottom Nav)

- Home → root
- Pro → upgrade or pro dashboard
- History → stored patterns
- Settings → app preferences
