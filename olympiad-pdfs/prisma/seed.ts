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
  console.log('🌱 Seeding OlympiadPDFs database with Olympiad subject naming...\n');
  console.log(`   DB: ${dbUrl}\n`);

  let updated = 0;

  for (const cls of CLASSES) {
    for (const subj of OLYMPIAD_SUBJECTS) {
      const slug = `class-${cls}-${subj.slug.replace('_', '-')}`;
      const name = `Class ${cls} ${subj.fullName} Practice Papers`;

      await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          class: cls,
          subject: subj.slug,
          price: INDIVIDUAL_PRICE,
          imageUrl: `/images/classes/class-${cls}.svg`,
          isActive: true,
        },
        create: {
          name,
          slug,
          class: cls,
          subject: subj.slug,
          price: INDIVIDUAL_PRICE,
          pdfUrl: '',
          imageUrl: `/images/classes/class-${cls}.svg`,
          isActive: true,
        },
      });

      console.log(`  ✅ ${name} — ₹${INDIVIDUAL_PRICE / 100}`);
      updated++;
    }
  }

  console.log(`\n✨ Done! Synchronized ${updated} products with Olympiad naming.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
