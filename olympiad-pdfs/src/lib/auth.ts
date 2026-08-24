import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'olympiad_admin_session';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'olympiad2026';

// Secret for signing cookie tokens
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.RAZORPAY_KEY_SECRET || 'olympiad-secure-admin-secret-2026';

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password === DEFAULT_PASSWORD;
}

export function generateSessionToken(): string {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`admin:${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [timestampStr, signature] = token.split('.');
  if (!timestampStr || !signature) return false;

  const timestamp = parseInt(timestampStr, 10);
  // Session valid for 7 days
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  if (isNaN(timestamp) || Date.now() - timestamp > SEVEN_DAYS_MS) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`admin:${timestamp}`)
    .digest('hex');

  return signature === expectedSignature;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const ADMIN_COOKIE = ADMIN_COOKIE_NAME;
