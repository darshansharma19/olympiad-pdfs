import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all products for PDF management
export async function GET() {
  try {
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
