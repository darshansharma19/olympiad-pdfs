import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only .pdf files are supported' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save under public/pdfs/
    const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
    await mkdir(pdfDir, { recursive: true });

    // Clean filename: e.g. class-6-mathematics.pdf or sanitize file name
    const sanitizedFileName = slug
      ? `${slug}.pdf`
      : `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const filePath = path.join(pdfDir, sanitizedFileName);
    await writeFile(filePath, buffer);

    const pdfUrl = `/pdfs/${sanitizedFileName}`;

    return NextResponse.json({
      success: true,
      pdfUrl,
      fileName: sanitizedFileName,
      size: file.size,
    });
  } catch (err: any) {
    console.error('[admin/upload] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload PDF file' }, { status: 500 });
  }
}
