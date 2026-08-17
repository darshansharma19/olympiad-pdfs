# OlympiadPDFs — Code Standards & Library Documentation

> This document defines the coding standards, conventions, and library usage patterns for the OlympiadPDFs project. All contributors must follow these standards.

---

## 1. Project Technology Stack

| Layer              | Library/Tool          | Version   | Purpose                            |
|--------------------|-----------------------|-----------|------------------------------------|
| Framework          | Next.js               | 14+       | Full-stack React framework         |
| Language           | TypeScript            | 5+        | Type safety                        |
| Styling            | Tailwind CSS          | 3+        | Utility-first CSS                  |
| ORM                | Prisma                | 5+        | Type-safe DB queries               |
| Database           | PostgreSQL            | 15+       | Relational database                |
| Auth               | NextAuth.js           | 4+        | Admin session management           |
| Payment            | Razorpay              | Latest    | Payment gateway                    |
| Email              | Resend                | Latest    | Transactional email                |
| Storage            | AWS S3 / R2           | Latest    | Private PDF storage                |
| Validation         | Zod                   | 3+        | Schema validation                  |
| Linting            | ESLint                | Latest    | Code quality                       |
| Formatting         | Prettier              | Latest    | Code formatting                    |

---

## 2. TypeScript Standards

### Strict Mode (Required)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Type Definitions

All shared types live in `/types/index.ts`.

```typescript
// types/index.ts

export type ProductType = 'individual' | 'subject_pack' | 'class_bundle' | 'complete_bundle';
export type SubjectSlug = 'mathematics' | 'science' | 'english' | 'computer-science' | 'gk' | 'reasoning';
export type ClassNumber = 6 | 7 | 8 | 9 | 10;
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type DeliveryStatus = 'pending' | 'sent' | 'failed';

export interface Product {
  id: string;
  name: string;
  slug: string;
  class: ClassNumber | null; // null = common across classes
  subject: SubjectSlug;
  description: string;
  paperCount: number;
  questionCount: number;
  price: number;          // in paise (₹99 = 9900)
  refPrice: number;
  pdfKey: string;         // S3/R2 object key
  coverImage: string;
  productType: ProductType;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  amount: number;
  discount: number;
  couponId: string | null;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: Date;
}
```

### Rules
- **No `any`** — use `unknown` and narrow with Zod if needed.
- All API route handlers must have typed `Request` and typed return values.
- Prefer `interface` over `type` for object shapes.
- Use `const` assertions for literal arrays: `['maths', 'science'] as const`.

---

## 3. File & Folder Naming Conventions

| Type                 | Convention      | Example                        |
|----------------------|-----------------|--------------------------------|
| Page files           | `page.tsx`      | `app/class/[id]/page.tsx`      |
| Layout files         | `layout.tsx`    | `app/(admin)/layout.tsx`       |
| API routes           | `route.ts`      | `app/api/orders/create/route.ts`|
| Components           | PascalCase      | `ProductCard.tsx`              |
| Hooks                | camelCase `use` | `useRazorpay.ts`               |
| Utilities            | camelCase       | `razorpay.ts`, `email.ts`      |
| Types                | PascalCase      | `Product`, `Order`             |
| CSS classes (Tailwind)| kebab-case     | `product-card`, `hero-section` |

---

## 4. Component Standards

### Component Template

```tsx
// components/product/ProductCard.tsx

import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Cover image */}
      {/* Product info */}
      {/* Price + CTA */}
    </div>
  );
}
```

### Rules
- All components must be **named exports** (not default exports), except page/layout files.
- Props interface must be directly above the component function.
- No inline `style` attributes — use Tailwind classes only.
- Components must be **pure and reusable** — no direct DB calls inside a component.
- Data fetching belongs in page files or server actions, not components.

---

## 5. Next.js App Router Conventions

### Server Components (Default)
All components are Server Components by default. Only add `'use client'` when you need:
- `useState`, `useEffect`, `useRef`
- Browser-specific APIs
- Event handlers (`onClick`, `onChange`, etc.)

```tsx
// Server Component — no directive needed
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return <ProductDetail product={product} />;
}
```

```tsx
// Client Component — add directive
'use client';
import { useState } from 'react';

export function CouponInput({ onApply }: { onApply: (discount: number) => void }) {
  const [code, setCode] = useState('');
  // ...
}
```

### API Routes

```typescript
// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  productId: z.string().uuid(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerMobile: z.string().regex(/^[6-9]\d{9}$/),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateOrderSchema.parse(body);
    // ... business logic
    return NextResponse.json({ razorpayOrderId: '...', amount: 9900 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## 6. Tailwind CSS Standards

### Design Tokens (tailwind.config.ts)

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue:    '#1a3a8f',   // Primary — Royal Blue
          'blue-dark': '#122870',
          'blue-light': '#2a52b8',
          gold:    '#f5c518',   // Accent — Gold/Yellow
          'gold-dark': '#d4a812',
        },
        neutral: {
          50:  '#f8f9fc',
          100: '#f1f3f9',
          // ...
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.07)',
        'card-hover': '0 8px 24px 0 rgba(26,58,143,0.12)',
      },
    },
  },
};
```

### Rules
- Use design tokens, not arbitrary values (no `text-[#1a3a8f]`).
- Responsive prefixes: `sm:`, `md:`, `lg:` for breakpoints.
- Mobile-first: base classes = mobile, `md:` = tablet, `lg:` = desktop.
- Prefer semantic class groupings — layout, spacing, typography, color, shadow — in that order.
- No `!important` — refactor specificity issues instead.

### Standard Button Classes

```tsx
// Primary button (yellow/gold CTA)
<button className="bg-brand-gold hover:bg-brand-gold-dark text-brand-blue font-semibold
                   px-6 py-3 rounded-xl transition-colors duration-200 focus:outline-none
                   focus:ring-2 focus:ring-brand-gold focus:ring-offset-2">
  Buy Now →
</button>

// Secondary button (outline)
<button className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue
                   hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors
                   duration-200">
  View All Subjects
</button>
```

---

## 7. Prisma / Database Standards

### Schema Conventions

```prisma
// prisma/schema.prisma

model Product {
  id           String      @id @default(uuid())
  name         String
  slug         String      @unique
  class        Int?        // null = common across all classes
  subject      String      // SubjectSlug
  description  String      @db.Text
  paperCount   Int
  questionCount Int
  price        Int         // stored in paise (smallest unit)
  refPrice     Int
  pdfKey       String      // S3/R2 object key
  coverImage   String
  productType  String      // ProductType enum
  status       String      @default("active")
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  orders       Order[]

  @@index([class, subject])
  @@index([slug])
}
```

### Rules
- All monetary amounts stored in **paise** (integer), not rupees (float). Convert only at display layer.
- Use `uuid()` for all primary keys.
- Add `@@index` for all commonly queried fields.
- Never raw-query the DB from a component or page — always via `lib/db/queries.ts` functions.

### Query Pattern

```typescript
// lib/db/queries.ts
import { prisma } from './index';

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, status: 'active' },
  });
}

export async function getProductsByClass(classNumber: number) {
  return prisma.product.findMany({
    where: { class: classNumber, status: 'active' },
    orderBy: { createdAt: 'asc' },
  });
}
```

---

## 8. Razorpay Integration Standards

### Creating Orders

```typescript
// lib/razorpay.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig),
  );
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig),
  );
}
```

### Rules
- **Never expose `RAZORPAY_KEY_SECRET` to the client.**
- Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` may go into client-side code.
- Always verify payment signature server-side before fulfilling the order.
- Always use `crypto.timingSafeEqual` for signature comparison (prevents timing attacks).
- Always implement idempotency: check if `razorpay_payment_id` already processed before marking PAID.

---

## 9. API Security Standards

### Middleware Pattern for Admin Routes

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Input Validation (All API routes)

Every API route must validate its input with a Zod schema before any processing.

```typescript
// Pattern for all API routes
const Schema = z.object({ /* ... */ });
const parsed = Schema.safeParse(await req.json());
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
}
```

---

## 10. Email Standards

### Resend Integration

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPDFDeliveryEmail({
  to,
  customerName,
  productName,
  orderId,
  downloadToken,
}: {
  to: string;
  customerName: string;
  productName: string;
  orderId: string;
  downloadToken: string;
}) {
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${downloadToken}`;

  await resend.emails.send({
    from: `OlympiadPDFs <${process.env.FROM_EMAIL}>`,
    to,
    subject: 'Your OlympiadPDFs Practice Papers Are Ready 🎯',
    html: buildDeliveryEmailHtml({ customerName, productName, orderId, downloadUrl }),
  });
}
```

### Rules
- All emails must use the branded HTML template.
- Always use `FROM_EMAIL` environment variable — never hardcode.
- Log email send attempts and failures.
- Email sending must be **non-blocking** — do not `await` it on the critical payment path; use a background job or fire-and-forget with error logging.

---

## 11. S3 / Storage Standards

```typescript
// lib/storage.ts
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function generateSignedDownloadUrl(key: string, expiresInSeconds = 900) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}
```

### Rules
- S3 bucket must have **Block all public access** enabled.
- All PDFs accessed via presigned URLs only (max 15-minute expiry).
- PDF object keys must not follow a predictable pattern (use UUID-based keys).
- Bucket name and region must come from environment variables.

---

## 12. Error Handling Standards

```typescript
// Standard API error response format
type ApiError = {
  error: string;
  code?: string;
  details?: unknown;
};

// Standard success response format
type ApiSuccess<T> = {
  data: T;
};
```

- Use `try/catch` in all API routes.
- Log errors server-side (console.error or a logging service).
- Never expose raw error stack traces to the client.
- Return user-friendly error messages for client-facing endpoints.

---

## 13. Utility Functions

```typescript
// lib/utils.ts

/** Convert paise to formatted INR string */
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

/** Calculate discount percentage */
export function discountPercent(price: number, refPrice: number): number {
  return Math.round(((refPrice - price) / refPrice) * 100);
}

/** Generate a secure download token */
export function generateDownloadToken(): string {
  return crypto.randomUUID();
}

/** Build SEO-friendly product slug */
export function buildProductSlug(className: number | null, subject: string, type: string): string {
  const parts = [];
  if (className) parts.push(`class-${className}`);
  parts.push(subject.toLowerCase().replace(/\s+/g, '-'));
  parts.push('olympiad-practice-papers');
  return parts.join('-');
}
```

---

## 14. Git Conventions

### Branch Naming
- `main` — production
- `dev` — development integration
- `feature/[short-description]` — new feature
- `fix/[short-description]` — bug fix

### Commit Messages (Conventional Commits)
```
feat: add coupon validation API endpoint
fix: correct price rounding in checkout summary
chore: update Prisma schema for downloads table
docs: update code standards with email pattern
```

### PR Rules
- No direct pushes to `main`.
- All PRs must pass ESLint with zero errors.
- All PRs should include a brief description of what changed.

---

*Created: 2026-08-17 | Stack: Next.js 14 + TypeScript + Tailwind + Prisma + Razorpay*
