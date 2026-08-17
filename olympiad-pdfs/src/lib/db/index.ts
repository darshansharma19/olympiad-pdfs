/**
 * Prisma client singleton — Prisma 7 with driver adapter.
 *
 * LOCAL DEV  : DATABASE_URL="file:./dev.db"       → better-sqlite3
 * PRODUCTION : DATABASE_URL="postgresql://..."     → @neondatabase/serverless via @prisma/adapter-neon
 */
import { PrismaClient } from '@prisma/client';
import path from 'path';

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL ?? 'file:./dev.db';

  // ── Local SQLite ──────────────────────────────────────────────
  if (rawUrl.startsWith('file:')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
    const filePart = rawUrl.slice(5).replace(/^\.\//, '');
    const dbPath = path.isAbsolute(filePart)
      ? filePart
      : path.resolve(process.cwd(), filePart);
    const url = `file:${dbPath.replace(/\\/g, '/')}`;
    const adapter = new PrismaBetterSqlite3({ url });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  // ── Neon / PostgreSQL (production on Vercel) ──────────────────
  if (rawUrl.startsWith('postgresql://') || rawUrl.startsWith('postgres://')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require('@neondatabase/serverless');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require('@prisma/adapter-neon');
    const sql = neon(rawUrl);
    const adapter = new PrismaNeon(sql);
    return new PrismaClient({
      adapter,
      log: ['error'],
    });
  }

  throw new Error(`Unsupported DATABASE_URL scheme. Use "file:..." for SQLite or "postgresql://..." for Neon/Postgres.`);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
