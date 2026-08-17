import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Resolve absolute path to dev.db and format as file: URL
const dbPath = path.resolve(process.cwd(), 'dev.db');
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const CLASSES = [6, 7, 8, 9, 10] as const;

const SUBJECTS = [
  { slug: 'mathematics' as const, label: 'Mathematics' },
  { slug: 'science' as const, label: 'Science' },
  { slug: 'english' as const, label: 'English' },
  { slug: 'computer_science' as const, label: 'Computer Science' },
  { slug: 'reasoning' as const, label: 'Reasoning' },
];

const INDIVIDUAL_PRICE = 9900; // ₹99 in paise

// Custom PDF links (Google Drive, S3, Cloudflare R2, etc.)
const CUSTOM_PDF_URLS: Record<string, string> = {
  'class-6-mathematics': 'https://drive.google.com/file/d/1KJROmi1rv6dtZlqH5id_V2FJK5jsvvlp/view?usp=sharing',
};

async function main() {
  console.log('🌱 Seeding OlympiadPDFs database...\n');
  console.log(`   DB: ${dbUrl}\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const cls of CLASSES) {
    for (const subj of SUBJECTS) {
      const slug = `class-${cls}-${subj.slug.replace('_', '-')}`;
      const name = `Class ${cls} ${subj.label} Olympiad Practice Papers`;
      const targetPdfUrl = CUSTOM_PDF_URLS[slug] || '/pdfs/sample-practice-paper.pdf';

      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        if (existing.pdfUrl !== targetPdfUrl) {
          await prisma.product.update({
            where: { id: existing.id },
            data: { pdfUrl: targetPdfUrl },
          });
          console.log(`  🔄 Updated PDF URL for ${slug}: ${targetPdfUrl}`);
          updated++;
        } else {
          console.log(`  ⏭  Skipping (up to date): ${slug}`);
          skipped++;
        }
        continue;
      }

      await prisma.product.create({
        data: {
          name,
          slug,
          class: cls,
          subject: subj.slug,
          price: INDIVIDUAL_PRICE,
          pdfUrl: targetPdfUrl,
          imageUrl: `/images/classes/class-${cls}.svg`,
          isActive: true,
        },
      });

      console.log(`  ✅ Created ${name} — ₹${INDIVIDUAL_PRICE / 100}`);
      created++;
    }
  }

  console.log(`\n✨ Done! Created: ${created}, Updated: ${updated}, Skipped: ${skipped}.`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
