'use server';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;

interface WebhookPayload {
  event: 'rate_view' | 'lender_click' | 'calculator_use' | 'state_select' | 'loan_type_select';
  lender_slug?: string;
  loan_type?: string;
  state?: string;
  locale?: string;
  page?: string;
}

export async function sendWebhook(payload: WebhookPayload): Promise<void> {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
    });
  } catch {
    // silently fail — webhook is non-critical
  }
}
