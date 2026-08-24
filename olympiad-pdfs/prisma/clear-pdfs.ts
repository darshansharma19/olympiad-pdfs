import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbPath = path.resolve(process.cwd(), 'dev.db');
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function clearDummyPdfs() {
  console.log('🧹 Clearing all dummy PDF URLs from database...');
  const result = await prisma.product.updateMany({
    data: {
      pdfUrl: '',
    },
  });
  console.log(`✅ Cleared PDF URLs on ${result.count} products.`);
}

clearDummyPdfs()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
