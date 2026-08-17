import Razorpay from 'razorpay';
import crypto from 'crypto';

// ─── Razorpay Client ──────────────────────────────────────────────

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ─── Order Creation ───────────────────────────────────────────────

export async function createRazorpayOrder(amount: number, orderId: string) {
  return razorpay.orders.create({
    amount,          // in paise
    currency: 'INR',
    receipt: orderId,
    notes: {
      source: 'olympiadpdfs',
    },
  });
}

// ─── Payment Verification ─────────────────────────────────────────

/**
 * Verifies the Razorpay payment signature after checkout.
 * Must be called server-side only.
 */
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );
  } catch {
    return false;
  }
}

// ─── Webhook Verification ─────────────────────────────────────────

/**
 * Verifies the Razorpay webhook signature.
 * rawBody must be the raw request body string (not parsed JSON).
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );
  } catch {
    return false;
  }
}
