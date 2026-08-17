import type {
  SubjectSlug,
  ClassNumber,
  SubjectInfo,
  ClassInfo,
  ProductDisplay,
  Product,
} from '@/types';

// ─── Price Formatting ─────────────────────────────────────────────

/** Convert paise to formatted ₹ string (e.g. 9900 → "₹99") */
export function formatPrice(paise: number): string {
  return `₹${Math.round(paise / 100)}`;
}

/** Calculate discount percentage */
export function discountPercent(price: number, refPrice: number): number {
  if (refPrice <= 0 || price >= refPrice) return 0;
  return Math.round(((refPrice - price) / refPrice) * 100);
}

/** Enrich a Product with display-ready formatted values */
export function toProductDisplay(product: Product): ProductDisplay {
  return {
    ...product,
    priceFormatted: formatPrice(product.price),
    refPriceFormatted: formatPrice(product.refPrice),
    discountPercent: discountPercent(product.price, product.refPrice),
  };
}

// ─── Subject Metadata ─────────────────────────────────────────────

export const SUBJECTS: SubjectInfo[] = [
  {
    slug: 'mathematics',
    label: 'Mathematics',
    tagline: 'Think. Solve. Excel.',
    icon: '📐',
  },
  {
    slug: 'science',
    label: 'Science',
    tagline: 'Understand. Apply. Practice.',
    icon: '🔬',
  },
  {
    slug: 'english',
    label: 'English',
    tagline: 'Read. Reason. Master.',
    icon: '📖',
  },
  {
    slug: 'computer_science',
    label: 'Computer Science',
    tagline: 'Think Computationally.',
    icon: '💻',
  },
  {
    slug: 'gk',
    label: 'General Knowledge',
    tagline: 'Know More. Learn More.',
    icon: '🌍',
  },
  {
    slug: 'reasoning',
    label: 'Reasoning',
    tagline: 'Challenge Your Thinking.',
    icon: '🧩',
  },
];

export const CLASSES: ClassInfo[] = [
  { number: 6, label: 'Class 6' },
  { number: 7, label: 'Class 7' },
  { number: 8, label: 'Class 8' },
  { number: 9, label: 'Class 9' },
  { number: 10, label: 'Class 10' },
];

export function getSubjectInfo(slug: SubjectSlug): SubjectInfo | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function getSubjectLabel(slug: SubjectSlug): string {
  return getSubjectInfo(slug)?.label ?? slug;
}

export function getClassLabel(classNum: ClassNumber | null): string {
  if (!classNum) return 'All Classes';
  return `Class ${classNum}`;
}

// ─── Slug Generation ──────────────────────────────────────────────

export function buildProductSlug(
  classNum: ClassNumber | null,
  subject: SubjectSlug,
  type: string,
): string {
  const parts: string[] = [];
  if (classNum) parts.push(`class-${classNum}`);
  parts.push(subject.replace('_', '-'));
  if (type !== 'SUBJECT_PACK') {
    parts.push(type.toLowerCase().replace('_', '-'));
  }
  parts.push('olympiad-practice-papers');
  return parts.join('-');
}

// ─── SEO Helpers ─────────────────────────────────────────────────

export function buildProductSEOTitle(product: Pick<Product, 'class' | 'subject' | 'name'>): string {
  const classLabel = product.class ? `Class ${product.class} ` : '';
  const subjectLabel = getSubjectLabel(product.subject as SubjectSlug);
  return `${classLabel}${subjectLabel} Olympiad Practice Papers | OlympiadPDFs`;
}

export function buildProductSEODescription(
  product: Pick<Product, 'class' | 'subject' | 'paperCount' | 'questionCount'>,
): string {
  const classLabel = product.class ? `Class ${product.class} ` : '';
  const subjectLabel = getSubjectLabel(product.subject as SubjectSlug);
  return `Download expert-designed ${classLabel}${subjectLabel} Olympiad practice papers. ${product.paperCount} papers, ${product.questionCount} questions, and answer keys included. Instant digital delivery.`;
}

// ─── Coupon Calculation ───────────────────────────────────────────

/**
 * Calculate the final price after applying a coupon.
 * Returns final price in paise.
 */
export function applyDiscount(
  price: number,
  couponType: 'PERCENTAGE' | 'FIXED',
  discount: number,
): { finalPrice: number; discountAmount: number } {
  let discountAmount: number;

  if (couponType === 'PERCENTAGE') {
    discountAmount = Math.round((price * discount) / 100);
  } else {
    discountAmount = discount; // already in paise
  }

  const finalPrice = Math.max(0, price - discountAmount);
  return { finalPrice, discountAmount };
}

// ─── Download Token Expiry ────────────────────────────────────────

/** Returns a Date 72 hours from now */
export function getDownloadTokenExpiry(): Date {
  const d = new Date();
  d.setHours(d.getHours() + 72);
  return d;
}
