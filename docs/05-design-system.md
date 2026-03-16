# HarborAI Design System & UI Specifications

## Design Philosophy

**"Financial distress shouldn't feel distressing."**

HarborAI's design takes a radically different approach from traditional banking UIs. Instead of cold, corporate interfaces, we create a warm, modern experience that feels more like talking to a smart, caring friend than filling out a bank form.

### Design Principles

1. **Calming over Corporate** — Soft gradients, rounded corners, breathing space
2. **Conversational over Form-based** — Chat-first interface, progressive disclosure
3. **Transparent over Opaque** — Show the "why" behind every offer
4. **Celebratory over Transactional** — Acknowledge progress, celebrate milestones
5. **Accessible over Aesthetic** — WCAG 2.1 AA minimum, designed for stress

---

## Color System

### Primary Palette — "Pacific Calm"

Inspired by ocean gradients — calming blues transitioning to warm sunset tones. Distinctly NOT Stripe (purple), Square (dark), or PayPal (blue/gold).

```
PRIMARY GRADIENT (Hero/CTA):
  ┌─────────────────────────────────────┐
  │  #0EA5E9 → #6366F1 → #8B5CF6       │  Sky Blue → Indigo → Violet
  │  (Sky-500)  (Indigo-500) (Violet-500)│
  └─────────────────────────────────────┘

ACCENT (Success/Positive):
  #10B981  Emerald-500  — Offers, savings, positive outcomes
  #34D399  Emerald-400  — Lighter variant for backgrounds

WARM ACCENT (Attention/CTA):
  #F59E0B  Amber-500    — Secondary CTAs, highlights
  #FBBF24  Amber-400    — Badges, progress indicators

SEMANTIC COLORS:
  Success:  #10B981 (Emerald)
  Warning:  #F59E0B (Amber)
  Error:    #EF4444 (Red-500) — Used sparingly, never for account status
  Info:     #0EA5E9 (Sky-500)

NEUTRAL PALETTE:
  Background:  #FAFBFC  (near-white, warm)
  Surface:     #FFFFFF
  Border:      #E5E7EB  (Gray-200)
  Text Primary: #1F2937  (Gray-800)
  Text Secondary: #6B7280 (Gray-500)
  Text Muted:  #9CA3AF  (Gray-400)

DARK MODE:
  Background:  #0F172A  (Slate-900)
  Surface:     #1E293B  (Slate-800)
  Border:      #334155  (Slate-700)
  Text Primary: #F8FAFC  (Slate-50)
  Text Secondary: #94A3B8 (Slate-400)
```

### Why This Palette?
- **Blue-to-violet gradient**: Conveys trust (blue) + innovation (violet) without being corporate
- **Emerald accents**: Green = money, savings, positive financial outcomes
- **Amber warm tones**: Energetic but not alarming, great for CTAs
- **No red for account status**: We never want "60 days past due" to feel like a punishment

---

## Typography

### Font Stack

```
Primary:     Inter (Google Fonts, free, excellent readability)
Monospace:   JetBrains Mono (for financial figures)
Fallback:    -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Agent Copilot Only:
Primary:     Inter
Monospace:   JetBrains Mono (heavier use for data panels)
```

### Type Scale

```
Display:      36px / 2.25rem  — Bold    — Welcome screens
Heading 1:    28px / 1.75rem  — Bold    — Screen titles
Heading 2:    22px / 1.375rem — Semibold — Section headers
Heading 3:    18px / 1.125rem — Semibold — Card titles
Body Large:   16px / 1rem     — Regular  — Primary text, chat messages
Body:         14px / 0.875rem — Regular  — Secondary text
Caption:      12px / 0.75rem  — Medium   — Labels, timestamps
Overline:     11px / 0.6875rem — Bold uppercase — Category labels

Financial Figures:
  Amount:     24px / JetBrains Mono / Bold  — "$2,100"
  Detail:     14px / JetBrains Mono / Regular — Account numbers, dates
```

---

## Spacing & Layout

### Base Unit: 4px

```
XS:   4px   — Icon padding, tight spacing
SM:   8px   — Between related elements
MD:   16px  — Standard padding, card internal spacing
LG:   24px  — Between sections
XL:   32px  — Screen margins (mobile)
2XL:  48px  — Major section breaks
```

### Mobile Screen Layout

```
┌────────────────────────────┐
│ Status Bar                 │ System
├────────────────────────────┤
│ Navigation Bar    48px     │ App header
├────────────────────────────┤
│                            │
│  ┌────────────────────┐    │
│  │   Content Area     │    │ Scrollable
│  │   Padding: 20px    │    │
│  │                    │    │
│  │                    │    │
│  │                    │    │
│  │                    │    │
│  │                    │    │
│  └────────────────────┘    │
│                            │
├────────────────────────────┤
│ Bottom Action Area  80px   │ Fixed CTA
├────────────────────────────┤
│ Tab Bar             56px   │ Navigation
└────────────────────────────┘
```

---

## Component Library

### 1. Chat Bubble

```
AI Message:
┌──────────────────────────────────────┐
│  🔵 Harbor                           │
│                                      │
│  Hey Sarah! I'm here to help find    │
│  the best path forward for your      │
│  account. No judgment — just real    │
│  options. 💙                          │
│                                      │
│                          2:34 PM  ✓  │
└──────────────────────────────────────┘
  Background: #EEF2FF (Indigo-50)
  Border-radius: 20px 20px 20px 4px
  Font: 16px Inter Regular
  Shadow: 0 1px 3px rgba(0,0,0,0.08)

User Message:
                 ┌─────────────────────┐
                 │  I lost my job two   │
                 │  months ago and I'm  │
                 │  struggling to keep  │
                 │  up with payments    │
                 │                      │
                 │  2:35 PM          ✓  │
                 └─────────────────────┘
  Background: Linear gradient #0EA5E9 → #6366F1
  Text: White
  Border-radius: 20px 20px 4px 20px
```

### 2. Offer Card

```
┌──────────────────────────────────────┐
│  ⭐ RECOMMENDED                      │
│                                      │
│  Settle Your Balance                 │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     $2,100                     │  │
│  │     one-time payment           │  │
│  │                                │  │
│  │     You save $2,100 (50%)      │  │
│  └────────────────────────────────┘  │
│                                      │
│  ✓ Closes your account in good      │
│    standing                          │
│  ✓ No more interest charges          │
│  ✓ Reported as "Settled" to bureaus  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │       Accept This Offer        │  │ CTA: Gradient button
│  └────────────────────────────────┘  │
│                                      │
│  See payment timeline →              │ Text link
└──────────────────────────────────────┘

  Background: White
  Border: 2px solid #6366F1 (Indigo)
  Border-radius: 16px
  Shadow: 0 4px 20px rgba(99,102,241,0.15)
  Badge "RECOMMENDED": Background #6366F1, text white, 11px bold
  Amount: 32px JetBrains Mono Bold, color #1F2937
  Savings: 16px Inter Bold, color #10B981 (Emerald)
```

### 3. Financial Snapshot Card

```
┌──────────────────────────────────────┐
│  Your Financial Snapshot 📊          │
│                                      │
│  ┌─────────────┐  ┌─────────────┐   │
│  │  Monthly     │  │  Monthly    │   │
│  │  Income      │  │  Expenses   │   │
│  │  $2,400      │  │  $2,250     │   │
│  │  ↗ Gig work  │  │             │   │
│  └─────────────┘  └─────────────┘   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Disposable Income           │    │
│  │  $150/month                  │    │
│  │  ████░░░░░░░░░░░░░░  6%     │    │ Progress bar
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Savings                     │    │
│  │  $800                        │    │
│  └──────────────────────────────┘    │
│                                      │
│  Verified via Plaid 🔒  ·  As of    │
│  Mar 17                              │
└──────────────────────────────────────┘

  Background: Linear gradient #FAFBFC → #EEF2FF
  Border-radius: 16px
  Internal cards: White, border-radius 12px
  Amount font: 24px JetBrains Mono Bold
  Progress bar: Gradient #0EA5E9 → #6366F1
```

### 4. Progress Tracker

```
┌──────────────────────────────────────┐
│  Your Payment Plan Progress          │
│                                      │
│  ●────●────●────○────○────○────○     │
│  Jan  Feb  Mar  Apr  May  Jun  Jul   │
│                                      │
│  3 of 12 payments made ✓            │
│  $255 of $1,020 paid                │
│                                      │
│  ████████████░░░░░░░░░░░░  25%      │
│                                      │
│  Next payment: $85 on Apr 1          │
│  [Set Up Auto-Pay]                   │
└──────────────────────────────────────┘

  Completed dots: #10B981 (Emerald)
  Upcoming dots: #E5E7EB (Gray-200)
  Progress bar: Gradient #10B981 → #34D399
```

### 5. Consent Modal

```
┌──────────────────────────────────────┐
│                                      │
│  🔒 Connect Your Bank                │
│                                      │
│  To find the best option for you,    │
│  I need a quick look at your         │
│  financial picture.                  │
│                                      │
│  What I'll see:                      │
│  ✓ Income deposits                   │
│  ✓ Monthly expenses                  │
│  ✓ Account balances                  │
│                                      │
│  What I won't do:                    │
│  ✗ Move your money                   │
│  ✗ Share with third parties          │
│  ✗ Keep data after your case closes  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     Connect Securely 🔐       │  │ Gradient CTA
│  └────────────────────────────────┘  │
│                                      │
│  Skip for now (I'll ask questions    │
│  instead) →                          │
│                                      │
│  Powered by Plaid · Privacy Policy   │
└──────────────────────────────────────┘
```

---

## Motion & Animation

### Principles
- **Purposeful**: Animations communicate state changes, not decoration
- **Fast**: Max 300ms for transitions, 150ms for micro-interactions
- **Calming**: Ease-out curves (never bounce/spring for financial contexts)

### Key Animations

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Chat bubble appear | Fade up + scale from 0.95 | 200ms | ease-out |
| Offer card reveal | Slide up + fade | 300ms | ease-out |
| Progress bar fill | Width animation | 800ms | ease-in-out |
| Button press | Scale to 0.97 | 100ms | ease-out |
| Screen transition | Shared element + fade | 250ms | ease-out |
| Loading dots (AI typing) | Pulse animation | 1200ms loop | ease-in-out |
| Celebration (payment made) | Confetti particles | 2000ms | physics-based |

---

## Iconography

### Style: Outlined, 1.5px stroke, rounded caps

```
Navigation:
  Home         — house outline
  Chat         — chat bubble with dots
  My Plan      — checklist/calendar
  Settings     — gear

Actions:
  Connect bank — link chain icon
  Accept offer — checkmark in circle
  Call support — phone
  Share        — share/export

Status:
  Verified     — shield with check
  Pending      — clock
  Success      — checkmark
  Alert        — triangle with !
```

Icon set recommendation: **Lucide Icons** (open source, consistent with the design language)

---

## Agent Copilot Design (Windows)

### Layout: Three-Panel with Toolbar

```
┌──────────────────────────────────────────────────────────────────┐
│  ● ● ●   HarborAI Copilot   │ Search: [__________]  │ J.Smith │
├─────────────────┬────────────────────────┬───────────────────────┤
│ CUSTOMER PANEL  │ CONVERSATION PANEL     │ AI INSIGHTS PANEL     │
│ Width: 280px    │ Flex: 1 (grows)        │ Width: 320px          │
│ BG: Slate-900   │ BG: Slate-950          │ BG: Slate-900         │
│                 │                        │                       │
│ Dark theme      │ Dark theme with        │ Cards with subtle     │
│ Compact data    │ chat-style transcript  │ glow effects for      │
│ display         │                        │ key metrics           │
│                 │                        │                       │
│ Sections:       │ Features:              │ Sections:             │
│ • Identity      │ • Live transcript      │ • Score breakdown     │
│ • Account       │ • AI suggestions       │ • Offer config        │
│ • Financial     │ • Quick actions        │ • Compliance          │
│ • Risk          │ • Note-taking          │ • Actions             │
└─────────────────┴────────────────────────┴───────────────────────┘
```

### Copilot Color Scheme (Dark Mode Only)

```
Background:     #0F172A (Slate-900)
Surface:        #1E293B (Slate-800)
Elevated:       #334155 (Slate-700)
Border:         #475569 (Slate-600)
Text Primary:   #F8FAFC (Slate-50)
Text Secondary: #94A3B8 (Slate-400)

Accent:         #818CF8 (Indigo-400) — CTAs, active states
Success:        #34D399 (Emerald-400)
Warning:        #FBBF24 (Amber-400)
Danger:         #F87171 (Red-400)

Score Glow:
  High (70+):   0 0 12px rgba(52,211,153,0.3) — Green glow
  Medium (40-69): 0 0 12px rgba(251,191,36,0.3) — Amber glow
  Low (0-39):   0 0 12px rgba(248,113,113,0.3) — Red glow
```

### Agent Copilot is always dark mode because:
- Agents work 8+ hour shifts — dark mode reduces eye strain
- Dashboard-style data is easier to scan on dark backgrounds
- Subtle glow effects for scores work better on dark surfaces
- Matches modern professional tool aesthetics (VS Code, Bloomberg Terminal)

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| Mobile S | 320px | iPhone SE |
| Mobile M | 375px | iPhone 13/14 |
| Mobile L | 428px | iPhone 14 Pro Max |
| Tablet | 768px | iPad Mini |
| Desktop | 1024px+ | Agent Copilot (Electron) |
| Wide | 1440px+ | Agent Copilot (large monitor) |

---

## Figma Design Structure (Recommended)

```
📁 HarborAI Design System
├── 📄 Foundations
│   ├── Colors & Gradients
│   ├── Typography
│   ├── Spacing & Grid
│   ├── Shadows & Elevation
│   └── Icons
├── 📄 Components
│   ├── Buttons (Primary, Secondary, Ghost, Icon)
│   ├── Chat Bubbles (AI, User, System)
│   ├── Cards (Offer, Financial, Progress)
│   ├── Inputs (Text, Dropdown, Checkbox, Toggle)
│   ├── Modals (Consent, Confirmation, Alert)
│   ├── Navigation (Tab Bar, Top Bar, Breadcrumb)
│   └── Data Display (Score Gauge, Progress Bar, Table)
├── 📄 Mobile App Screens
│   ├── Onboarding (4 screens)
│   ├── Authentication (3 screens)
│   ├── Home Dashboard (2 states)
│   ├── Hardship Chat Flow (8 screens)
│   ├── Offer Presentation (3 variants)
│   ├── My Plan (4 screens)
│   └── Settings (3 screens)
└── 📄 Agent Copilot Screens
    ├── Login
    ├── Main Dashboard
    ├── Customer Detail View
    ├── Active Call View
    └── Manager Dashboard
```
