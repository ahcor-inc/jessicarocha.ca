export interface Env {
  BREVO_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_FROM_NAME: string;
  ALLOWED_ORIGINS: string;
  TURNSTILE_SECRET?: string;
  RATE_LIMIT?: KVNamespace;
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW_SEC?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
  turnstile?: string;
}

interface SanitizedContact {
  name: string;
  email: string;
  subjectLabel: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;
const MAX_NAME = 200;
const MAX_MESSAGE = 10000;
const MAX_BODY_BYTES = 32768;
const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_SEC = 900;
const BAD_REQUEST_MSG = 'Invalid submission';
const GENERIC_FORBIDDEN_MSG = 'Forbidden';

const SUBJECT_LABELS: Record<string, string> = {
  'reader-mail': 'Reader Mail',
  'book-club': 'Book Club',
  media: 'Media / Interview',
  other: 'Other',
};

const ALLOWED_SUBJECT_KEYS = new Set([
  '',
  'reader-mail',
  'book-club',
  'media',
  'other',
]);

function parseAllowedOrigins(value: string): string[] {
  return value
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
  if (!origin) return false;
  return allowed.some((a) => a === origin);
}

function corsHeaders(
  origin: string | null,
  allowed: string[],
  extra: Record<string, string> = {},
): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    ...extra,
  };
  if (origin && isAllowedOrigin(origin, allowed)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return headers;
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
  allowed: string[],
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowed, extraHeaders),
    },
  });
}

function stripCrLf(value: string): string {
  return value.replace(/[\r\n]/g, '');
}

function getClientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') ?? 'unknown';
}

function subjectKeyToLabel(key: string): string {
  if (!key) return 'Contact';
  return SUBJECT_LABELS[key] ?? '';
}

function validatePayload(data: ContactPayload): { ok: true; value: SanitizedContact } | { ok: false; reason: string } {
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return { ok: false, reason: 'honeypot' };
  }

  const name = stripCrLf(String(data.name ?? '').trim());
  const email = stripCrLf(String(data.email ?? '').trim().toLowerCase());
  const subjectKey = stripCrLf(String(data.subject ?? '').trim());
  const message = String(data.message ?? '').trim();

  if (!name || name.length > MAX_NAME) return { ok: false, reason: 'name' };
  if (CONTROL_CHARS_RE.test(name)) return { ok: false, reason: 'name-control' };

  if (!email || email.length > 254) return { ok: false, reason: 'email' };
  if (!EMAIL_RE.test(email)) return { ok: false, reason: 'email-format' };
  if ((email.match(/@/g) ?? []).length !== 1) return { ok: false, reason: 'email-at' };

  if (!ALLOWED_SUBJECT_KEYS.has(subjectKey)) return { ok: false, reason: 'subject' };
  const subjectLabel = subjectKeyToLabel(subjectKey);
  if (subjectKey && !subjectLabel) return { ok: false, reason: 'subject-map' };

  if (!message || message.length > MAX_MESSAGE) return { ok: false, reason: 'message' };
  if (CONTROL_CHARS_RE.test(message)) return { ok: false, reason: 'message-control' };

  return {
    ok: true,
    value: { name, email, subjectLabel: subjectLabel || 'Contact', message },
  };
}

async function readJsonBody(request: Request): Promise<ContactPayload | null> {
  const contentLength = request.headers.get('Content-Length');
  if (contentLength) {
    const length = Number.parseInt(contentLength, 10);
    if (!Number.isFinite(length) || length > MAX_BODY_BYTES) return null;
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;

  try {
    return JSON.parse(text) as ContactPayload;
  } catch {
    return null;
  }
}

async function checkRateLimit(env: Env, ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!env.RATE_LIMIT) return { allowed: true };

  const maxRequests = Number.parseInt(env.RATE_LIMIT_MAX ?? '', 10) || DEFAULT_RATE_LIMIT_MAX;
  const windowSec =
    Number.parseInt(env.RATE_LIMIT_WINDOW_SEC ?? '', 10) || DEFAULT_RATE_LIMIT_WINDOW_SEC;
  const windowMs = windowSec * 1000;
  const key = `ip:${ip}`;
  const now = Date.now();

  const raw = await env.RATE_LIMIT.get(key);
  let entry: { count: number; start: number } = raw
    ? (JSON.parse(raw) as { count: number; start: number })
    : { count: 0, start: now };

  if (now - entry.start > windowMs) {
    entry = { count: 0, start: now };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((entry.start + windowMs - now) / 1000));
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  await env.RATE_LIMIT.put(key, JSON.stringify(entry), {
    expirationTtl: windowSec,
  });

  return { allowed: true };
}

async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string,
): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip !== 'unknown') body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendViaBrevo(env: Env, data: SanitizedContact): Promise<Response> {
  const { name, email, subjectLabel, message } = data;

  const mailSubject = `[jessicarocha.ca] ${subjectLabel}`;
  const textContent = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subjectLabel}`,
    '',
    message,
  ].join('\n');

  const htmlContent = [
    '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>',
    '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>',
    '<p><strong>Subject:</strong> ' + escapeHtml(subjectLabel) + '</p>',
    '<hr>',
    '<p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>',
  ].join('\n');

  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: env.CONTACT_FROM_NAME,
        email: env.CONTACT_FROM_EMAIL,
      },
      to: [{ email: env.CONTACT_TO_EMAIL, name: 'Jessica Rocha' }],
      replyTo: { email, name },
      subject: mailSubject,
      textContent,
      htmlContent,
    }),
  });

  if (!brevoRes.ok) {
    const errText = await brevoRes.text();
    console.error('Brevo error', brevoRes.status, errText);
    return new Response(null, { status: 502 });
  }

  return new Response(null, { status: 204 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, allowed),
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin, allowed);
    }

    if (!isAllowedOrigin(origin, allowed)) {
      return jsonResponse({ error: GENERIC_FORBIDDEN_MSG }, 403, origin, allowed);
    }

    if (!env.BREVO_API_KEY) {
      return jsonResponse({ error: 'Service unavailable' }, 503, origin, allowed);
    }

    const ip = getClientIp(request);
    const rate = await checkRateLimit(env, ip);
    if (!rate.allowed) {
      return jsonResponse(
        { error: 'Too many requests. Please try again later.' },
        429,
        origin,
        allowed,
        { 'Retry-After': String(rate.retryAfter ?? 60) },
      );
    }

    const data = await readJsonBody(request);
    if (!data) {
      console.error('Invalid JSON body');
      return jsonResponse({ error: BAD_REQUEST_MSG }, 400, origin, allowed);
    }

    const validated = validatePayload(data);
    if (!validated.ok) {
      console.error('Validation failed:', validated.reason);
      return jsonResponse({ error: BAD_REQUEST_MSG }, 400, origin, allowed);
    }

    if (env.TURNSTILE_SECRET) {
      const token = String(data.turnstile ?? '').trim();
      if (!token) {
        console.error('Missing Turnstile token');
        return jsonResponse({ error: GENERIC_FORBIDDEN_MSG }, 403, origin, allowed);
      }
      const turnstileOk = await verifyTurnstile(env.TURNSTILE_SECRET, token, ip);
      if (!turnstileOk) {
        console.error('Turnstile verification failed');
        return jsonResponse({ error: GENERIC_FORBIDDEN_MSG }, 403, origin, allowed);
      }
    }

    try {
      const result = await sendViaBrevo(env, validated.value);
      if (result.status === 204) {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin, allowed),
        });
      }
      return jsonResponse({ error: 'Failed to send message' }, 502, origin, allowed);
    } catch (err) {
      console.error('Send failed', err);
      return jsonResponse({ error: 'Failed to send message' }, 502, origin, allowed);
    }
  },
};
