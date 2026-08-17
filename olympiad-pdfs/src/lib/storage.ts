import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ─── S3 Client ────────────────────────────────────────────────────

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  // For Cloudflare R2, uncomment and set S3_ENDPOINT:
  // endpoint: process.env.S3_ENDPOINT,
  // forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET!;

// ─── Signed Download URL ─────────────────────────────────────────

/**
 * Generates a presigned URL for a private PDF download.
 * @param key - S3/R2 object key of the PDF
 * @param expiresInSeconds - URL validity (default: 15 minutes)
 */
export async function generateSignedDownloadUrl(
  key: string,
  expiresInSeconds = 900,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: 'attachment',
    ResponseContentType: 'application/pdf',
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

// ─── Signed Upload URL (for admin) ───────────────────────────────

/**
 * Generates a presigned URL for uploading a PDF from the admin panel.
 * @param key - S3/R2 object key to upload to
 * @param expiresInSeconds - URL validity (default: 10 minutes)
 */
export async function generateSignedUploadUrl(
  key: string,
  expiresInSeconds = 600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: 'application/pdf',
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

// ─── Generate a unique PDF key ────────────────────────────────────

/**
 * Generates a unique, unpredictable S3 key for a PDF.
 * Format: pdfs/<uuid>.pdf
 */
export function generatePdfKey(): string {
  const uuid = crypto.randomUUID();
  return `pdfs/${uuid}.pdf`;
}
