# System Architecture — HarborAI

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                    │
│                                                                         │
│  ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐   │
│  │  Mobile App       │    │  Agent Copilot   │    │  Admin Portal   │   │
│  │  (React Native    │    │  (Electron +     │    │  (React SPA)    │   │
│  │   / Expo)         │    │   React)         │    │                 │   │
│  │                   │    │                  │    │                 │   │
│  │  iOS / Android    │    │  Windows         │    │  Web            │   │
│  └────────┬──────────┘    └────────┬─────────┘    └───────┬─────────┘   │
│           │ HTTPS                  │ HTTPS/WSS           │ HTTPS        │
└───────────┼────────────────────────┼─────────────────────┼──────────────┘
            │                        │                     │
            ▼                        ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EDGE LAYER                                      │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  CDN (CloudFront)                                                │   │
│  │  → Static assets, app bundles                                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  API Gateway (AWS API Gateway / Kong)                            │   │
│  │  → Rate limiting (100 req/min per user)                          │   │
│  │  → JWT validation                                                │   │
│  │  → Request routing                                               │   │
│  │  → Request/Response logging                                      │   │
│  └──────────────────────────┬───────────────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                                 │
│                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────────┐  │
│  │  Auth Service   │  │  Core API      │  │  AI Service              │  │
│  │  (Cognito /     │  │  (NestJS)      │  │  (Python FastAPI)        │  │
│  │   Auth0)        │  │                │  │                          │  │
│  │                 │  │  Endpoints:    │  │  • Conversation          │  │
│  │  • OAuth 2.0    │  │  • /accounts   │  │    Orchestrator          │  │
│  │  • PKCE flow    │  │  • /hardship   │  │  • Intent Classifier     │  │
│  │  • MFA          │  │  • /offers     │  │  • Scoring Engine        │  │
│  │  • SSO (agents) │  │  • /payments   │  │  • LLM Prompt Manager    │  │
│  │  • Session mgmt │  │  • /consent    │  │  • Tool Orchestration    │  │
│  │                 │  │  • /documents  │  │                          │  │
│  └────────────────┘  └───────┬────────┘  └────────────┬─────────────┘  │
│                              │                        │                 │
│  ┌────────────────┐  ┌──────┴───────┐  ┌─────────────┴──────────────┐  │
│  │  Notification   │  │  Integration │  │  Compliance Engine         │  │
│  │  Service        │  │  Service     │  │                            │  │
│  │                 │  │              │  │  • Rule evaluation         │  │
│  │  • Push (FCM/   │  │  • Plaid     │  │  • Offer guardrails       │  │
│  │    APNs)        │  │  • Finicity  │  │  • Audit trail            │  │
│  │  • SMS (Twilio) │  │  • IRS APIs  │  │  • Disparate impact check │  │
│  │  • Email (SES)  │  │  • Credit    │  │  • FFIEC compliance       │  │
│  │                 │  │    Bureaus   │  │                            │  │
│  └────────────────┘  └──────────────┘  └────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                      │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  ┌───────────┐ │
│  │  PostgreSQL   │  │  Redis       │  │ Elasticsearch │  │  S3       │ │
│  │  (RDS)        │  │  (ElastiCache)│  │               │  │           │ │
│  │               │  │              │  │               │  │           │ │
│  │  • Accounts   │  │  • Sessions  │  │  • Convo logs │  │  • Docs   │ │
│  │  • Offers     │  │  • Convo     │  │  • Audit      │  │  • Reports│ │
│  │  • Payments   │  │    context   │  │    trail      │  │  • Assets │ │
│  │  • Consents   │  │  • Rate      │  │  • Search     │  │           │ │
│  │  • Users      │  │    limits    │  │    index      │  │           │ │
│  │  • Audit log  │  │  • Caching   │  │               │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────────┘  └───────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                                  │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Anthropic │  │  Plaid   │  │ Finicity │  │  IRS /   │  │ Credit  │ │
│  │ Claude    │  │          │  │          │  │ TaxStatus│  │ Bureaus │ │
│  │ API       │  │          │  │          │  │          │  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL)

```sql
-- Core Tables

CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     VARCHAR(50) NOT NULL,  -- Bank's customer ID
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID REFERENCES customers(id),
    external_id     VARCHAR(50) NOT NULL,  -- Bank's account ID
    product_type    VARCHAR(20) NOT NULL CHECK (product_type IN ('credit_card', 'personal_loan')),
    current_balance DECIMAL(12,2),
    minimum_payment DECIMAL(12,2),
    apr             DECIMAL(5,2),
    days_past_due   INTEGER DEFAULT 0,
    risk_tier       VARCHAR(10) CHECK (risk_tier IN ('low', 'medium', 'high', 'critical')),
    risk_score      INTEGER,
    status          VARCHAR(20) DEFAULT 'active',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hardship_cases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID REFERENCES accounts(id),
    customer_id     UUID REFERENCES customers(id),
    channel         VARCHAR(20) CHECK (channel IN ('self_serve', 'agent_assisted', 'ivr')),
    agent_id        UUID REFERENCES agents(id),
    status          VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'offer_presented', 'accepted', 'declined', 'expired', 'closed')),
    hardship_reason VARCHAR(50),
    intent_class    VARCHAR(20) CHECK (intent_class IN ('payer', 'partial_payer', 'non_payer')),
    ability_score   INTEGER,
    intent_score    INTEGER,
    risk_score      INTEGER,
    composite_score INTEGER,
    has_plaid_data  BOOLEAN DEFAULT FALSE,
    plaid_item_id   VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    closed_at       TIMESTAMPTZ
);

CREATE TABLE financial_snapshots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID REFERENCES hardship_cases(id),
    source          VARCHAR(20) CHECK (source IN ('plaid', 'finicity', 'irs', 'self_reported')),
    monthly_income  DECIMAL(12,2),
    income_stability VARCHAR(20),  -- 'stable', 'variable', 'none'
    monthly_fixed_expenses DECIMAL(12,2),
    monthly_variable_expenses DECIMAL(12,2),
    disposable_income DECIMAL(12,2),
    dti_ratio       DECIMAL(5,2),
    liquid_assets   DECIMAL(12,2),
    raw_data        JSONB,  -- Full Plaid/Finicity response (encrypted)
    verified_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE offers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID REFERENCES hardship_cases(id),
    offer_type      VARCHAR(30) CHECK (offer_type IN (
        'reage', 'extension', 'short_term_plan', 'long_term_plan',
        'settlement', 'credit_counseling'
    )),
    is_primary      BOOLEAN DEFAULT FALSE,
    settlement_pct  DECIMAL(5,2),       -- For settlements: 35-60%
    settlement_amt  DECIMAL(12,2),
    plan_monthly_amt DECIMAL(12,2),     -- For payment plans
    plan_duration_months INTEGER,
    plan_apr        DECIMAL(5,2),
    status          VARCHAR(20) DEFAULT 'presented' CHECK (status IN (
        'generated', 'presented', 'accepted', 'declined', 'expired', 'countered'
    )),
    presented_at    TIMESTAMPTZ,
    responded_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id        UUID REFERENCES offers(id),
    amount          DECIMAL(12,2),
    due_date        DATE,
    paid_date       DATE,
    status          VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'pending', 'completed', 'failed', 'missed'
    )),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID REFERENCES hardship_cases(id),
    channel         VARCHAR(20),
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    ended_at        TIMESTAMPTZ,
    total_messages  INTEGER DEFAULT 0,
    sentiment_avg   DECIMAL(3,2)  -- -1.0 to 1.0
);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role            VARCHAR(10) CHECK (role IN ('ai', 'customer', 'agent', 'system')),
    content         TEXT,
    metadata        JSONB,  -- intent signals, sentiment, tool calls
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE consents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID REFERENCES customers(id),
    case_id         UUID REFERENCES hardship_cases(id),
    consent_type    VARCHAR(30) CHECK (consent_type IN (
        'plaid_bank_connection', 'irs_income_verification',
        'data_analysis', 'communication_sms', 'communication_email'
    )),
    granted         BOOLEAN,
    granted_at      TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ,
    ip_address      INET,
    device_info     JSONB
);

CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     VARCHAR(50),
    name            VARCHAR(100),
    email           VARCHAR(255),
    role            VARCHAR(20) CHECK (role IN ('agent', 'senior_agent', 'manager', 'admin')),
    team            VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID REFERENCES hardship_cases(id),
    actor_type      VARCHAR(20) CHECK (actor_type IN ('customer', 'agent', 'system', 'ai')),
    actor_id        UUID,
    action          VARCHAR(50),
    details         JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_accounts_dpd ON accounts(days_past_due) WHERE days_past_due > 0;
CREATE INDEX idx_cases_status ON hardship_cases(status);
CREATE INDEX idx_cases_account ON hardship_cases(account_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_audit_case ON audit_log(case_id);
CREATE INDEX idx_offers_case ON offers(case_id);
```

---

## API Endpoints (Core API — NestJS)

### Customer-Facing APIs

```
POST   /api/v1/auth/login              — Customer authentication
POST   /api/v1/auth/refresh            — Token refresh
GET    /api/v1/accounts                — List customer accounts
GET    /api/v1/accounts/:id            — Account details

POST   /api/v1/hardship/start          — Initiate hardship case
GET    /api/v1/hardship/:caseId        — Get case details
POST   /api/v1/hardship/:caseId/message — Send chat message
GET    /api/v1/hardship/:caseId/messages — Get conversation history

POST   /api/v1/plaid/link-token        — Create Plaid Link token
POST   /api/v1/plaid/exchange          — Exchange public token
GET    /api/v1/plaid/snapshot/:caseId  — Get financial snapshot

GET    /api/v1/offers/:caseId          — Get offers for case
POST   /api/v1/offers/:offerId/accept  — Accept an offer
POST   /api/v1/offers/:offerId/decline — Decline an offer

GET    /api/v1/plan/:offerId           — Get payment plan details
GET    /api/v1/plan/:offerId/payments  — Get payment schedule

POST   /api/v1/consent                 — Grant consent
DELETE /api/v1/consent/:id             — Revoke consent
```

### Agent-Facing APIs

```
POST   /api/v1/agent/auth/login        — Agent SSO login
GET    /api/v1/agent/customers/search   — Customer lookup
GET    /api/v1/agent/cases/:caseId      — Full case view
POST   /api/v1/agent/cases/:caseId/note — Add agent note

GET    /api/v1/agent/suggestions/:caseId — AI-suggested responses
POST   /api/v1/agent/offers/:caseId/generate — Generate offer
POST   /api/v1/agent/offers/:offerId/override — Override offer (manager)
POST   /api/v1/agent/cases/:caseId/escalate  — Escalate case

GET    /api/v1/agent/dashboard/metrics  — Team metrics
GET    /api/v1/agent/dashboard/queue    — Approval queue (managers)
```

### AI Service APIs (Internal)

```
POST   /ai/v1/conversation/process     — Process message through LLM
POST   /ai/v1/classify/intent          — Classify payment intent
POST   /ai/v1/score/ability            — Calculate ability score
POST   /ai/v1/score/intent             — Calculate intent score
POST   /ai/v1/score/composite          — Calculate composite score
POST   /ai/v1/offer/determine          — Determine optimal offer
POST   /ai/v1/suggest/response         — Generate agent suggestion
```

---

## Real-Time Communication (WebSocket)

```
// Agent Copilot WebSocket Events

// Server → Client
ws.emit('transcript:update', { role, content, timestamp })
ws.emit('sentiment:update', { score, label })
ws.emit('scores:update', { ability, intent, risk, composite })
ws.emit('suggestion:new', { text, confidence, reasoning })
ws.emit('compliance:update', { checklist })
ws.emit('offer:generated', { offer })

// Client → Server
ws.emit('message:send', { caseId, content })
ws.emit('suggestion:accept', { suggestionId })
ws.emit('suggestion:edit', { suggestionId, editedText })
ws.emit('note:add', { caseId, content })
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                     │
│                                                      │
│  Layer 1: Network                                    │
│  ├── WAF (AWS WAF / Cloudflare)                     │
│  ├── DDoS protection                                │
│  └── VPC with private subnets for data layer        │
│                                                      │
│  Layer 2: Authentication                             │
│  ├── Customer: OAuth 2.0 + PKCE (mobile)            │
│  ├── Agent: SAML 2.0 SSO + MFA                      │
│  ├── Service-to-service: mTLS                        │
│  └── API keys: Rotated monthly, scoped per service   │
│                                                      │
│  Layer 3: Authorization                              │
│  ├── RBAC: Customer, Agent, Senior Agent, Manager    │
│  ├── Resource-level: Customers see only their data   │
│  └── Agent scope: Team-based access                  │
│                                                      │
│  Layer 4: Data Protection                            │
│  ├── At-rest: AES-256 (RDS encryption, S3 SSE)      │
│  ├── In-transit: TLS 1.3                             │
│  ├── PII fields: Application-level encryption        │
│  ├── Plaid tokens: Encrypted with per-tenant keys    │
│  └── Log redaction: PII masked in all logs           │
│                                                      │
│  Layer 5: Monitoring                                 │
│  ├── Intrusion detection (GuardDuty)                 │
│  ├── Anomaly detection on API patterns               │
│  ├── Real-time alerts for auth failures              │
│  └── Quarterly penetration testing                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌────────────────────────────────────────┐
│           OBSERVABILITY STACK           │
│                                         │
│  Metrics:     Datadog                   │
│  ├── API latency (p50, p95, p99)       │
│  ├── LLM response time                  │
│  ├── Plaid API success rate             │
│  ├── Offer acceptance rate              │
│  └── Active conversations               │
│                                         │
│  Logs:        Datadog / CloudWatch      │
│  ├── Structured JSON logging            │
│  ├── Correlation IDs across services    │
│  └── PII redaction pipeline             │
│                                         │
│  Traces:      Datadog APM               │
│  ├── End-to-end request tracing         │
│  ├── LLM call tracing (prompt + resp)   │
│  └── External API dependency tracking   │
│                                         │
│  Errors:      Sentry                    │
│  ├── Real-time error tracking           │
│  ├── Release-based error grouping       │
│  └── Mobile crash reporting             │
│                                         │
│  LLM-specific: LangSmith / Custom      │
│  ├── Prompt version tracking            │
│  ├── Response quality scoring           │
│  ├── Token usage monitoring             │
│  └── Hallucination detection            │
│                                         │
│  Alerts:                                │
│  ├── API error rate > 5%  → PagerDuty  │
│  ├── LLM latency > 10s   → Slack      │
│  ├── Plaid failure > 10%  → Slack      │
│  └── Compliance gap       → Email      │
│                                         │
└────────────────────────────────────────┘
```

---

## Scalability Considerations

| Component | Scaling Strategy | Target |
|---|---|---|
| Core API | Horizontal auto-scaling (ECS/K8s) | 1000 concurrent users |
| AI Service | Horizontal + GPU instances for local models | 500 concurrent convos |
| Database | Read replicas + connection pooling (PgBouncer) | 10K queries/sec |
| Redis | Cluster mode, 3-node minimum | 50K ops/sec |
| WebSocket | Sticky sessions + Redis pub/sub for fan-out | 2000 agent connections |
| Plaid API | Rate limiting + queue-based processing | 100 calls/min |
| Claude API | Request batching + retry with backoff | 200 calls/min |
