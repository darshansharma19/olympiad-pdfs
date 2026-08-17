# OlympiadPDFs — Project Overview

> **Expert Practice. Better Preparation.**

---

## What Is OlympiadPDFs?

**OlympiadPDFs** is a modern Indian EdTech e-commerce platform that sells expert-designed Olympiad practice and sample question papers in PDF format for students of **Classes 6 to 10**.

It is a **digital-product business** — there is no physical delivery. Customers discover the platform via social media ads, purchase a PDF, receive it instantly by email, and begin practicing.

---

## The Core Customer Journey

```
Instagram / Facebook / Meta Ads
              ↓
        OlympiadPDFs Website
              ↓
         Select Class
              ↓
        Select Subject
              ↓
        View Product
              ↓
          Buy Now
              ↓
        Apply Coupon
              ↓
      Razorpay Checkout
              ↓
      Payment Verification
              ↓
       Order Confirmation
              ↓
      Automatic PDF Email
              ↓
        Download PDF
              ↓
       Start Practicing
```

---

## Brand Identity

| Element       | Value                                |
|---------------|--------------------------------------|
| **Name**      | OlympiadPDFs                         |
| **Tagline**   | Expert Practice. Better Preparation. |
| **Primary**   | Deep/Royal Blue                      |
| **Secondary** | White                                |
| **Accent**    | Yellow/Gold                          |

The visual language (blue, white, yellow) must be consistent across the website, PDF covers, social media, advertisements, and all promotional material.

---

## Target Audience

### Primary
- **Students** in Classes 6–10 seeking additional Olympiad-style practice.
- **Parents** looking for affordable, printable/downloadable practice material.

### Secondary (Future)
- Private tutors
- Coaching institutes
- Schools and educational organizations

---

## Products & Catalogue

### Subjects (6 total)

| Subject           | Focus Area                                          |
|-------------------|-----------------------------------------------------|
| Mathematics       | Olympiad-style problem solving and application      |
| Science           | Conceptual and application-based practice           |
| English           | Grammar, vocabulary, comprehension, reasoning       |
| Computer Science  | Fundamentals, logical thinking, computational logic |
| General Knowledge | General awareness and age-appropriate GK            |
| Reasoning         | Logical reasoning, patterns, sequences, analysis    |

### Classes
Class 6 | Class 7 | Class 8 | Class 9 | Class 10

### Product Types

| Type             | Description                                    |
|------------------|------------------------------------------------|
| Individual Paper | Single subject, single class paper             |
| Subject Pack     | Multiple papers for one subject + class        |
| Class Bundle     | All 6 subjects for one class                   |
| Complete Bundle  | All 6 subjects, all 5 classes (premium tier)   |

### Pricing (Starting From)

| Tier             | Price |
|------------------|-------|
| Individual Paper | ₹19   |
| Subject Pack     | ₹99   |
| Class Bundle     | ₹199  |
| Complete Bundle  | ₹499  |

> All prices are configurable via the admin panel.

---

## Key Features

### For Customers
- Browse by class or subject
- View product details (paper count, question count, answer key)
- Apply social-media discount coupons (e.g., `INSTA20`, `FB20`)
- Secure Razorpay checkout (no account required)
- Automatic PDF delivery to email after payment
- Secure, temporary download link

### For Admin
- Add/edit/delete products; upload PDFs
- Manage pricing and reference prices
- View all orders (ID, customer, status, amount)
- Create and manage coupon codes
- Analytics: revenue, orders, best-sellers, coupon usage, downloads

---

## Technology Stack (Recommended)

| Layer          | Technology                         |
|----------------|------------------------------------|
| Frontend       | Next.js + TypeScript               |
| UI Styling     | Tailwind CSS                       |
| Backend        | Next.js API routes / Node.js       |
| Database       | PostgreSQL                         |
| Authentication | Secure admin auth (JWT / NextAuth) |
| Payment        | Razorpay                           |
| PDF Storage    | S3 / Cloudflare R2 / Supabase      |
| Email          | Resend / Amazon SES                |
| Hosting        | Vercel                             |

---

## Core Website Pages (MVP)

| Route                | Purpose                          |
|----------------------|----------------------------------|
| `/`                  | Homepage (main sales page)       |
| `/classes`           | All classes overview             |
| `/class/[6-10]`      | Class-specific product listing   |
| `/subjects`          | All subjects overview            |
| `/subject/[subject]` | Subject-specific product listing |
| `/bundles`           | All bundles listing              |
| `/product/[slug]`    | Individual product detail page   |
| `/checkout`          | Checkout form + Razorpay         |
| `/payment/success`   | Payment success confirmation     |
| `/payment/failed`    | Payment failure page             |
| `/faq`               | FAQ accordion                    |
| `/contact`           | Contact/support                  |
| `/privacy`           | Privacy Policy                   |
| `/terms`             | Terms & Conditions               |
| `/refund-policy`     | Refund/Cancellation Policy       |
| `/admin/*`           | Admin panel (protected)          |

---

## V1 Success Scenario

> A parent sees an Instagram advertisement → visits OlympiadPDFs on their phone → selects Class 6 Science → sees a professional product card → applies a social-media coupon → pays ₹99 through Razorpay → **receives the correct PDF automatically by email within minutes.**

This must work entirely without human intervention.

---

## Non-Negotiable Principles

1. **Mobile-first** — most traffic will come from Instagram/Facebook ads on mobile.
2. **Instant, automated delivery** — no manual WhatsApp/email delivery.
3. **Simple checkout** — no forced account creation.
4. **Secure payment** — server-side Razorpay verification only; never trust the frontend.
5. **Private PDF storage** — PDFs must never be publicly accessible via predictable URLs.
6. **Performance** — landing page must feel near-instantaneous.
7. **Trust** — the site must feel professional enough for parents to trust it with payment.

---

*Created: 2026-08-17 | Source: instruction.txt*
