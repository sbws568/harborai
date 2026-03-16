# AI Decision Engine — Workflow & Architecture

## Overview

The AI Decision Engine replaces the static if-else questionnaire with a multi-signal intelligence layer that combines:

1. **Conversational AI** (intent & ability signals from natural language)
2. **Verified Financial Data** (income, expenses, assets via 3rd-party APIs)
3. **Account Risk Data** (DPD, balance, product type, behavioral score)
4. **Regulatory Constraints** (FFIEC, CFPB, UDAAP compliance rules)

---

## Decision Engine Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER TOUCHPOINT                       │
│            (Mobile App / Agent Copilot / IVR)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 CONVERSATIONAL AI LAYER                      │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ LLM Engine  │  │ Sentiment &  │  │ Intent Classifier │  │
│  │ (Claude /   │  │ Empathy      │  │                   │  │
│  │  GPT-4)     │  │ Detection    │  │ • Payer           │  │
│  │             │  │              │  │ • Partial Payer   │  │
│  │             │  │              │  │ • Non-Payer       │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              FINANCIAL VERIFICATION LAYER                    │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Plaid   │ │ Finicity │ │  Yodlee  │ │ IRS Income   │  │
│  │ (Bank    │ │ (Alt     │ │ (Legacy  │ │ Verification │  │
│  │  Link)   │ │  data)   │ │  banks)  │ │ (4506-T/C)   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│                                                             │
│  Outputs:                                                   │
│  • Monthly gross/net income (verified)                      │
│  • Monthly fixed expenses (rent, utilities, insurance)      │
│  • Monthly variable expenses (food, transport, discretionary)│
│  • Available liquid assets (savings, investments)           │
│  • Debt-to-income ratio (DTI)                               │
│  • Disposable income estimate                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI DECISION ENGINE                          │
│                                                             │
│  Inputs:                                                    │
│  ├── Conversational signals (intent, sentiment, urgency)    │
│  ├── Verified financials (income, DTI, disposable income)   │
│  ├── Account data (DPD, balance, product, risk score)       │
│  └── Regulatory constraints (product-specific rules)        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SCORING MODEL                           │   │
│  │                                                      │   │
│  │  Ability Score (0-100)                               │   │
│  │  = f(verified_income, DTI, disposable_income,        │   │
│  │      liquid_assets, expense_stability)               │   │
│  │                                                      │   │
│  │  Intent Score (0-100)                                │   │
│  │  = f(conversational_signals, payment_history,        │   │
│  │      engagement_level, hardship_reason)              │   │
│  │                                                      │   │
│  │  Risk Score (0-100) [from existing models]           │   │
│  │  = f(DPD, balance, behavioral_score, bureau_data)    │   │
│  │                                                      │   │
│  │  Composite Score = w1*Ability + w2*Intent + w3*Risk  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           OFFER DETERMINATION MATRIX                 │   │
│  │                                                      │   │
│  │  Score Range    │ Offer Path                         │   │
│  │  ──────────────────────────────────────────────      │   │
│  │  80-100         │ Reage / Extension                  │   │
│  │  65-79          │ Short-Term Payment Plan (≤12mo)    │   │
│  │  50-64          │ Long-Term Payment Plan (60-72mo)   │   │
│  │  35-49          │ Settlement (35-60% based on risk)  │   │
│  │  15-34          │ Settlement (aggressive, 35-45%)    │   │
│  │  0-14           │ Credit Counseling Referral         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               OFFER PRESENTATION LAYER                      │
│                                                             │
│  • Primary offer (best match)                               │
│  • Alternative offers (1-2 options)                         │
│  • Clear explanation of each option                         │
│  • Impact visualization (timeline, total cost)              │
│  • One-tap acceptance                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Conversational AI Workflow

### Phase 1: Warm Welcome & Context Setting

```
AI: "Hey [First Name] 👋 I'm here to help figure out the best path
     forward for your [product type] account. No judgment, no pressure
     — just options that actually work for your situation.

     Before we dive in, would you be comfortable connecting your bank
     account so I can see your full financial picture? This helps me
     find you the best possible option."

     [Connect My Bank]  [Skip for Now]
```

### Phase 2: Understanding the Situation (Replaces Q1)

Instead of a dropdown, the AI has a natural conversation:

```
AI: "Can you tell me a bit about what's been going on? What's making
     it tough to keep up with payments right now?"

Customer: "I got laid off two months ago and I've been doing gig work
           but it's not enough to cover everything"

AI Internally Classifies:
  → Hardship Reason: Job Loss (primary), Income Reduction (secondary)
  → Employment Status: Gig/Freelance (unstable)
  → Duration: ~2 months
  → Emotional State: Stressed but proactive
```

### Phase 3: Gauging Intent (Replaces Q2)

```
AI: "That sounds really stressful, and it's great that you're being
     proactive about this. Are you getting close to landing something
     more stable, or is it still pretty uncertain?"

Customer: "I have some interviews lined up but nothing confirmed yet.
           I can probably pay something small each month."

AI Internally Classifies:
  → Intent: Partial Payer (willing but limited)
  → Recovery Timeline: 1-3 months (uncertain)
  → Payment Capacity: Reduced (self-reported)
```

### Phase 4: Financial Verification (Replaces Q2.x sub-questions)

If bank connected via Plaid:
```
AI Internally Processes:
  → Verified Monthly Income: $2,400 (gig deposits, irregular)
  → Monthly Fixed Expenses: $1,850 (rent, utilities, car, insurance)
  → Monthly Variable Expenses: $400 (food, transport)
  → Disposable Income: $150/month
  → Savings Balance: $800
  → DTI Ratio: 78%

  → Ability Score: 28/100 (low disposable income, minimal savings)
  → Intent Score: 72/100 (proactive, willing, job-seeking)
  → Risk Score: 55/100 (60 DPD, $4,200 balance)

  → Composite Score: 48 → Settlement Path
```

If bank NOT connected:
```
AI: "No worries! Let me ask a few quick questions instead.

     Roughly how much are you bringing in each month right now —
     even if it's not steady?"

[Follow-up questions to approximate the same data points]
```

### Phase 5: Personalized Offer

```
AI: "Based on everything you've shared and your financial snapshot,
     here's what I can offer:

     ┌──────────────────────────────────┐
     │  ⭐ RECOMMENDED                  │
     │  Settle for $2,100 (50%)         │
     │  One-time payment                │
     │  Saves you $2,100               │
     │  [Accept This Offer]             │
     └──────────────────────────────────┘

     ┌──────────────────────────────────┐
     │  ALTERNATIVE                     │
     │  Payment Plan: $85/mo × 12mo     │
     │  Reduced APR (12.5% → 6.25%)    │
     │  Starts next month               │
     │  [See Details]                   │
     └──────────────────────────────────┘

     ┌──────────────────────────────────┐
     │  NEED MORE HELP?                 │
     │  Free credit counseling          │
     │  with certified NFCC partner     │
     │  [Connect Me]                    │
     └──────────────────────────────────┘"
```

---

## Scoring Model Details

### Ability Score (0-100)

| Factor | Weight | Source | Scoring Logic |
|---|---|---|---|
| Disposable Income Ratio | 30% | Plaid/Finicity | (disposable_income / min_payment) × 100 |
| Income Stability | 20% | Plaid (3mo txn) | CV of monthly income (lower = better) |
| Liquid Assets | 20% | Plaid | liquid_assets / total_outstanding_balance |
| DTI Ratio | 15% | Plaid + Bureau | Inverse scale (lower DTI = higher score) |
| Employment Signals | 15% | Plaid + Conversation | Regular payroll = high, gig = medium, none = low |

### Intent Score (0-100)

| Factor | Weight | Source | Scoring Logic |
|---|---|---|---|
| Self-reported willingness | 25% | Conversation | NLP classification of payment intent |
| Proactiveness | 20% | Engagement | Initiated contact = high, responded to outreach = medium |
| Payment History (pre-hardship) | 20% | Account Data | Years of on-time payments before delinquency |
| Engagement Quality | 15% | Conversation | Responsive, provides info, asks questions = high |
| Recovery Signals | 20% | Conversation + Plaid | Job seeking, increasing income trend, etc. |

### Risk Score (0-100)

| Factor | Weight | Source |
|---|---|---|
| Days Past Due | 25% | Account Data |
| Roll Rate Probability | 25% | Internal ML Model |
| Outstanding Balance | 20% | Account Data |
| Bureau Score Trend | 15% | Credit Bureau |
| Product Type Risk | 15% | Internal Risk Tables |

---

## Settlement Percentage Logic

```
Settlement % = Base_Rate + Risk_Adjustment + Ability_Adjustment

Where:
  Base_Rate = 50%  (of outstanding balance)

  Risk_Adjustment:
    Roll probability > 80%  → -15% (offer 35%)
    Roll probability 60-80% → -10% (offer 40%)
    Roll probability 40-60% → -5%  (offer 45%)
    Roll probability < 40%  → +0%  (offer 50%)

  Ability_Adjustment:
    Ability Score > 60      → +10% (offer higher, they can pay)
    Ability Score 30-60     → +0%  (neutral)
    Ability Score < 30      → -5%  (offer lower, they truly can't)

  Final Range: 35% - 60% of outstanding balance

  Guardrails:
    - Never below 35% (regulatory floor)
    - Never above 60% (customer value floor)
    - Requires manager approval if < 40%
```

---

## Product-Specific Rules

### Credit Cards (Revolving)
- **Cannot offer term extensions** (no fixed term to extend)
- **Reage eligible**: After 2 consecutive qualifying payments
- Settlement: Available at 60+ DPD
- Payment Plans: Short-term (≤12mo) or Long-term (60-72mo) with reduced APR

### Personal Loans (Installment)
- **Term Extension eligible**: Up to 12-month extension
- **No reage** (use term extension instead)
- Settlement: Available at 90+ DPD
- Payment Plans: Modified payment schedule with extended term

---

## Compliance Guardrails

| Regulation | Requirement | How HarborAI Complies |
|---|---|---|
| FFIEC | Document hardship reason & timeline | All conversation data logged with timestamps |
| CFPB | Fair treatment, no deceptive practices | AI responses reviewed by compliance team, offer logic auditable |
| UDAAP | No unfair, deceptive, abusive acts | Transparent offer explanations, all alternatives shown |
| FCRA | Accurate credit reporting | Offer acceptance/rejection tracked, credit reporting updated |
| ECOA | No discriminatory offers | Scoring model excludes protected classes, disparate impact testing |
| TCPA | Consent for communications | Explicit opt-in captured in-app |
| GLBA | Financial data privacy | Plaid/Finicity data encrypted, consent-based, time-limited |

---

## LLM Selection & Rationale

### Recommended: Claude (Anthropic)

| Criteria | Claude | GPT-4 | Gemini |
|---|---|---|---|
| Empathy in tone | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Instruction following | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Safety/guardrails | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Cost (per 1M tokens) | $15 (Sonnet) | $30 (GPT-4o) | $7 (Pro) |
| Latency | Fast | Fast | Fast |
| Financial domain | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation**: Use Claude Sonnet for real-time conversations (cost-effective, empathetic), Claude Opus for complex decision synthesis, and a fine-tuned classifier for intent/ability scoring.
