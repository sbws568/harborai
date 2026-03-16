# Development Phases & Deployment Plan

## Timeline Overview

```
Phase 0: Foundation          ██████░░░░░░░░░░░░░░░░░░  Weeks 1-4
Phase 1: Core AI Engine      ░░░░░░██████████░░░░░░░░  Weeks 5-12
Phase 2: Mobile App (MVP)    ░░░░░░░░░░██████████░░░░  Weeks 9-16
Phase 3: Agent Copilot       ░░░░░░░░░░░░░░██████████  Weeks 13-20
Phase 4: Integration & QA    ░░░░░░░░░░░░░░░░░░██████  Weeks 17-22
Phase 5: Pilot & Launch      ░░░░░░░░░░░░░░░░░░░░████  Weeks 21-24
```

**Total Duration: 24 weeks (6 months)**

---

## Phase 0: Foundation (Weeks 1-4)

### Objective
Set up infrastructure, CI/CD, design system, and data architecture.

### Deliverables

| # | Task | Owner | Duration |
|---|---|---|---|
| 0.1 | Cloud infrastructure setup (AWS/GCP) | DevOps | Week 1-2 |
| 0.2 | CI/CD pipeline (GitHub Actions → ECS/Cloud Run) | DevOps | Week 1-2 |
| 0.3 | Design system creation in Figma | Design | Week 1-3 |
| 0.4 | API gateway & auth service (OAuth 2.0 + PKCE) | Backend | Week 2-3 |
| 0.5 | Database schema design (PostgreSQL + Redis) | Backend | Week 2-3 |
| 0.6 | React Native project scaffold (Expo) | Mobile | Week 3-4 |
| 0.7 | Electron app scaffold (for Agent Copilot) | Desktop | Week 3-4 |
| 0.8 | LLM integration layer (Anthropic SDK) | AI/ML | Week 2-4 |
| 0.9 | Plaid/Finicity sandbox setup | Integration | Week 3-4 |
| 0.10 | Compliance framework documentation | Legal/PM | Week 1-4 |

### Tech Stack Decisions

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native (Expo) | Cross-platform iOS/Android, fast iteration |
| Desktop Copilot | Electron + React | Windows-first, web tech reuse |
| Backend API | Node.js (NestJS) | TypeScript end-to-end, strong ecosystem |
| AI/LLM | Anthropic Claude API | Best empathy + safety, see evaluation |
| Database | PostgreSQL 16 | ACID compliance, JSON support for flex data |
| Cache | Redis | Session state, conversation context |
| Message Queue | AWS SQS / GCP Pub/Sub | Async processing, event-driven architecture |
| Search | Elasticsearch | Conversation history search, audit logs |
| Auth | Auth0 / AWS Cognito | Enterprise SSO, MFA, compliance |
| Data Aggregation | Plaid (primary), Finicity (fallback) | Financial data APIs |
| Monitoring | Datadog + Sentry | APM, error tracking, LLM observability |
| Storage | AWS S3 | Document storage, conversation exports |

---

## Phase 1: Core AI Engine (Weeks 5-12)

### Objective
Build the AI decision engine — the brain of HarborAI.

### Deliverables

| # | Task | Owner | Duration |
|---|---|---|---|
| 1.1 | Conversation orchestrator (manages multi-turn dialogue) | AI/ML | Week 5-8 |
| 1.2 | Intent classifier (Payer / Partial / Non-Payer) | AI/ML | Week 5-7 |
| 1.3 | Ability scoring model | AI/ML + Data | Week 6-9 |
| 1.4 | Intent scoring model | AI/ML + Data | Week 6-9 |
| 1.5 | Composite scoring & offer determination engine | AI/ML + Backend | Week 8-10 |
| 1.6 | Settlement percentage calculator | Backend | Week 9-10 |
| 1.7 | Compliance rules engine (product-specific guardrails) | Backend + Legal | Week 8-11 |
| 1.8 | Plaid integration — income verification | Integration | Week 5-8 |
| 1.9 | Plaid integration — expense categorization | Integration | Week 7-10 |
| 1.10 | IRS Income Verification API (4506-T/C) integration | Integration | Week 9-12 |
| 1.11 | Financial data normalization pipeline | Data Eng | Week 7-10 |
| 1.12 | LLM prompt engineering & tuning (empathy, accuracy) | AI/ML | Week 5-12 |
| 1.13 | Conversation logging & audit trail | Backend | Week 10-12 |
| 1.14 | A/B testing framework for offers | Backend | Week 11-12 |

### Key Technical Decisions

**Conversation Orchestrator Architecture:**
```
┌─────────────────────────────────────────┐
│         Conversation Orchestrator       │
│                                         │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │ Context  │  │ State    │  │ Guard  │ │
│  │ Manager  │  │ Machine  │  │ Rails  │ │
│  │ (Redis)  │  │ (XState) │  │ Engine │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │             │            │       │
│       ▼             ▼            ▼       │
│  ┌──────────────────────────────────┐   │
│  │        LLM Prompt Builder        │   │
│  │   System prompt + Context +      │   │
│  │   Financial data + Guardrails    │   │
│  └──────────────┬───────────────────┘   │
│                 │                        │
│                 ▼                        │
│  ┌──────────────────────────────────┐   │
│  │     Claude API (Anthropic)       │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Phase 2: Mobile App MVP (Weeks 9-16)

### Objective
Build the customer-facing mobile app for self-serve hardship assistance.

### Deliverables

| # | Task | Owner | Duration |
|---|---|---|---|
| 2.1 | Onboarding flow (auth, account linking) | Mobile | Week 9-10 |
| 2.2 | Chat UI (conversational interface) | Mobile | Week 9-11 |
| 2.3 | Plaid Link integration (bank connection) | Mobile + Integration | Week 10-12 |
| 2.4 | Financial snapshot screen | Mobile | Week 12-13 |
| 2.5 | Offer presentation UI (cards, comparison) | Mobile | Week 12-14 |
| 2.6 | Offer acceptance & e-signature flow | Mobile + Backend | Week 13-15 |
| 2.7 | Payment scheduling & reminders | Mobile + Backend | Week 14-15 |
| 2.8 | Progress tracker (payment plan adherence) | Mobile | Week 15-16 |
| 2.9 | Push notifications | Mobile | Week 15-16 |
| 2.10 | Accessibility audit (WCAG 2.1 AA) | Design + QA | Week 15-16 |

### Mobile App Screen Map

```
Splash → Login/Signup
  │
  ├── Home Dashboard
  │   ├── Account Summary (balance, DPD, status)
  │   ├── Active Offers / Plans
  │   └── Quick Actions
  │
  ├── Hardship Chat (main flow)
  │   ├── Welcome & consent
  │   ├── Bank connection (Plaid)
  │   ├── Conversational assessment
  │   ├── Financial snapshot review
  │   ├── Offer presentation
  │   ├── Offer details & comparison
  │   └── Acceptance & confirmation
  │
  ├── My Plan
  │   ├── Payment schedule
  │   ├── Progress tracker
  │   ├── Next payment reminder
  │   └── Modify request
  │
  └── Settings
      ├── Profile
      ├── Connected accounts
      ├── Notifications
      └── Help & FAQ
```

---

## Phase 3: Agent Copilot (Weeks 13-20)

### Objective
Build the Windows desktop application for operations teams.

### Deliverables

| # | Task | Owner | Duration |
|---|---|---|---|
| 3.1 | Electron app shell + Windows installer | Desktop | Week 13-14 |
| 3.2 | Agent authentication (SSO/LDAP) | Desktop + Backend | Week 13-14 |
| 3.3 | Customer lookup & account overview panel | Desktop | Week 14-15 |
| 3.4 | Real-time conversation transcript panel | Desktop + AI | Week 15-17 |
| 3.5 | AI-suggested responses & next-best-actions | AI + Desktop | Week 16-18 |
| 3.6 | Financial data panel (Plaid data visualization) | Desktop | Week 17-18 |
| 3.7 | Offer configuration panel (manual overrides) | Desktop + Backend | Week 18-19 |
| 3.8 | Compliance checklist & guardrails display | Desktop | Week 19-20 |
| 3.9 | Call notes & disposition codes | Desktop + Backend | Week 19-20 |
| 3.10 | Manager dashboard (team metrics, approval queue) | Desktop | Week 19-20 |

### Copilot Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  HarborAI Agent Copilot                    Agent: J.Smith  ⚙️   │
├─────────────────┬────────────────────────┬───────────────────────┤
│                 │                        │                       │
│  CUSTOMER       │  CONVERSATION          │  AI INSIGHTS          │
│  PANEL          │  PANEL                 │  PANEL                │
│                 │                        │                       │
│  John D.        │  [Live transcript      │  Intent: Partial      │
│  CC: ****4521   │   or chat view]        │  Payer (78%)          │
│  Balance: $4.2K │                        │                       │
│  DPD: 62        │  Agent: "Hi John..."   │  Ability Score: 42    │
│  Risk: Medium   │  Customer: "I lost..." │  Intent Score: 72     │
│                 │                        │  Risk Score: 55       │
│  ─────────────  │                        │                       │
│  FINANCIAL      │  [Suggested response]  │  ─────────────────    │
│  SNAPSHOT       │  "I understand that    │  RECOMMENDED OFFER    │
│                 │   must be really       │                       │
│  Income: $2.4K  │   stressful..."        │  Settlement: 50%      │
│  Expenses: $2.2K│                        │  ($2,100)             │
│  DTI: 78%       │  [Use] [Edit] [Skip]   │                       │
│  Savings: $800  │                        │  Alt: $85/mo × 12     │
│                 │                        │                       │
│  ─────────────  │                        │  [Generate Offer]     │
│  COMPLIANCE ✓   │                        │  [Override]           │
│  ☑ FFIEC logged │                        │  [Escalate]           │
│  ☑ Consent      │                        │                       │
│  ☐ Offer sent   │                        │                       │
│                 │                        │                       │
└─────────────────┴────────────────────────┴───────────────────────┘
```

---

## Phase 4: Integration & QA (Weeks 17-22)

### Deliverables

| # | Task | Owner | Duration |
|---|---|---|---|
| 4.1 | End-to-end integration testing | QA | Week 17-19 |
| 4.2 | Load testing (1000 concurrent conversations) | DevOps + QA | Week 18-19 |
| 4.3 | Security audit & penetration testing | Security | Week 18-20 |
| 4.4 | LLM response quality audit (500 test scenarios) | AI/ML + QA | Week 18-20 |
| 4.5 | Compliance review & sign-off | Legal + Compliance | Week 19-21 |
| 4.6 | Disparate impact testing (ECOA) | Data + Legal | Week 19-21 |
| 4.7 | UAT with operations team | PM + QA | Week 20-22 |
| 4.8 | App Store submission (iOS/Android) | Mobile + DevOps | Week 21-22 |
| 4.9 | Windows MSI package & distribution | Desktop + DevOps | Week 21-22 |
| 4.10 | Documentation & training materials | PM + Design | Week 20-22 |

---

## Phase 5: Pilot & Launch (Weeks 21-24)

### Deliverables

| # | Task | Owner | Duration |
|---|---|---|---|
| 5.1 | Pilot cohort selection (500 accounts, 10 agents) | PM + Ops | Week 21 |
| 5.2 | Soft launch — mobile app (invite-only) | All | Week 22 |
| 5.3 | Agent copilot rollout (pilot team) | Desktop + Ops | Week 22 |
| 5.4 | Monitor & iterate (daily standups, KPI tracking) | All | Week 22-24 |
| 5.5 | Full launch — mobile app (all eligible accounts) | All | Week 24 |
| 5.6 | Full rollout — agent copilot (all agents) | All | Week 24 |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CDN (CloudFront/Fastly)               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                   API Gateway (Kong/AWS)                  │
│              Rate limiting, Auth, Routing                 │
└──────┬──────────┬──────────────┬────────────────────────┘
       │          │              │
       ▼          ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Auth     │ │ Core API │ │ AI Service   │
│ Service  │ │ (NestJS) │ │ (Python/     │
│ (Cognito)│ │          │ │  FastAPI)    │
└──────────┘ └────┬─────┘ └──────┬───────┘
                  │              │
           ┌──────┴──────┐  ┌───┴────────┐
           │             │  │            │
           ▼             ▼  ▼            ▼
      ┌────────┐  ┌────────┐  ┌──────────────┐
      │Postgres│  │ Redis  │  │ Anthropic    │
      │  (RDS) │  │(Cache) │  │ Claude API   │
      └────────┘  └────────┘  └──────────────┘
                                     │
                              ┌──────┴───────┐
                              │   Plaid /    │
                              │   Finicity   │
                              └──────────────┘
```

### Environments

| Environment | Purpose | Infrastructure |
|---|---|---|
| Development | Feature development | Local Docker + cloud sandbox |
| Staging | Integration testing | Mirrors production, synthetic data |
| UAT | User acceptance testing | Mirrors production, anonymized data |
| Production | Live users | Multi-AZ, auto-scaling, encrypted |

### CI/CD Pipeline

```
Push → Lint/Format → Unit Tests → Build → Integration Tests
  → Security Scan (Snyk) → Deploy to Staging → E2E Tests
  → Manual Approval → Deploy to Production → Smoke Tests
  → Monitor (Datadog alerts)
```

---

## Team Structure

| Role | Count | Phase Active |
|---|---|---|
| Product Manager | 1 | All |
| Tech Lead | 1 | All |
| AI/ML Engineer | 2 | Phase 0-4 |
| Backend Engineer | 2 | All |
| Mobile Engineer (React Native) | 2 | Phase 0, 2-4 |
| Desktop Engineer (Electron) | 1 | Phase 0, 3-4 |
| UX Designer | 1 | Phase 0-3 |
| QA Engineer | 1 | Phase 2-5 |
| DevOps/SRE | 1 | All |
| Compliance/Legal (part-time) | 1 | Phase 0, 1, 4 |

**Total: 13 people (11 FTE + 2 part-time)**

---

## Budget Estimate (6 months)

| Category | Monthly | Total (6mo) |
|---|---|---|
| Team (13 × avg $15K/mo) | $195,000 | $1,170,000 |
| Cloud Infrastructure | $5,000 | $30,000 |
| Anthropic Claude API | $3,000 | $18,000 |
| Plaid API | $2,000 | $12,000 |
| Tools & Licenses | $2,000 | $12,000 |
| Security Audit | - | $25,000 |
| App Store Fees | - | $300 |
| **Total** | | **$1,267,300** |
