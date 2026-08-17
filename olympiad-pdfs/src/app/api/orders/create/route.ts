import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';
import { z } from 'zod';

const BUNDLE_PRICE = 29900; // ₹299 in paise
const SUBJECTS = ['mathematics', 'science', 'english', 'computer_science', 'reasoning'] as const;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('individual'),
    productId: z.string().uuid(),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerMobile: z.string().min(10).max(10).regex(/^\d+$/),
  }),
  z.object({
    type: z.literal('bundle'),
    classNumber: z.number().int().min(6).max(10),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerMobile: z.string().min(10).max(10).regex(/^\d+$/),
  }),
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let amount: number;
    let productIds: string[];
    let description: string;

    if (data.type === 'individual') {
      // ── INDIVIDUAL purchase ─────────────────────────────────────
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product || !product.isActive) {
        return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 });
      }

      amount = product.price; // from DB — never trust frontend
      productIds = [product.id];
      description = product.name;
    } else {
      // ── BUNDLE purchase ─────────────────────────────────────────
      const products = await prisma.product.findMany({
        where: {
          class: data.classNumber,
          isActive: true,
          subject: { in: SUBJECTS as unknown as typeof SUBJECTS[number][] },
        },
      });

      const foundSubjects = new Set(products.map((p) => p.subject));
      const missingSubjects = SUBJECTS.filter((s) => !foundSubjects.has(s));

      if (missingSubjects.length > 0) {
        return NextResponse.json(
          {
            error: `Bundle unavailable — the following subjects are missing for Class ${data.classNumber}: ${missingSubjects.join(', ')}`,
          },
          { status: 400 }
        );
      }

      amount = BUNDLE_PRICE;
      productIds = products.map((p) => p.id);
      description = `Class ${data.classNumber} Complete Bundle — All 5 Subjects`;
    }

    // ── Create or find Customer ──────────────────────────────────
    let customer = await prisma.customer.findFirst({
      where: { email: data.customerEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          email: data.customerEmail,
          mobile: data.customerMobile,
        },
      });
    }

    // ── Create Order in DB ───────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        isBundle: data.type === 'bundle',
        classNumber: data.type === 'bundle' ? data.classNumber : null,
        amount,
        paymentStatus: 'PENDING',
        deliveryStatus: 'PENDING',
        items: {
          create: productIds.map((pid) => ({
            productId: pid,
            price: data.type === 'individual' ? amount : Math.round(BUNDLE_PRICE / 5),
          })),
        },
      },
    });

    // ── Create Razorpay Order ────────────────────────────────────
    const rzpOrder = await razorpay.orders.create({
      amount,                    // in paise
      currency: 'INR',
      receipt: order.id.slice(0, 40),
      notes: {
        orderId: order.id,
        description,
      },
    });

    // Save Razorpay order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TQsFu63En5JTU3',
      amount,
      currency: 'INR',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerMobile: data.customerMobile,
      description,
    });
  } catch (err: any) {
    console.error('[orders/create] Error:', err);
    const errorMsg = err?.error?.description || err?.message || 'Failed to initialize payment gateway';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
