import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { sendOrderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_ID ||
      'rzp_test_TQsFu63En5JTU3';

    // ── 1. Verify Razorpay HMAC signature ──────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error('[orders/verify] Signature mismatch');
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // ── 2. Fetch Order + Items ──────────────────────────────────
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: 'Order ID mismatch' }, { status: 400 });
    }

    if (order.paymentStatus === 'PAID') {
      // Idempotent — already processed
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // ── 3. Mark order as PAID ───────────────────────────────────
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // ── 4. Create Download tokens (72h expiry, max 5 downloads) ─
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const downloads = await Promise.all(
      order.items.map((item) =>
        prisma.download.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            expiresAt,
            maxDownloads: 5,
          },
        })
      )
    );

    // ── 5. Detect base domain for email links ────────────────────
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const autoBaseUrl = `${proto}://${host}`;

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
      autoBaseUrl;

    const downloadLinks = downloads.map((d, i) => ({
      productName: order.items[i].product.name,
      url: `${baseUrl}/api/download/${d.token}`,
    }));

    // ── 6. Send confirmation email directly to user's mailbox ───
    try {
      await sendOrderEmail({
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        orderId: order.id,
        purchaseType: order.purchaseType,
        isBundle: order.isBundle,
        classNumber: order.classNumber ?? undefined,
        amount: order.amount,
        downloads: downloadLinks,
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { deliveryStatus: 'SENT' },
      });
      console.log(`[orders/verify] Confirmation email sent successfully to ${order.customer.email}`);
    } catch (emailErr) {
      console.error('[orders/verify] Email failed:', emailErr);
      await prisma.order.update({
        where: { id: orderId },
        data: { deliveryStatus: 'FAILED' },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      downloads: downloadLinks,
      customerEmail: order.customer.email,
    });
  } catch (err) {
    console.error('[orders/verify]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
