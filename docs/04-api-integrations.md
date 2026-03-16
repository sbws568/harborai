# Third-Party API Integration Specifications

## Overview

HarborAI integrates with external APIs to verify customer financial data, replacing self-reported information with verified sources. This document covers each integration, its purpose, data flows, and implementation details.

---

## 1. Plaid — Primary Financial Data Aggregator

### Why Plaid
- Largest bank coverage (12,000+ institutions in the US)
- Real-time transaction and balance data
- Income verification product
- Strong developer experience, well-documented SDKs
- SOC 2 Type II certified

### Products Used

| Plaid Product | Purpose | Pricing (est.) |
|---|---|---|
| **Plaid Link** | Customer bank connection UI | Included |
| **Transactions** | 24-month transaction history | $0.30/call |
| **Income (Payroll)** | Verified income from payroll providers | $4.00/call |
| **Assets** | Bank statements & asset verification | $3.00/call |
| **Identity** | Name, address, phone verification | $0.50/call |
| **Liabilities** | Credit card & loan balances | $1.00/call |

### Data Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Mobile  │────▶│  Plaid Link  │────▶│  Customer's  │
│   App    │     │  (WebView)   │     │    Bank      │
└──────────┘     └──────┬───────┘     └──────────────┘
                        │ public_token
                        ▼
                 ┌──────────────┐
                 │  HarborAI    │  exchange for access_token
                 │  Backend     │──────────────────────┐
                 └──────┬───────┘                      │
                        │                              ▼
                        │                       ┌──────────────┐
                        │                       │  Plaid API   │
                        │◀──────────────────────│  Server      │
                        │  transactions,        └──────────────┘
                        │  income, assets
                        ▼
                 ┌──────────────┐
                 │  Financial   │
                 │  Analysis    │
                 │  Engine      │
                 └──────────────┘
```

### Key API Endpoints

```javascript
// 1. Create Link Token (server-side)
POST /link/token/create
{
  "user": { "client_user_id": "harbor_user_123" },
  "client_name": "HarborAI",
  "products": ["transactions", "income_verification", "assets"],
  "country_codes": ["US"],
  "language": "en",
  "redirect_uri": "harborai://plaid-callback"
}

// 2. Exchange Public Token (after user completes Link)
POST /item/public_token/exchange
{
  "public_token": "public-sandbox-..."
}
// Returns: { "access_token": "access-sandbox-...", "item_id": "..." }

// 3. Get Transactions (last 90 days)
POST /transactions/sync
{
  "access_token": "access-sandbox-...",
  "count": 500
}

// 4. Get Income Verification
POST /credit/payroll_income/get
{
  "access_token": "access-sandbox-..."
}
// Returns: employer, pay frequency, gross/net income, YTD earnings

// 5. Get Asset Report
POST /asset_report/create
{
  "access_tokens": ["access-sandbox-..."],
  "days_requested": 90
}
// Returns: account balances, transaction history, asset summary
```

### Data We Extract

| Data Point | Source Endpoint | Used For |
|---|---|---|
| Monthly income (gross/net) | `/credit/payroll_income/get` | Ability Score |
| Income frequency & stability | Transactions analysis | Ability Score |
| Monthly rent/mortgage | Transactions (recurring) | Expense calculation |
| Monthly utilities | Transactions (recurring) | Expense calculation |
| Monthly loan payments | `/liabilities/get` | DTI calculation |
| Savings balance | `/accounts/get` | Liquid assets |
| Checking balance | `/accounts/get` | Available funds |
| Spending patterns | `/transactions/sync` | Variable expenses |

---

## 2. Finicity (Mastercard) — Secondary / Fallback Aggregator

### Why Finicity
- Better coverage for credit unions and smaller banks
- Mastercard backing (enterprise credibility)
- VOI/VOA reports pre-formatted for lending decisions
- Fallback when Plaid doesn't cover a specific institution

### Products Used

| Product | Purpose | Pricing (est.) |
|---|---|---|
| **Finicity Connect** | Customer bank connection | Included |
| **VOI (Verification of Income)** | Income verification report | $5.00/report |
| **VOA (Verification of Assets)** | Asset verification report | $4.00/report |
| **VOIE (Payroll)** | Direct payroll connection | $6.00/report |

### Data Flow
Same pattern as Plaid — customer connects via Finicity Connect widget, backend exchanges tokens, retrieves reports.

### Key API Endpoints

```javascript
// 1. Generate Connect URL
POST /connect/v2/generate
{
  "partnerId": "...",
  "customerId": "harbor_cust_123",
  "type": "voi",
  "webhook": "https://api.harborai.com/webhooks/finicity"
}

// 2. Get VOI Report
POST /decisioning/v2/customers/{customerId}/voi
{
  "accountIds": ["acc_123", "acc_456"],
  "reportCustomFields": [{ "label": "source", "value": "harborai" }]
}
// Returns: income streams, pay frequency, net/gross, employer

// 3. Get VOA Report
POST /decisioning/v2/customers/{customerId}/voa
{
  "accountIds": ["acc_123"]
}
// Returns: account balances, average daily balance, asset summary
```

---

## 3. IRS Income Verification (IVES / 4506-C)

### Why IRS Verification
- Gold standard for income verification
- Required for some regulatory pathways
- Validates self-reported and Plaid-reported income
- Useful for self-employed / gig workers without payroll

### Integration Options

| Option | Turnaround | Cost | Best For |
|---|---|---|---|
| **IVES (Income Verification Express)** | 2-3 business days | $2/transcript | Self-employed verification |
| **Direct IRS API (future)** | Real-time | TBD | Once available |
| **Third-party (Taxstatus.com / Finlocker)** | Same day | $5-10/pull | Faster processing |

### Recommended: Taxstatus.com API

```javascript
// 1. Initiate Consent
POST /api/v1/taxpayers
{
  "ssn": "encrypted_ssn",
  "first_name": "John",
  "last_name": "Doe",
  "consent_type": "4506-C",
  "years": [2024, 2023]
}

// 2. Get Transcript Data
GET /api/v1/taxpayers/{id}/transcripts
// Returns: AGI, filing status, W-2 income, 1099 income, tax owed
```

### Data We Extract

| Data Point | Used For |
|---|---|
| Adjusted Gross Income (AGI) | Annual income verification |
| W-2 income by employer | Employment verification |
| 1099 income | Gig/freelance income verification |
| Filing status | Household size estimation |

---

## 4. Anthropic Claude API — Conversational AI

### Configuration

```javascript
// System Prompt Architecture
const systemPrompt = `
You are Harbor, a compassionate financial assistance advisor.
Your role is to understand the customer's hardship situation
and guide them toward the best available relief option.

PERSONALITY:
- Warm, empathetic, non-judgmental
- Use simple language (8th grade reading level)
- Acknowledge emotions before asking questions
- Never use financial jargon without explanation

CONSTRAINTS:
- Never promise specific outcomes before assessment
- Never share internal scoring with the customer
- Always present at least 2 options when offering
- Never discourage the customer from seeking help
- If the customer expresses self-harm intent, immediately
  provide 988 Suicide & Crisis Lifeline information

CONTEXT (injected per-conversation):
- Customer name: {name}
- Product type: {product_type}
- Account balance: {balance}
- Days past due: {dpd}
- Financial data available: {has_plaid_data}
- Current conversation phase: {phase}
- Verified financials: {financial_snapshot}
`;

// API Call
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6-20250514",
  max_tokens: 500,
  system: systemPrompt,
  messages: conversationHistory,
  tools: [
    {
      name: "classify_intent",
      description: "Classify customer payment intent",
      input_schema: {
        type: "object",
        properties: {
          intent: { enum: ["payer", "partial_payer", "non_payer"] },
          confidence: { type: "number" },
          signals: { type: "array", items: { type: "string" } }
        }
      }
    },
    {
      name: "request_financial_data",
      description: "Trigger Plaid connection flow",
      input_schema: { type: "object", properties: {} }
    },
    {
      name: "generate_offer",
      description: "Request offer generation from decision engine",
      input_schema: {
        type: "object",
        properties: {
          ability_score: { type: "number" },
          intent_score: { type: "number" }
        }
      }
    }
  ]
});
```

### Token Usage Estimates

| Scenario | Input Tokens | Output Tokens | Cost (Sonnet) |
|---|---|---|---|
| Average conversation (8 turns) | ~4,000 | ~2,000 | $0.03 |
| Complex conversation (15 turns) | ~8,000 | ~4,000 | $0.06 |
| Agent copilot (per-call, 20 turns) | ~12,000 | ~6,000 | $0.09 |
| **Monthly estimate (10K conversations)** | | | **$400-600** |

---

## 5. Credit Bureau APIs (Optional Enhancement)

### Experian / TransUnion / Equifax

For real-time credit data to enhance risk scoring:

```javascript
// Experian Connect API
POST /credit/report
{
  "consumer": {
    "ssn": "encrypted",
    "firstName": "John",
    "lastName": "Doe"
  },
  "reportType": "soft_pull"  // No impact on customer score
}
// Returns: credit score, open accounts, payment history, inquiries
```

**Note**: Most lending institutions already have bureau data in their systems. The API integration is only needed if HarborAI is deployed as a standalone SaaS without access to the bank's internal bureau feeds.

---

## Data Privacy & Security

### Encryption
- All PII encrypted at rest (AES-256)
- All API calls over TLS 1.3
- Plaid access tokens encrypted in database with per-tenant keys
- Financial data retained for max 90 days post-resolution

### Consent Management
```
Customer grants consent for:
  ☑ Bank account connection (Plaid/Finicity)
  ☑ Income verification (IRS data)
  ☑ Financial data analysis for hardship assessment
  ☑ Data retention for [90 days / until resolution]

Customer can revoke at any time:
  → Triggers Plaid /item/remove
  → Purges all financial data from HarborAI
  → Conversation logs retained (regulatory requirement)
```

### Data Flow Security

```
Mobile App ──TLS 1.3──▶ API Gateway ──mTLS──▶ Backend
                                                │
                                     ┌──────────┼──────────┐
                                     ▼          ▼          ▼
                                  Plaid      Claude     Postgres
                                 (OAuth)    (API Key)  (Encrypted)
                                     │          │          │
                                     └──────────┼──────────┘
                                                │
                                          Audit Log
                                        (Immutable)
```
