/**
 * Database query helpers — typed wrappers around Prisma.
 * All data-access should go through these functions, not raw prisma calls scattered in routes.
 */
import { prisma } from './index';

// ─── Products ─────────────────────────────────────────────────────

export async function getActiveProductsByClass(classNum: number) {
  return prisma.product.findMany({
    where: { class: classNum, isActive: true },
    orderBy: { subject: 'asc' },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function getAllActiveProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ class: 'asc' }, { subject: 'asc' }],
  });
}

// ─── Customers ────────────────────────────────────────────────────

export async function findOrCreateCustomer(data: {
  name: string;
  email: string;
  mobile: string;
}) {
  const existing = await prisma.customer.findFirst({ where: { email: data.email } });
  if (existing) return existing;
  return prisma.customer.create({ data });
}

// ─── Orders ───────────────────────────────────────────────────────

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { product: true } },
      downloads: true,
    },
  });
}

export async function getOrderByRazorpayId(razorpayOrderId: string) {
  return prisma.order.findUnique({
    where: { razorpayOrderId },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });
}

// ─── Downloads ────────────────────────────────────────────────────

export async function getDownloadByToken(token: string) {
  return prisma.download.findUnique({
    where: { token },
    include: { product: true, order: true },
  });
}
