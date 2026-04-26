/**
 * Typed API client for the Easefinancials hardship assessment backend.
 * Set EXPO_PUBLIC_API_URL in your .env to point at a different host.
 */

const BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000') + '/api/v1';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface TreatmentTerms {
  monthly_payment_inr?: number;
  duration_months?: number;
  settlement_amount_inr?: number;
  interest_rate_annual?: number;
  deferral_cycles?: number;
  principal_outstanding_inr?: number;
}

export interface TreatmentRecommendation {
  treatment_type: 'settlement' | 'short_term_plan' | 'long_term_plan' | 'deferral';
  headline: string;
  rationale: string;
  terms: TreatmentTerms;
  rbi_guideline?: { circular_number: string; title: string };
}

export interface ApiSession {
  session_id: string;
  phase: string;
  messages: ApiMessage[];
  bureau_consent_granted: boolean;
  treatment: TreatmentRecommendation | null;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  session_id: string;
  message: ApiMessage;
  phase: string;
  phase_changed: boolean;
  assessment_updated: boolean;
}

export interface ConsentPayload {
  bureau_consent: boolean;
  income_verification_consent?: boolean;
  customer_pan?: string;
  customer_mobile?: string;
  customer_name?: string;
  customer_dob?: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new Error(`[HarborAPI] ${path} → ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------------

export const harborApi = {
  /** Issue a short-lived token (dev/demo — returns guest token without auth). */
  getToken(customerId: string, channel = 'mobile'): Promise<AuthTokenResponse> {
    return apiFetch('/auth/token', {
      method: 'POST',
      body: JSON.stringify({ customer_id: customerId, channel }),
    });
  },

  /** Start a new hardship assessment session. */
  createSession(token?: string): Promise<ApiSession> {
    return apiFetch('/sessions', {
      method: 'POST',
      body: JSON.stringify({}),
      token,
    });
  },

  /** Send a chat message and receive the AI counselor's reply. */
  sendMessage(sessionId: string, content: string, token?: string): Promise<MessageResponse> {
    return apiFetch(`/sessions/${sessionId}/message`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      token,
    });
  },

  /** Record credit bureau and/or income verification consent. */
  grantConsent(sessionId: string, payload: ConsentPayload, token?: string): Promise<unknown> {
    return apiFetch(`/sessions/${sessionId}/consent`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  /** Get the full session state. */
  getSession(sessionId: string, token?: string): Promise<ApiSession> {
    return apiFetch(`/sessions/${sessionId}`, { token });
  },

  /** Get the treatment recommendation once assessment is complete. */
  getTreatment(sessionId: string, token?: string): Promise<TreatmentRecommendation> {
    return apiFetch(`/sessions/${sessionId}/treatment`, { token });
  },
};
