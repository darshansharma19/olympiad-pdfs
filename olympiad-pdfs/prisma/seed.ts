import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Resolve absolute path to dev.db and format as file: URL
const dbPath = path.resolve(process.cwd(), 'dev.db');
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const CLASSES = [6, 7, 8, 9, 10] as const;

export const OLYMPIAD_SUBJECTS = [
  { slug: 'mathematics' as const, code: 'IMO', fullName: 'International Mathematics Olympiad (IMO)' },
  { slug: 'science' as const, code: 'ISO', fullName: 'International Science Olympiad (ISO)' },
  { slug: 'english' as const, code: 'IEO', fullName: 'International English Olympiad (IEO)' },
  { slug: 'computer_science' as const, code: 'ICSO', fullName: 'International Computer Science Olympiad (ICSO)' },
  { slug: 'reasoning' as const, code: 'IRO', fullName: 'International Reasoning Olympiad (IRO)' },
] as const;

const INDIVIDUAL_PRICE = 9900; // ₹99 in paise

async function main() {
  console.log('🌱 Syncing OlympiadPDFs database with Olympiad products...\n');
  console.log(`   DB: ${dbUrl}\n`);

  let updated = 0;

  for (const cls of CLASSES) {
    for (const subj of OLYMPIAD_SUBJECTS) {
      const slug = `class-${cls}-${subj.slug.replace('_', '-')}`;
      const name = `Class ${cls} ${subj.fullName} Practice Papers`;

      const existing = await prisma.product.findUnique({ where: { slug } });

      await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          class: cls,
          subject: subj.slug,
          price: INDIVIDUAL_PRICE,
          imageUrl: `/images/classes/class-${cls}.svg`,
          isActive: true,
          // Preserve existing pdfUrl if set, otherwise default to sample PDF for local testing
          pdfUrl: existing?.pdfUrl ? existing.pdfUrl : '/pdfs/sample-practice-paper.pdf',
        },
        create: {
          name,
          slug,
          class: cls,
          subject: subj.slug,
          price: INDIVIDUAL_PRICE,
          pdfUrl: '/pdfs/sample-practice-paper.pdf',
          imageUrl: `/images/classes/class-${cls}.svg`,
          isActive: true,
        },
      });

      console.log(`  ✅ ${name} — ₹${INDIVIDUAL_PRICE / 100}`);
      updated++;
    }
  }

  console.log(`\n✨ Done! Synchronized ${updated} products in database.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
