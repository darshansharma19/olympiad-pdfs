import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  // ── Fetch download record ───────────────────────────────────
  const download = await prisma.download.findUnique({
    where: { token },
    include: { product: true, order: true },
  });

  if (!download) {
    return new NextResponse('Download link not found.', { status: 404 });
  }

  // ── Check expiry ────────────────────────────────────────────
  if (download.expiresAt < new Date()) {
    return new NextResponse(
      'This download link has expired. Please contact support@olympiadpdfs.com',
      { status: 410 }
    );
  }

  // ── Check download limit ────────────────────────────────────
  if (download.downloadCount >= download.maxDownloads) {
    return new NextResponse(
      'Download limit reached. Please contact support@olympiadpdfs.com',
      { status: 403 }
    );
  }

  // ── Verify order is PAID ────────────────────────────────────
  if (download.order.paymentStatus !== 'PAID') {
    return new NextResponse('Payment not verified.', { status: 403 });
  }

  // ── Check PDF URL is configured ─────────────────────────────
  if (!download.product.pdfUrl) {
    return new NextResponse(
      'PDF is being prepared. Please check your email or contact support@olympiadpdfs.com',
      { status: 503 }
    );
  }

  // ── Increment download count ────────────────────────────────
  await prisma.download.update({
    where: { token },
    data: { downloadCount: { increment: 1 } },
  });

  // ── Redirect to the PDF URL ─────────────────────────────────
  const targetUrl = download.product.pdfUrl.startsWith('http')
    ? download.product.pdfUrl
    : new URL(download.product.pdfUrl, _req.nextUrl.origin).toString();

  return NextResponse.redirect(targetUrl, { status: 302 });
}
