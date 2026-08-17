# OlympiadPDFs — System Architecture

> Architecture blueprint for the OlympiadPDFs website — an Indian EdTech e-commerce platform for digital Olympiad practice papers.
>
> *Generated: 2026-08-17 | Stack: Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL + Razorpay*

---

## 1. Architectural Overview

OlympiadPDFs follows a **Layered Monorepo** architecture built on Next.js 14 (App Router), combining server-side rendering for SEO-critical pages, static generation for catalogue pages, and API routes for backend operations. The system uses a **BFF (Backend for Frontend)** pattern — the Next.js API routes act as the sole backend, keeping the architecture simple and deployment-friendly for a solo/small-team project.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│   Browser (React Components, Tailwind CSS, Razorpay SDK)     │
└─────────────────────┬───────────────────────────────────────┘
                      │  HTTPS
┌─────────────────────▼───────────────────────────────────────┐
│                     NEXT.JS APP (VERCEL)                      │
│  ┌────────────────┐  ┌──────────────────────────────────┐    │
│  │  App Router    │  │  API Routes (/api/*)              │    │
│  │  Pages (RSC)   │  │  (Checkout, Webhooks, Admin, PDF) │    │
│  └────────────────┘  └──────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
┌───────▼───┐  ┌──────▼──────┐ ┌───▼────┐  ┌─────▼──────┐
│ PostgreSQL │  │   Razorpay  │ │   S3   │  │  Resend /  │
│ (Supabase │  │   Payment   │ │   /R2  │  │  SES Email │
│   / Neon) │  │   Gateway   │ │ Storage│  │  Service   │
└───────────┘  └─────────────┘ └────────┘  └────────────┘
```

---

## 2. High-Level Component Diagram (C4 — Container Level)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Customer Browser]                                               │
│  Next.js React Components — Server + Client                      │
│  Razorpay Checkout Modal                                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │ API calls / Server Actions
┌──────────────────────▼──────────────────────────────────────────┐
│ [Next.js Server — Vercel]                                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ Pages (App Router — /app)                               │     │
│  │  /                 → Homepage (SSG)                     │     │
│  │  /class/[id]       → Class listing (ISR)                │     │
│  │  /subject/[slug]   → Subject listing (ISR)              │     │
│  │  /product/[slug]   → Product detail (ISR)               │     │
│  │  /checkout         → Checkout form (CSR)                │     │
│  │  /payment/*        → Success/Failure (CSR)              │     │
│  │  /admin/*          → Admin panel (SSR, auth-gated)      │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ API Routes (/app/api)                                   │     │
│  │  POST /api/orders/create    → Create Razorpay order     │     │
│  │  POST /api/orders/verify    → Verify payment signature  │     │
│  │  POST /api/webhooks/razorpay→ Razorpay webhook handler  │     │
│  │  POST /api/coupons/validate → Validate coupon code      │     │
│  │  GET  /api/download/[token] → Secure PDF download       │     │
│  │  POST /api/admin/products   → Admin: CRUD products      │     │
│  │  GET  /api/admin/orders     → Admin: View orders        │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Folder Structure

```
olympiad-pdfs/
├── app/                          # Next.js 14 App Router
│   ├── (public)/                 # Public routes group
│   │   ├── page.tsx              # Homepage
│   │   ├── classes/page.tsx      # All classes
│   │   ├── class/[id]/page.tsx   # Class-specific listing
│   │   ├── subjects/page.tsx     # All subjects
│   │   ├── subject/[slug]/page.tsx
│   │   ├── bundles/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── payment/
│   │   │   ├── success/page.tsx
│   │   │   └── failed/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── refund-policy/page.tsx
│   ├── (admin)/                  # Protected admin routes
│   │   ├── layout.tsx            # Auth guard
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── products/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── coupons/page.tsx
│   │       └── analytics/page.tsx
│   ├── api/                      # API routes
│   │   ├── orders/
│   │   │   ├── create/route.ts
│   │   │   └── verify/route.ts
│   │   ├── webhooks/
│   │   │   └── razorpay/route.ts
│   │   ├── coupons/
│   │   │   └── validate/route.ts
│   │   ├── download/
│   │   │   └── [token]/route.ts
│   │   └── admin/
│   │       ├── products/route.ts
│   │       ├── orders/route.ts
│   │       └── coupons/route.ts
│   ├── layout.tsx                # Root layout (Meta Pixel, fonts)
│   └── globals.css
├── components/                   # Reusable UI components
│   ├── ui/                       # Atoms: Button, Badge, Card, Input
│   ├── layout/                   # Header, Footer, MobileNav
│   ├── product/                  # ProductCard, ProductGrid, ProductDetail
│   ├── checkout/                 # CheckoutForm, PriceSummary
│   ├── admin/                    # AdminTable, ProductForm, StatsCard
│   └── shared/                   # FAQ, HowItWorks, TrustBadges
├── lib/                          # Server-side utilities
│   ├── db/
│   │   ├── index.ts              # DB connection (Prisma/Drizzle)
│   │   └── schema.ts             # Database schema
│   ├── razorpay.ts               # Razorpay client & helpers
│   ├── email.ts                  # Email send utility (Resend/SES)
│   ├── storage.ts                # S3/R2 signed URL generator
│   ├── auth.ts                   # Admin auth utilities
│   └── validations.ts            # Input validation schemas (Zod)
├── hooks/                        # Custom React hooks
│   ├── useRazorpay.ts
│   └── useCoupon.ts
├── types/                        # TypeScript types
│   └── index.ts
├── public/                       # Static assets
│   ├── images/
│   └── covers/                   # Product PDF cover images
├── prisma/ (or drizzle/)         # DB migrations and schema
│   └── schema.prisma
├── .env.local                    # Environment variables
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 4. Database Architecture

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Customer   │       │      Order       │       │   Product    │
├──────────────┤  1:N  ├──────────────────┤  N:1  ├──────────────┤
│ id (UUID)    │◄──────│ id (UUID)        │──────►│ id (UUID)    │
│ name         │       │ customer_id (FK) │       │ name         │
│ email        │       │ product_id (FK)  │       │ slug         │
│ mobile       │       │ amount           │       │ class        │
│ created_at   │       │ discount         │       │ subject      │
└──────────────┘       │ coupon_id (FK)   │       │ description  │
                       │ payment_status   │       │ paper_count  │
                       │ delivery_status  │       │ question_cnt │
                       │ created_at       │       │ price        │
                       └──────────────────┘       │ ref_price    │
                               │                  │ pdf_key      │
                               │                  │ cover_image  │
                               │                  │ product_type │
                        ┌──────▼──────┐           │ status       │
                        │   Payment   │           │ created_at   │
                        ├─────────────┤           └──────────────┘
                        │ id (UUID)   │
                        │ order_id FK │
                        │ rzp_order_id│
                        │ rzp_pay_id  │
                        │ rzp_sig     │
                        │ amount      │
                        │ status      │
                        └─────────────┘

┌──────────────┐       ┌──────────────────┐
│   Coupon     │       │    Download      │
├──────────────┤       ├──────────────────┤
│ id (UUID)    │       │ id (UUID)        │
│ code         │       │ order_id (FK)    │
│ type         │       │ product_id (FK)  │
│ discount     │       │ token (unique)   │
│ expiry       │       │ expires_at       │
│ usage_limit  │       │ download_count   │
│ usage_count  │       │ max_downloads    │
│ status       │       │ created_at       │
└──────────────┘       └──────────────────┘
```

### Key Tables

| Table      | Purpose                                                    |
|------------|------------------------------------------------------------|
| customers  | Buyer info captured at checkout                            |
| products   | Catalogue items (individual, pack, bundle)                 |
| orders     | Purchase records linking customer ↔ product ↔ payment      |
| payments   | Razorpay payment records for verification audit trail      |
| coupons    | Discount codes with limits and expiry                      |
| downloads  | Secure download tokens (short-lived, download-count-gated) |

---

## 5. Payment Flow Architecture

```
Customer clicks "Buy Now"
          │
          ▼
  POST /api/orders/create
  ┌──────────────────────────────┐
  │ 1. Validate coupon (server)  │
  │ 2. Calculate final amount    │
  │ 3. Create Razorpay order     │
  │ 4. Return { rzp_order_id }   │
  └──────────────────────────────┘
          │
          ▼
  Razorpay Modal opens (client)
          │
          ▼
  Customer pays
          │
          ▼
  Razorpay returns { payment_id, order_id, signature }
          │
          ▼
  POST /api/orders/verify
  ┌──────────────────────────────┐
  │ 1. HMAC-SHA256 sig verify    │
  │ 2. Mark order PAID in DB     │
  │ 3. Generate download token   │
  │ 4. Send PDF email (async)    │
  │ 5. Return success            │
  └──────────────────────────────┘
          │
          ▼
  /payment/success page
  (show order ID + "Check Email")
          │
          ▼
  (also) Razorpay Webhook → POST /api/webhooks/razorpay
  ┌──────────────────────────────┐
  │ Idempotent: re-trigger email │
  │ if order not yet fulfilled   │
  └──────────────────────────────┘
```

---

## 6. PDF Delivery Architecture

```
GET /api/download/[token]
          │
          ▼
  ┌────────────────────────────────┐
  │ 1. Validate token exists in DB │
  │ 2. Check token not expired     │
  │ 3. Check download_count limit  │
  │ 4. Increment download_count    │
  │ 5. Generate S3/R2 signed URL   │
  │    (15-min expiry)             │
  │ 6. Redirect to signed URL      │
  └────────────────────────────────┘
```

PDFs are stored in **private S3/R2 buckets** — never publicly accessible. All download requests must go through the API route which performs authorization checks.

---

## 7. Rendering Strategy

| Page                       | Strategy | Reason                                    |
|----------------------------|----------|-------------------------------------------|
| Homepage `/`               | SSG      | SEO, performance, rarely changes          |
| `/class/[id]`              | ISR      | Catalogue can update; needs SEO           |
| `/subject/[slug]`          | ISR      | Same as above                             |
| `/product/[slug]`          | ISR      | Product pages need SEO + fresh pricing    |
| `/checkout`                | CSR      | Fully dynamic; no SEO value               |
| `/payment/success`         | CSR      | Order-specific; session-gated             |
| `/admin/*`                 | SSR      | Auth-gated, always fresh data             |
| `/faq`, `/privacy`, etc.   | SSG      | Static content, maximum speed             |

---

## 8. Security Architecture

| Concern                    | Implementation                                          |
|----------------------------|---------------------------------------------------------|
| Payment verification       | HMAC-SHA256 signature verified server-side              |
| Webhook security           | Razorpay webhook signature validation                   |
| Admin access               | JWT or NextAuth session; middleware-protected routes     |
| PDF access                 | Signed, expiring URLs; download-count limits            |
| Coupon validation          | Always server-side; never in browser JS                 |
| Duplicate payment guard    | Idempotency check on `razorpay_order_id` before marking |
| Environment secrets        | `.env.local` / Vercel env vars; never in client bundle  |
| Input validation           | Zod schemas on all API endpoints                        |
| Rate limiting              | Vercel Edge or middleware-level rate limiter             |

---

## 9. Analytics & Tracking Architecture

### Meta Pixel Events

| Event               | Where Fired                        |
|---------------------|------------------------------------|
| `PageView`          | `layout.tsx` (root, all pages)     |
| `ViewContent`       | Product detail page load           |
| `InitiateCheckout`  | Checkout page load                 |
| `Purchase`          | `/payment/success` + server-side   |

### Server-Side Conversion API
`Purchase` events should be duplicated server-side via Meta Conversions API for improved attribution accuracy (iOS privacy restrictions).

---

## 10. Architecture Decision Records

### ADR-001: Next.js over separate frontend + backend
**Decision:** Use Next.js API routes instead of a separate Express/Node backend.  
**Reason:** Simpler deployment (single Vercel project), fewer moving parts for an early-stage product, App Router Server Actions allow co-location of data fetching with rendering.  
**Trade-off:** Harder to scale API layer independently if usage grows significantly.

### ADR-002: PostgreSQL over NoSQL
**Decision:** Use PostgreSQL (via Supabase or Neon).  
**Reason:** Relational data (customers ↔ orders ↔ products) maps naturally to SQL. Transactional integrity needed for payment records.  
**Trade-off:** Slightly more schema setup vs. document DB flexibility.

### ADR-003: ORM — Prisma (preferred) or Drizzle
**Decision:** Prisma for its mature ecosystem, type-safety, and excellent Next.js integration. Drizzle as an alternative if edge runtime is needed.

### ADR-004: PDF storage on private S3/R2 — not in the repo or public folder
**Decision:** All PDFs in private cloud storage only.  
**Reason:** Prevent unauthorized access. Token-gated signed URLs are the only delivery mechanism.

### ADR-005: No mandatory user accounts
**Decision:** Purchase flow works without account creation.  
**Reason:** Reduces checkout friction; highest-priority metric is completed purchases.

---

## 11. Extension Points (Future)

| Feature                     | Extension Point                                         |
|-----------------------------|---------------------------------------------------------|
| Bulk/institutional purchase | New product type + admin pricing tiers                  |
| Student accounts / history  | Add `auth_users` table + `/my-orders` route             |
| Watermarked PDFs            | PDF generation worker (Lambda / Vercel background fn)   |
| WhatsApp notifications      | Add WhatsApp Cloud API call after order fulfillment     |
| Affiliate / referral codes  | Extend coupons table with `affiliate_id`                |
| Multi-currency pricing       | Add `currency` column to products + Razorpay intl        |
| Reviews / ratings           | New `reviews` table linked to `orders`                  |

---

*Generated: 2026-08-17 | Architecture Skill applied*
