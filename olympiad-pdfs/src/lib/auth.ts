import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'olympiad_admin_session';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'olympiad2026';
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.RAZORPAY_KEY_SECRET || 'olympiad-secure-admin-secret-2026';

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password === DEFAULT_PASSWORD;
}

// Simple fast SHA256-like hex signature using Web Crypto API or universal hash
async function generateHmac(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateSessionToken(): Promise<string> {
  const timestamp = Date.now();
  const signature = await generateHmac(`admin:${timestamp}`, AUTH_SECRET);
  return `${timestamp}.${signature}`;
}

export async function verifySessionTokenAsync(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [timestampStr, signature] = token.split('.');
  if (!timestampStr || !signature) return false;

  const timestamp = parseInt(timestampStr, 10);
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  if (isNaN(timestamp) || Date.now() - timestamp > SEVEN_DAYS_MS) {
    return false;
  }

  const expectedSignature = await generateHmac(`admin:${timestamp}`, AUTH_SECRET);
  return signature === expectedSignature;
}

// Sync fallback for quick check if needed
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [timestampStr, signature] = token.split('.');
  if (!timestampStr || !signature) return false;

  const timestamp = parseInt(timestampStr, 10);
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  if (isNaN(timestamp) || Date.now() - timestamp > SEVEN_DAYS_MS) {
    return false;
  }

  // Token has valid timestamp format and non-empty signature
  return signature.length === 64;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionTokenAsync(token);
}

export const ADMIN_COOKIE = ADMIN_COOKIE_NAME;
