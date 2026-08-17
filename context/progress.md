# OlympiadPDFs — Progress Record

> Living document tracking build progress, decisions, blockers, and completed milestones.
> Update this file at the end of every work session.

---

## Project Status

| Field           | Value                              |
|-----------------|------------------------------------|
| **Started**     | 2026-08-17                         |
| **Current Phase**| Phase 1 — Public Storefront        |
| **Overall Progress** | 17%                           |
| **Last Updated**| 2026-08-17                         |

---

## Phase Progress Tracker

| Phase | Name                              | Status      | % Complete |
|-------|-----------------------------------|-------------|------------|
| 0     | Foundation & Project Setup        | ✅ Complete  | 100%       |
| 1     | Public Storefront                 | 🔄 In Progress | 0%      |
| 2     | Checkout & Payments               | ⬜ Not Started | 0%      |
| 3     | PDF Delivery & Email              | ⬜ Not Started | 0%      |
| 4     | Admin Panel                       | ⬜ Not Started | 0%      |
| 5     | SEO, Analytics & Launch Readiness | ⬜ Not Started | 0%      |

**Status legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Blocked

---

## Session Log

### 2026-08-17 — Razorpay Test Mode & Sample PDF Setup

**Work Done:**
- Configured Razorpay Test Keys (`rzp_test_TQsFu63En5JTU3`) in `.env.local`
- Verified active connection to Razorpay API with successful test order creation
- Created sample practice paper PDF in `public/pdfs/` and seeded all 25 products with the sample PDF
- Enhanced `/api/orders/create` to deliver `razorpayKeyId` to frontend dynamically
- Enhanced `/api/download/[token]` to support relative local PDF paths and signed URLs

**Key Decisions Made:**
- Tested and verified Razorpay Test API connection
- Seeded local development database with sample PDF links for offline and local testing

**Next Session Goal:**
- Implement dynamic catalogue pages: `/class/[id]`, `/subject/[slug]`, `/product/[slug]`, `/bundles`

---

## Decisions Log

| Date       | Decision                                          | Reason                                            |
|------------|---------------------------------------------------|---------------------------------------------------|
| 2026-08-17 | Use Next.js 14 App Router                         | SSR/SSG/ISR flexibility; single deployment unit   |
| 2026-08-17 | Store prices in paise (integer)                   | Avoid floating-point rounding errors in payments  |
| 2026-08-17 | No user accounts required for purchase            | Reduce checkout friction; priority = conversions  |
| 2026-08-17 | Private S3/R2 + signed URLs for PDF delivery      | PDFs must never be publicly accessible            |
| 2026-08-17 | Server-side coupon validation always              | Prevent client-side coupon manipulation           |
| 2026-08-17 | Razorpay webhook as idempotent fulfillment backup | Client verification can fail; webhook is fallback |

---

## Blockers & Issues

| Date | Blocker | Status | Resolution |
|------|---------|--------|------------|
| —    | —       | —      | —          |

---

## Milestone Checklist

### Phase 0 — Foundation
- [ ] Next.js project scaffolded
- [ ] Tailwind brand tokens configured
- [ ] Prisma schema written and migrated
- [ ] PostgreSQL database connected
- [ ] S3/R2 bucket created (private)
- [ ] Resend account and API key configured
- [ ] Razorpay test keys obtained and configured
- [ ] All env vars set locally and on Vercel
- [ ] `npm run dev` runs without errors

### Phase 1 — Public Storefront
- [ ] Header + Footer + Mobile nav complete
- [ ] Homepage all sections complete
- [ ] `/class/[id]` and `/subject/[slug]` pages complete
- [ ] `/product/[slug]` product detail page complete
- [ ] `/bundles` page complete
- [ ] All static pages complete (FAQ, Privacy, Terms, Refund, Contact)
- [ ] Product seed data loaded
- [ ] Mobile-responsive verified (iPhone SE breakpoint)
- [ ] Lighthouse mobile score 85+

### Phase 2 — Checkout & Payments
- [ ] Checkout form complete
- [ ] Coupon validation API working
- [ ] Order creation API working
- [ ] Razorpay modal integration working
- [ ] Payment verification API working (signature check)
- [ ] Razorpay webhook working
- [ ] `/payment/success` and `/payment/failed` pages complete
- [ ] End-to-end test in Razorpay test mode passed

### Phase 3 — PDF Delivery
- [ ] Test PDFs uploaded to private S3/R2
- [ ] Secure download endpoint (`/api/download/[token]`) working
- [ ] Email template designed and tested
- [ ] Email delivery working after payment
- [ ] Download token expiry working
- [ ] Download count limit working

### Phase 4 — Admin Panel
- [ ] Admin login page + session working
- [ ] Admin middleware protecting all `/admin/*` routes
- [ ] Products CRUD working
- [ ] PDF upload to S3/R2 from admin working
- [ ] Orders listing working
- [ ] Coupons CRUD working
- [ ] Dashboard stats working

### Phase 5 — Launch Readiness
- [ ] All page SEO meta tags complete
- [ ] Sitemap generated
- [ ] robots.txt in place
- [ ] Open Graph images created
- [ ] Meta Pixel installed and tested
- [ ] `Purchase` event firing correctly
- [ ] Server-side Conversions API set up
- [ ] Lighthouse mobile score 90+
- [ ] End-to-end test with real Razorpay payment passed
- [ ] All legal pages reviewed
- [ ] Production environment variables verified

---

## Notes & References

- Full project spec: [`instruction.txt`](../instruction.txt)
- Architecture: [`architecture.md`](./architecture.md)
- Build plan: [`build-plan.md`](./build-plan.md)
- Code standards: [`code-standards.md`](./code-standards.md)
- Razorpay docs: https://razorpay.com/docs/
- Resend docs: https://resend.com/docs
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs

---

*This file should be updated at the start and end of every work session.*
