# Experiments
My little pet projects, part of exploration cum quest in the AI realm.

---

# HarborAI — Hardship Assistance Reimagined

> AI-native hardship assistance platform that replaces rigid rule-based questionnaires with empathetic, intelligent conversations — powered by LLMs and verified financial data.

## What is HarborAI?

HarborAI transforms how lending institutions handle financial hardship by combining:
- **Conversational AI** — Natural, empathetic conversations (not rigid questionnaires)
- **Verified Financial Data** — Real income/expense data via Plaid, Finicity, IRS APIs
- **AI Decision Engine** — Personalized offers based on actual ability + intent to pay
- **Dual Interface** — Self-serve mobile app for customers + Copilot for operations agents

## Project Structure

```
├── docs/
│   ├── 01-product-vision.md          — Product vision, problem statement, success metrics
│   ├── 02-ai-decision-engine.md      — AI workflow, scoring models, offer logic
│   ├── 03-development-phases.md      — 6-phase dev plan, team structure, budget
│   ├── 04-api-integrations.md        — Plaid, Finicity, IRS, Claude API specs
│   ├── 05-design-system.md           — Colors, typography, components, UI specs
│   └── 06-system-architecture.md     — System design, DB schema, API endpoints
│
├── prototype/
│   ├── mobile/                       — React Native (Expo) customer app prototype
│   └── copilot/                      — Electron + React agent copilot prototype
│
├── design/                           — Design assets and Figma references
└── architecture/                     — Architecture diagrams
```

## Quick Start

### Mobile App Prototype
```bash
cd prototype/mobile
npm install
npx expo start
```

### Agent Copilot Prototype
```bash
cd prototype/copilot
npm install
npm run dev
```

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| LLM | Anthropic Claude | Best empathy + safety for financial contexts |
| Mobile | React Native (Expo) | Cross-platform, fast iteration |
| Desktop | Electron + React | Windows-first, web tech reuse |
| Backend | NestJS (TypeScript) | Type-safe, enterprise-grade |
| AI Service | Python FastAPI | ML ecosystem, Claude SDK |
| Financial Data | Plaid (primary) | Largest bank coverage (12K+ institutions) |
| Database | PostgreSQL | ACID compliance, JSONB for flexible data |

## Development Phases

| Phase | Duration | Focus |
|---|---|---|
| 0: Foundation | Weeks 1-4 | Infrastructure, design system, scaffolding |
| 1: AI Engine | Weeks 5-12 | Decision engine, Plaid integration, scoring models |
| 2: Mobile MVP | Weeks 9-16 | Customer-facing chat app |
| 3: Agent Copilot | Weeks 13-20 | Operations desktop tool |
| 4: Integration & QA | Weeks 17-22 | Testing, security audit, compliance |
| 5: Pilot & Launch | Weeks 21-24 | Soft launch, iterate, full rollout |

## How It's Different from Today's Process

| Today (Rule-Based) | HarborAI (AI-Powered) |
|---|---|
| Fixed questionnaire (5 rigid questions) | Natural conversation that adapts |
| Self-reported income/expenses | Verified data via Plaid/IRS |
| Same buckets for everyone | Personalized scoring per customer |
| 25-min phone calls | < 5 min self-serve |
| Agent reads from script | AI copilot suggests responses |
| Binary offer (take it or leave it) | Multiple tailored options |

---

Built with empathy. Powered by AI.
