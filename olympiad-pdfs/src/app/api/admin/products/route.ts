import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CLASSES = [6, 7, 8, 9, 10];
const SUBJECTS = [
  { slug: 'mathematics', name: 'International Mathematics Olympiad (IMO)' },
  { slug: 'science', name: 'International Science Olympiad (ISO)' },
  { slug: 'english', name: 'International English Olympiad (IEO)' },
  { slug: 'computer_science', name: 'International Computer Science Olympiad (ICSO)' },
  { slug: 'reasoning', name: 'International Reasoning Olympiad (IRO)' },
];

async function ensureDefaultProducts() {
  try {
    const count = await prisma.product.count();
    if (count < 25) {
      for (const cls of CLASSES) {
        for (const subj of SUBJECTS) {
          const slug = `class-${cls}-${subj.slug.replace('_', '-')}`;
          const existing = await prisma.product.findUnique({ where: { slug } });
          if (!existing) {
            await prisma.product.create({
              data: {
                name: `Class ${cls} ${subj.name} Practice Papers`,
                slug,
                class: cls,
                subject: subj.slug,
                price: 9900,
                pdfUrl: '',
                imageUrl: `/images/classes/class-${cls}.svg`,
                isActive: true,
              },
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('[admin/products] Auto-seed warning:', e);
  }
}

// GET all products for PDF management
export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure all 25 classes & subjects are initialized
    await ensureDefaultProducts();

    const products = await prisma.product.findMany({
      orderBy: [{ class: 'asc' }, { subject: 'asc' }],
    });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error('[admin/products] GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// UPDATE product pdfUrl, price, isActive, etc.
export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, pdfUrl, price, isActive, name } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(pdfUrl !== undefined ? { pdfUrl: String(pdfUrl).trim() } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        ...(name !== undefined ? { name: String(name).trim() } : {}),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error('[admin/products] POST Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE / CLEAR PDF for a product
export async function DELETE(req: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        pdfUrl: '',
      },
    });

    return NextResponse.json({ success: true, message: 'PDF cleared successfully', product: updated });
  } catch (err: any) {
    console.error('[admin/products] DELETE Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to clear PDF' }, { status: 500 });
  }
}
