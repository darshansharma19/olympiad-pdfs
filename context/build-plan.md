# OlympiadPDFs — Build Plan

> Phased implementation plan for building the OlympiadPDFs website from scratch to production.

---

## Overview

The build is organized into **5 phases**. Each phase builds on the last and has a clear, testable deliverable. The project uses **Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL + Razorpay**.

---

## Phase 0 — Foundation & Project Setup

**Goal:** Working Next.js project with database connected and environment configured.

### Tasks
- [ ] Scaffold Next.js 14 project with TypeScript and Tailwind CSS
  ```bash
  npx create-next-app@latest olympiad-pdfs \
    --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Set up folder structure as per architecture.md
- [ ] Configure Tailwind design tokens (brand colors, fonts, spacing)
- [ ] Install and configure Prisma (or Drizzle) ORM
- [ ] Create PostgreSQL database (Supabase / Neon)
- [ ] Write and run database migrations (all tables from architecture.md)
- [ ] Configure `.env.local` with all required environment variables
- [ ] Set up S3 / Cloudflare R2 bucket (private, no public access)
- [ ] Configure Resend (or SES) transactional email
- [ ] Set up Razorpay test keys
- [ ] Configure Vercel project and connect GitHub repo
- [ ] Set up ESLint + Prettier
- [ ] Verify: `npm run dev` works, DB connects, env vars load

### Environment Variables Required
```
DATABASE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
FROM_EMAIL=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
NEXTAUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_SITE_URL=
META_PIXEL_ID=
```

---

## Phase 1 — Public Storefront (No Payments Yet)

**Goal:** Fully styled, navigable website with real product data. No checkout yet.

### 1A — Design System
- [ ] Set up Tailwind config with brand palette
  - Primary: `#1a3a8f` (Royal Blue)
  - Accent: `#f5c518` (Gold/Yellow)
  - Background: `#ffffff`, `#f8f9fc`
- [ ] Import Google Font: Inter (body) + a display face
- [ ] Create base UI components:
  - `Button` (primary yellow, secondary outline)
  - `Badge` (class/subject label)
  - `Card` (rounded, soft shadow)
  - `Input`, `Label`, `Select`
- [ ] Create `Header` with desktop nav + mobile hamburger menu
- [ ] Create `Footer` with all required links

### 1B — Homepage
- [ ] Hero section: heading, tagline, dual CTA, trust indicators
- [ ] "Choose Your Class" — 5 class cards (6, 7, 8, 9, 10)
- [ ] "Featured Papers" — product card grid (4 per row desktop, 1 on mobile)
- [ ] "Explore by Subject" — 6 subject cards with taglines
- [ ] "Save More with Bundles" — bundle highlight cards
- [ ] "Why OlympiadPDFs?" — 5 feature cards
- [ ] "How It Works" — 4-step visual flow
- [ ] "Practice Beyond the Textbook" — content quality section
- [ ] FAQ accordion (pre-launch content)
- [ ] Footer

### 1C — Catalogue Pages
- [ ] `/classes` — All 5 class cards
- [ ] `/class/[id]` — Dynamic class listing with product cards
- [ ] `/subjects` — All 6 subject cards
- [ ] `/subject/[slug]` — Dynamic subject listing
- [ ] `/bundles` — All bundle offerings
- [ ] `/product/[slug]` — Product detail page:
  - Cover image, name, class/subject badge
  - Paper count, question count, answer key included
  - Price + reference price + discount %
  - "Buy Now" button (links to checkout — wired in Phase 2)
  - "What's Included" list
  - "Suitable For" list

### 1D — Static Pages
- [ ] `/faq` — FAQ accordion with pre-launch Q&A
- [ ] `/contact` — Support email + contact form (no backend yet)
- [ ] `/privacy` — Privacy Policy
- [ ] `/terms` — Terms & Conditions
- [ ] `/refund-policy` — Refund/Cancellation Policy

### 1E — Admin: Seed Data
- [ ] Create admin seed script to populate initial products
- [ ] Verify product catalogue renders correctly on all listing pages

### Deliverable
Static, fully browseable storefront. All pages render correctly on mobile and desktop.

---

## Phase 2 — Checkout & Payments

**Goal:** End-to-end purchase flow working in Razorpay test mode.

### 2A — Checkout Page
- [ ] `/checkout` page with form:
  - Full Name, Email Address, Mobile Number
  - Coupon Code field with "Apply" button
  - Order summary (Product, Original price, Discount, Total)
  - "Pay Securely with Razorpay" button

### 2B — Coupon Validation API
- [ ] `POST /api/coupons/validate`
  - Accept: `{ code, product_id }`
  - Validate: code exists, not expired, usage limit not exceeded
  - Return: `{ valid, discount_type, discount_value, final_price }`
  - Never expose discount logic to client JS

### 2C — Order Creation API
- [ ] `POST /api/orders/create`
  - Re-validate coupon server-side
  - Calculate final amount
  - Create Razorpay order via Razorpay API
  - Store pending order in DB
  - Return `{ razorpay_order_id, amount, currency }`

### 2D — Razorpay Integration (Client)
- [ ] Load Razorpay checkout.js
- [ ] Open payment modal with order details, prefilled customer info
- [ ] Handle payment success callback → send to verify API

### 2E — Payment Verification API
- [ ] `POST /api/orders/verify`
  - HMAC-SHA256 signature verification
  - Mark order as PAID in DB
  - Create customer record if not exists
  - Generate secure download token (UUID, 72h expiry, 3 max downloads)
  - Trigger email delivery (async)
  - Redirect to `/payment/success?order_id=...`

### 2F — Razorpay Webhook
- [ ] `POST /api/webhooks/razorpay`
  - Verify webhook signature
  - Idempotency: skip if order already marked PAID
  - Trigger fulfillment if missed by client-side verify

### 2G — Success & Failure Pages
- [ ] `/payment/success` — Order ID, product name, "Check Your Email" CTA
- [ ] `/payment/failed` — Friendly message + "Try Again" CTA

### Deliverable
Full purchase flow from product page → checkout → Razorpay → confirmation. Test mode verified with multiple scenarios (success, failure, coupon applied, no coupon).

---

## Phase 3 — PDF Delivery & Email

**Goal:** Customers automatically receive their PDF by email after payment.

### 3A — PDF Storage Setup
- [ ] Upload test PDFs to private S3/R2 bucket
- [ ] Verify no public URL access (403 without signed URL)

### 3B — Secure Download Endpoint
- [ ] `GET /api/download/[token]`
  - Validate token exists + not expired + download count < max
  - Increment download count
  - Generate signed S3/R2 URL (15-min expiry)
  - Redirect customer to signed URL

### 3C — Email Templates
- [ ] Branded HTML email template:
  - Subject: "Your OlympiadPDFs Practice Papers Are Ready 🎯"
  - Customer name, product details, Order ID
  - Prominent download button (links to `/api/download/[token]`)
  - Team OlympiadPDFs sign-off

### 3D — Email Sending
- [ ] Resend (or SES) integration
- [ ] Send email immediately after payment verification
- [ ] Webhook as fallback re-trigger if email failed first time

### Deliverable
After payment, customer receives email within 60 seconds with working PDF download link. Token expires after 72 hours or 3 downloads.

---

## Phase 4 — Admin Panel

**Goal:** Admin can manage the entire catalogue and view orders without touching the database directly.

### 4A — Admin Authentication
- [ ] Protect `/admin/*` routes via Next.js middleware
- [ ] Simple email + password admin login (hashed password in env var or DB)
- [ ] Session management (JWT cookie or NextAuth)

### 4B — Dashboard
- [ ] `/admin/dashboard` — Stats overview:
  - Total revenue, orders today/all-time, downloads
  - Best-selling products table
  - Recent orders list

### 4C — Products Management
- [ ] `/admin/products` — Products table with search + filter
- [ ] Add product form: name, slug, class, subject, type, price, ref_price, paper_count, question_count, status
- [ ] PDF upload to S3/R2 (presigned upload URL pattern)
- [ ] Edit and delete/archive product
- [ ] Enable/disable product toggle

### 4D — Orders Management
- [ ] `/admin/orders` — Orders table:
  - Columns: Order ID, Customer, Email, Product, Amount, Payment Status, Delivery Status, Date
  - Filter by date range, payment status, delivery status
  - Manual re-send email button (for support)

### 4E — Coupons Management
- [ ] `/admin/coupons` — Coupons table
- [ ] Create coupon: code, type (percentage/fixed), discount, expiry, usage limit
- [ ] View usage count per coupon
- [ ] Enable/disable coupon

### Deliverable
Admin can fully manage the product catalogue and monitor orders from a browser interface.

---

## Phase 5 — SEO, Analytics & Launch Readiness

**Goal:** Website ready for real customers and advertising.

### 5A — SEO
- [ ] Unique `<title>` and `<meta description>` for every page
- [ ] SEO-friendly URLs: `/product/class-6-science-olympiad-practice-papers`
- [ ] Canonical URLs
- [ ] Sitemap (`/sitemap.xml`) — auto-generated from product slugs
- [ ] `robots.txt`
- [ ] Open Graph meta tags + OG images for product pages
- [ ] Structured heading hierarchy (single `<h1>` per page)
- [ ] JSON-LD structured data for product pages (Product schema)

### 5B — Meta Pixel Integration
- [ ] Install Meta Pixel in `layout.tsx`
- [ ] Fire `PageView` on all pages
- [ ] Fire `ViewContent` on product detail pages
- [ ] Fire `InitiateCheckout` on checkout page load
- [ ] Fire `Purchase` on `/payment/success` (client-side)
- [ ] Implement server-side `Purchase` via Meta Conversions API for iOS accuracy

### 5C — Performance
- [ ] Optimize all images (next/image with proper sizes)
- [ ] Optimize fonts (next/font, preload)
- [ ] Minimize client-side JS (prefer RSC where possible)
- [ ] Verify Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Mobile lighthouse score target: 90+

### 5D — Search & Filters
- [ ] Client-side filter panel on listing pages: class, subject, product type
- [ ] Search input on catalogue pages
- [ ] URL-based filter state (shareable links)

### 5E — Pre-Launch Checklist
- [ ] All legal pages live (Privacy, Terms, Refund, Digital Delivery Policy)
- [ ] Test end-to-end flow on mobile (real device, not just emulator)
- [ ] Verify Razorpay webhook in production mode
- [ ] Verify all PDF downloads work in production
- [ ] Verify all email deliveries (spam folder check)
- [ ] Set up Vercel production environment variables
- [ ] Enable Vercel analytics
- [ ] Test with real Razorpay payment (small amount)

### Deliverable
Production website live on custom domain. Full purchase, delivery, and admin flow tested end-to-end with real payments.

---

## Ongoing (Post-Launch)

| Task                            | Priority | Notes                              |
|---------------------------------|-----------|------------------------------------|
| Add real customer testimonials  | High      | Replace placeholder section         |
| A/B test hero CTAs              | Medium    | Use Vercel split testing            |
| WhatsApp delivery backup        | Medium    | Fallback for email failures         |
| PDF watermarking                | Low       | Add customer email + order ID       |
| Student accounts / order history| Low       | Phase 2 feature                     |
| Institutional/bulk pricing      | Low       | Future revenue stream               |

---

*Created: 2026-08-17 | Source: instruction.txt + architecture.md*
