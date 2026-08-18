import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';
import { z } from 'zod';

const SINGLE_PRICE = 9900; // ₹99 in paise
const PACK_2_PRICE = 14900; // ₹149 in paise
const BUNDLE_5_PRICE = 29900; // ₹299 in paise

const REQUIRED_SUBJECTS = ['mathematics', 'science', 'english', 'computer_science', 'reasoning'] as const;

const SUBJECT_SHORT_CODES: Record<string, string> = {
  mathematics: 'IMO',
  science: 'ISO',
  english: 'IEO',
  computer_science: 'ICSO',
  reasoning: 'IRO',
};

function getRazorpayInstance() {
  const key_id =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    'rzp_test_TQsFu63En5JTU3';
  const key_secret =
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_ID ||
    'rzp_test_TQsFu63En5JTU3';

  return new Razorpay({ key_id, key_secret });
}

const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('single'),
    productId: z.string().uuid(),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerMobile: z.string().min(10).max(10).regex(/^\d+$/),
  }),
  z.object({
    type: z.literal('pack_2'),
    productIds: z.array(z.string().uuid()).length(2),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerMobile: z.string().min(10).max(10).regex(/^\d+$/),
  }),
  z.object({
    type: z.literal('bundle_5'),
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
    let classNumber: number;
    let purchaseType: string;

    if (data.type === 'single') {
      purchaseType = 'single';
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product || !product.isActive) {
        return NextResponse.json({ error: 'Selected Olympiad paper not found or unavailable' }, { status: 404 });
      }

      amount = product.price || SINGLE_PRICE; // from DB — never trust frontend
      productIds = [product.id];
      classNumber = product.class;
      const shortCode = SUBJECT_SHORT_CODES[product.subject] || product.subject;
      description = `Class ${product.class} ${shortCode} Olympiad Practice Paper`;
    } else if (data.type === 'pack_2') {
      purchaseType = 'pack_2';
      const [id1, id2] = data.productIds;

      if (id1 === id2) {
        return NextResponse.json(
          { error: 'Please choose two different Olympiad subjects for the Pack of 2.' },
          { status: 400 }
        );
      }

      const products = await prisma.product.findMany({
        where: {
          id: { in: [id1, id2] },
          isActive: true,
        },
      });

      if (products.length !== 2) {
        return NextResponse.json({ error: 'One or both selected Olympiad papers are unavailable.' }, { status: 404 });
      }

      const [p1, p2] = products;

      if (p1.class !== p2.class) {
        return NextResponse.json({ error: 'Both selected papers must be for the same class.' }, { status: 400 });
      }

      if (p1.subject === p2.subject) {
        return NextResponse.json({ error: 'Please select two different Olympiad subjects.' }, { status: 400 });
      }

      amount = PACK_2_PRICE; // Server-side fixed price ₹149
      productIds = [p1.id, p2.id];
      classNumber = p1.class;
      const code1 = SUBJECT_SHORT_CODES[p1.subject] || p1.subject;
      const code2 = SUBJECT_SHORT_CODES[p2.subject] || p2.subject;
      description = `Class ${classNumber} Olympiad Pack of 2 (${code1} + ${code2})`;
    } else {
      // ── BUNDLE OF 5 ──────────────────────────────────────────────
      purchaseType = 'bundle_5';
      classNumber = data.classNumber;

      const products = await prisma.product.findMany({
        where: {
          class: classNumber,
          isActive: true,
          subject: { in: REQUIRED_SUBJECTS as unknown as typeof REQUIRED_SUBJECTS[number][] },
        },
      });

      const foundSubjects = new Set(products.map((p) => p.subject));
      const missingSubjects = REQUIRED_SUBJECTS.filter((s) => !foundSubjects.has(s));

      if (missingSubjects.length > 0) {
        const missingNames = missingSubjects.map((s) => SUBJECT_SHORT_CODES[s] || s).join(', ');
        return NextResponse.json(
          {
            error: `Bundle of 5 unavailable — the following Olympiads are coming soon for Class ${classNumber}: ${missingNames}`,
          },
          { status: 400 }
        );
      }

      amount = BUNDLE_5_PRICE; // Server-side fixed price ₹299
      productIds = products.map((p) => p.id);
      description = `Class ${classNumber} Complete Bundle — All 5 Olympiads (IMO, ISO, IEO, ICSO, IRO)`;
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
        purchaseType,
        isBundle: purchaseType === 'bundle_5',
        classNumber,
        amount,
        paymentStatus: 'PENDING',
        deliveryStatus: 'PENDING',
        items: {
          create: productIds.map((pid) => ({
            productId: pid,
            price: Math.round(amount / productIds.length),
          })),
        },
      },
    });

    // ── Create Razorpay Order ────────────────────────────────────
    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create({
      amount, // in paise
      currency: 'INR',
      receipt: order.id.slice(0, 40),
      notes: {
        orderId: order.id,
        purchaseType,
        classNumber: String(classNumber),
        description,
      },
    });

    // Save Razorpay order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });

    const razorpayKeyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      'rzp_test_TQsFu63En5JTU3';

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      razorpayKeyId,
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
