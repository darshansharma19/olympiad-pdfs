import * as path from 'path';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbPath = path.resolve(process.cwd(), 'dev.db');
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function syncLocalPdfs() {
  console.log('🔍 Scanning public/pdfs for Olympiad practice papers...\n');

  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const files = fs.readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${files.length} PDF files in public/pdfs/:`);
  files.forEach((f) => console.log(`  - ${f}`));
  console.log('');

  const products = await prisma.product.findMany();

  let matched = 0;
  for (const product of products) {
    // Try finding matching filename in public/pdfs:
    // e.g. class-6-science.pdf, class-6-mathematics.pdf, class-6-english.pdf, etc.
    const expectedFile = `${product.slug}.pdf`;
    const found = files.find(
      (f) =>
        f.toLowerCase() === expectedFile.toLowerCase() ||
        f.toLowerCase().replace(/[^a-z0-9]/g, '') === product.slug.toLowerCase().replace(/[^a-z0-9]/g, '')
    );

    if (found) {
      const pdfUrl = `/pdfs/${found}`;
      await prisma.product.update({
        where: { id: product.id },
        data: { pdfUrl },
      });
      console.log(`✅ Linked: [Class ${product.class}] ${product.name} => ${pdfUrl}`);
      matched++;
    } else if (product.pdfUrl) {
      console.log(`ℹ️  Existing URL: [Class ${product.class}] ${product.name} => ${product.pdfUrl}`);
    } else {
      console.log(`⚠️  Missing: [Class ${product.class}] ${product.name} (no file matching ${expectedFile})`);
    }
  }

  console.log(`\n✨ Summary: Matched and updated ${matched} products.`);
}

syncLocalPdfs()
  .catch((e) => {
    console.error('❌ Sync failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
