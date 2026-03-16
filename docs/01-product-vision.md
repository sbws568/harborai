# HarborAI — Hardship Assistance Reimagined

## Product Vision

**HarborAI** is an AI-native hardship assistance platform that replaces rigid rule-based questionnaires with empathetic, intelligent conversations — powered by LLMs and real financial data. It serves two personas simultaneously:

1. **Customer Self-Serve App** (iOS/Android) — A mobile-first experience where distressed borrowers can get personalized hardship relief without calling anyone.
2. **Agent Copilot** (Windows Desktop) — A real-time decision-support tool for operations teams handling inbound/outbound hardship calls.

---

## Problem Statement

Today's hardship assistance workflow is:
- **Rigid**: A fixed if-else decision tree that treats every customer the same regardless of their actual financial situation.
- **Slow**: Requires phone calls, hold times, and multiple agent transfers.
- **Inaccurate**: Relies entirely on self-reported data — customers often under/over-state their financial position.
- **Impersonal**: Scripted questions feel cold during one of the most stressful moments in a customer's financial life.

## Solution

HarborAI transforms hardship assistance through:

| Capability | How It Works |
|---|---|
| **Conversational AI Intake** | LLM-powered natural conversation replaces rigid Q&A trees. The AI gauges intent, emotional state, and willingness to pay through conversational cues. |
| **Verified Financial Data** | With customer consent, pull real income/expense data from Plaid, Finicity, Yodlee, or IRS transcript APIs — replacing self-reported guesswork. |
| **AI Decision Engine** | Combines conversational signals + verified financials + account risk data to recommend the optimal assistance path. |
| **Personalized Offers** | Each customer gets a tailored offer based on their actual ability to pay, not a one-size-fits-all bucket. |
| **Agent Augmentation** | For phone-based interactions, the copilot listens in real-time, surfaces insights, and suggests next-best-actions. |

---

## Target Users

### Primary: Distressed Borrowers
- Credit card holders 30-180 DPD (days past due)
- Personal loan borrowers missing payments
- Age range: 22-55 (hence the Gen-Z forward design)
- Tech comfort: moderate to high (mobile-first users)

### Secondary: Operations Team (Hardship Agents)
- Bank employees handling 40-80 hardship calls/day
- Need rapid context switching between accounts
- Value speed, accuracy, and compliance guardrails

---

## Product Principles

1. **Empathy First** — Every interaction should feel like talking to someone who cares, not a bureaucratic form.
2. **Data Over Declarations** — Verified data > self-reported answers. Always.
3. **Speed to Resolution** — Reduce time-to-offer from 25 minutes (avg call) to < 5 minutes (self-serve).
4. **Compliance by Design** — FFIEC, CFPB, UDAAP, and FCRA guardrails baked into every AI decision.
5. **Transparency** — Customers always see why they got a specific offer and what alternatives exist.

---

## Success Metrics (North Stars)

| Metric | Current Baseline | Target (6mo post-launch) |
|---|---|---|
| Self-serve completion rate | 0% (no self-serve) | 45% |
| Avg time to offer | 25 min (phone) | < 5 min (self-serve), < 12 min (agent) |
| Customer satisfaction (CSAT) | 3.1/5 | 4.2/5 |
| First-contact resolution | 62% | 85% |
| Settlement acceptance rate | 38% | 55% |
| Payment plan adherence (90-day) | 44% | 65% |
| Agent handle time | 25 min | 12 min |

---

## Competitive Landscape

| Player | Approach | Gap |
|---|---|---|
| **TrueAccord** | AI-driven collections (email/SMS) | No real-time conversation, no verified financials |
| **Indebted** | ML-powered collections | Collections-focused, not hardship assistance |
| **FICO Debt Manager** | Rule-based decision engine | No conversational AI, no data aggregation |
| **In-house tools** | If-else questionnaires | Rigid, no personalization, no verified data |

**HarborAI's moat**: The combination of conversational AI + verified financial data + real-time agent copilot is unique in the market.

---

## Revenue Model (if SaaS)

- **Per-account pricing**: $2-5/account entering hardship workflow
- **Success fee**: 0.5-1% of recovered amount on settlements
- **Platform license**: $50K-200K/year for agent copilot (tiered by seat count)
