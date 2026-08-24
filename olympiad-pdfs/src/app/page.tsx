import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClassCard, type ClassProduct } from '@/components/product/ClassCard';
import { OlympiadShowcase } from '@/components/home/OlympiadShowcase';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'OlympiadPDFs — Expert Olympiad Practice Papers for Classes 6–10',
  description:
    'Expert-designed Olympiad practice papers for Classes 6–10 in Mathematics (IMO), Science (ISO), English (IEO), CS (ICSO), and Reasoning (IRO). Instant PDF delivery.',
};

// Revalidate every hour
export const revalidate = 3600;

const DEFAULT_FALLBACK_PRODUCTS: Record<number, ClassProduct[]> = {
  6: [
    { id: 'c6-math', subject: 'mathematics', name: 'Class 6 Mathematics Olympiad (IMO)', price: 9900 },
    { id: 'c6-sci', subject: 'science', name: 'Class 6 Science Olympiad (ISO)', price: 9900 },
    { id: 'c6-eng', subject: 'english', name: 'Class 6 English Olympiad (IEO)', price: 9900 },
    { id: 'c6-cs', subject: 'computer_science', name: 'Class 6 Computer Science Olympiad (ICSO)', price: 9900 },
    { id: 'c6-rea', subject: 'reasoning', name: 'Class 6 Reasoning Olympiad (IRO)', price: 9900 },
  ],
  7: [
    { id: 'c7-math', subject: 'mathematics', name: 'Class 7 Mathematics Olympiad (IMO)', price: 9900 },
    { id: 'c7-sci', subject: 'science', name: 'Class 7 Science Olympiad (ISO)', price: 9900 },
    { id: 'c7-eng', subject: 'english', name: 'Class 7 English Olympiad (IEO)', price: 9900 },
    { id: 'c7-cs', subject: 'computer_science', name: 'Class 7 Computer Science Olympiad (ICSO)', price: 9900 },
    { id: 'c7-rea', subject: 'reasoning', name: 'Class 7 Reasoning Olympiad (IRO)', price: 9900 },
  ],
  8: [
    { id: 'c8-math', subject: 'mathematics', name: 'Class 8 Mathematics Olympiad (IMO)', price: 9900 },
    { id: 'c8-sci', subject: 'science', name: 'Class 8 Science Olympiad (ISO)', price: 9900 },
    { id: 'c8-eng', subject: 'english', name: 'Class 8 English Olympiad (IEO)', price: 9900 },
    { id: 'c8-cs', subject: 'computer_science', name: 'Class 8 Computer Science Olympiad (ICSO)', price: 9900 },
    { id: 'c8-rea', subject: 'reasoning', name: 'Class 8 Reasoning Olympiad (IRO)', price: 9900 },
  ],
  9: [
    { id: 'c9-math', subject: 'mathematics', name: 'Class 9 Mathematics Olympiad (IMO)', price: 9900 },
    { id: 'c9-sci', subject: 'science', name: 'Class 9 Science Olympiad (ISO)', price: 9900 },
    { id: 'c9-eng', subject: 'english', name: 'Class 9 English Olympiad (IEO)', price: 9900 },
    { id: 'c9-cs', subject: 'computer_science', name: 'Class 9 Computer Science Olympiad (ICSO)', price: 9900 },
    { id: 'c9-rea', subject: 'reasoning', name: 'Class 9 Reasoning Olympiad (IRO)', price: 9900 },
  ],
  10: [
    { id: 'c10-math', subject: 'mathematics', name: 'Class 10 Mathematics Olympiad (IMO)', price: 9900 },
    { id: 'c10-sci', subject: 'science', name: 'Class 10 Science Olympiad (ISO)', price: 9900 },
    { id: 'c10-eng', subject: 'english', name: 'Class 10 English Olympiad (IEO)', price: 9900 },
    { id: 'c10-cs', subject: 'computer_science', name: 'Class 10 Computer Science Olympiad (ICSO)', price: 9900 },
    { id: 'c10-rea', subject: 'reasoning', name: 'Class 10 Reasoning Olympiad (IRO)', price: 9900 },
  ],
};

async function getProductsByClass(): Promise<Record<number, ClassProduct[]>> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ class: 'asc' }, { subject: 'asc' }],
      select: { id: true, class: true, subject: true, name: true, price: true, imageUrl: true },
    });

    if (!products || products.length === 0) {
      return DEFAULT_FALLBACK_PRODUCTS;
    }

    const byClass: Record<number, ClassProduct[]> = {};
    for (const p of products) {
      if (!byClass[p.class]) byClass[p.class] = [];
      byClass[p.class].push({ id: p.id, subject: p.subject, name: p.name, price: p.price });
    }

    // Fallback if any class is missing
    for (const cls of [6, 7, 8, 9, 10]) {
      if (!byClass[cls] || byClass[cls].length === 0) {
        byClass[cls] = DEFAULT_FALLBACK_PRODUCTS[cls];
      }
    }

    return byClass;
  } catch (err) {
    console.warn('[getProductsByClass] Falling back to default product catalog:', err);
    return DEFAULT_FALLBACK_PRODUCTS;
  }
}

const CLASSES = [6, 7, 8, 9, 10];

const FAQS = [
  {
    q: 'What is OlympiadPDFs?',
    a: 'OlympiadPDFs provides expert-designed Olympiad-style practice papers for Classes 6–10 in IMO (Mathematics), ISO (Science), IEO (English), ICSO (Computer Science), and IRO (Reasoning).',
  },
  {
    q: 'Are these official Olympiad examination papers?',
    a: 'No. These are independently created Olympiad-style practice and sample papers designed to help students prepare for competitions. OlympiadPDFs is an independent platform and has no official affiliation with SOF or any external Olympiad organization.',
  },
  {
    q: 'What are the pricing options available?',
    a: 'We offer two simple, affordable options: Complete Bundle of 5 (All 5 Olympiads) for ₹299, or a Single Olympiad Paper for ₹99.',
  },
  {
    q: 'How will I receive my purchased PDFs?',
    a: 'Immediately after successful payment via Razorpay, your PDFs are available for instant download on the confirmation screen and are also sent directly to your registered email address.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account creation is required. Simply select your class and Olympiad subjects, enter your basic contact details, pay securely, and download your PDFs.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Payments are processed securely via Razorpay, supporting UPI (Google Pay, PhonePe, Paytm, QR Code), debit/credit cards, and net banking.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Since PDFs are instant digital downloads, all sales are final once delivered. If you face any technical issues with your download links, our support team is available at support@olympiadpdfs.com.',
  },
];

export default async function HomePage() {
  const productsByClass = await getProductsByClass();

  // JSON-LD Structured Data Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        name: 'OlympiadPDFs',
        url: 'https://olympiadpdfs.com',
        description: 'Expert-designed Olympiad practice papers for school students in Classes 6–10.',
        sameAs: [],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      <main>
        {/* ── 1. HERO ──────────────────────────────────────────────── */}
        <section
          style={{
            background:
              'radial-gradient(ellipse at 50% -20%, #1e4fd8 0%, #0f2b6e 45%, #08173d 100%)',
            padding: 'clamp(3rem, 7vw, 5.25rem) 0 clamp(2.5rem, 5vw, 4.25rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Particles */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              opacity: 0.25,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            📐
          </div>
          <div
            className="animate-float-reverse"
            style={{
              position: 'absolute',
              top: '18%',
              right: '6%',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              opacity: 0.3,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            🏆
          </div>

          <div className="container-site" style={{ position: 'relative', textAlign: 'center' }}>
            {/* Live Prep Alert Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(245, 197, 24, 0.35)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                padding: '6px 18px',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                maxWidth: '100%',
              }}
            >
              <span className="live-indicator" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 'clamp(0.6875rem, 2vw, 0.8125rem)',
                  color: '#fbdf6e',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  whiteSpace: 'normal',
                }}
              >
                2026 Olympiad Exam Season Preparation
              </span>
            </div>

            {/* Main Punchy Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(1.85rem, 6vw, 3.75rem)',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-1px',
                margin: '0 auto 16px',
                maxWidth: '820px',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Master School Olympiads.<br />
              <span style={{ color: 'var(--color-brand-gold)' }}>Aim for the Top 1% Rank.</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(0.9375rem, 2.5vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.92)',
                maxWidth: '640px',
                margin: '0 auto 28px',
                lineHeight: 1.6,
                fontWeight: 400,
                padding: '0 8px',
              }}
            >
              High-yield, competition-style practice papers for Classes 6–10 in <strong>IMO, ISO, IEO, ICSO, and IRO</strong>. Instant PDF download.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
              <a
                href="#choose-class"
                className="btn-primary"
                style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  padding: '12px 24px',
                  width: 'min(100%, 320px)',
                  textAlign: 'center',
                }}
              >
                🚀 Choose Your Class — From ₹99
              </a>
              <a
                href="#olympiad-subjects"
                className="btn-secondary"
                style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  padding: '12px 24px',
                  width: 'min(100%, 320px)',
                  textAlign: 'center',
                }}
              >
                💡 Explore Subjects & Quizzes
              </a>
            </div>

            {/* Trust Pills */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Expert Olympiad Standard', 'HOTS & Logic Focus', 'Instant PDF Delivery', 'Print Ready'].map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: 'clamp(0.6875rem, 1.8vw, 0.8125rem)',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.95)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span style={{ color: 'var(--color-brand-gold)', fontWeight: 900 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. CLASS CARDS (PRODUCT PURCHASE / SELL PART FIRST) ─── */}
        <section id="choose-class" className="section" style={{ background: '#f8fafc', padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(15, 43, 110, 0.08)',
                  color: 'var(--color-brand-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  marginBottom: '10px',
                }}
              >
                Select Your Grade
              </div>
              <h2 className="section-title" style={{ margin: 0 }}>Choose Your Class & Start Practicing</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>
                Get all 5 subjects in a complete bundle for ₹299, or select an individual subject paper for ₹99.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                gap: '20px',
              }}
            >
              {CLASSES.map((cls) => (
                <ClassCard
                  key={cls}
                  classNumber={cls}
                  products={productsByClass[cls] ?? []}
                  imageUrl={`/images/classes/class-${cls}.svg`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. INTERACTIVE OLYMPIAD SHOWCASE (MOVED AFTER CLASS CARDS) ─── */}
        <div id="olympiad-subjects">
          <OlympiadShowcase />
        </div>

        {/* ── 4. HOW IT WORKS ───────────────────────────────────────── */}
        <section className="section" style={{ background: '#f8fafc', padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>Four simple steps to start practicing in under 60 seconds.</p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                gap: '18px',
              }}
            >
              {[
                { num: '01', title: 'Pick Your Class', desc: 'Choose Complete Bundle of 5 (₹299) or Single Paper (₹99).' },
                { num: '02', title: 'Enter Basic Info', desc: 'Provide student/parent name, email, and mobile number.' },
                { num: '03', title: 'Instant UPI Checkout', desc: 'Pay securely via Google Pay, PhonePe, Paytm, or Cards.' },
                { num: '04', title: 'Download & Print', desc: 'Instant access on screen and PDF copy delivered to your email.' },
              ].map((s) => (
                <div
                  key={s.num}
                  style={{
                    textAlign: 'center',
                    padding: '24px 16px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div
                    className="step-number"
                    style={{
                      margin: '0 auto 14px',
                      background: 'linear-gradient(135deg, var(--color-brand-blue) 0%, #1e4fd8 100%)',
                      boxShadow: '0 4px 12px rgba(15, 43, 110, 0.25)',
                    }}
                  >
                    {s.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.0625rem',
                      color: 'var(--color-brand-blue)',
                      margin: '0 0 8px',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. WHY STUDENTS LOVE US ───────────────────────────────── */}
        <section className="section" style={{ background: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(245, 197, 24, 0.15)',
                  color: '#92400e',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  marginBottom: '10px',
                }}
              >
                Why OlympiadPDFs?
              </div>
              <h2 className="section-title" style={{ margin: 0 }}>Designed for Competition Success</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>
                Bridge the gap between regular school textbooks and national Olympiad test patterns.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
                gap: '16px',
              }}
            >
              {[
                { icon: '🎯', title: 'Olympiad Standard', desc: 'Questions calibrated to exact competition depth with HOTS emphasis.' },
                { icon: '💡', title: 'Concept Focused', desc: 'Trains students in non-routine problem solving and lateral deduction.' },
                { icon: '⚡', title: 'Instant Delivery', desc: 'Immediate download links on checkout + emailed straight to inbox.' },
                { icon: '💰', title: 'Super Affordable', desc: '₹99 Single Paper · ₹299 for all 5 subjects complete bundle.' },
                { icon: '📱', title: 'Printable Anywhere', desc: 'Clean, printer-friendly PDF layout for offline mock test practice.' },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '20px 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1.5px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '1.875rem', marginBottom: '10px' }}>{f.icon}</div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: 'var(--color-brand-blue)',
                      margin: '0 0 6px',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. FAQ ────────────────────────────────────────────────── */}
        <section className="section" style={{ background: '#f8fafc', padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
          <div className="container-site" style={{ maxWidth: '740px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="faq-item"
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '0 16px',
                    border: '1.5px solid #e2e8f0',
                  }}
                >
                  <summary
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 'clamp(0.875rem, 2.5vw, 0.9375rem)', color: 'var(--color-brand-blue)' }}>
                      {faq.q}
                    </span>
                    <span style={{ flexShrink: 0, fontSize: '1.125rem', color: 'var(--color-brand-blue)', fontWeight: 800 }}>
                      +
                    </span>
                  </summary>
                  <div style={{ paddingBottom: '16px', fontSize: '0.875rem', color: 'var(--color-neutral-600)', lineHeight: 1.65 }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. GOLD CTA ───────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #f5c518 0%, #eab308 100%)', padding: 'clamp(3rem, 6vw, 4rem) 0' }}>
          <div className="container-site" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(1.4rem, 4vw, 2.5rem)',
                color: 'var(--color-brand-blue)',
                margin: '0 0 10px',
                letterSpacing: '-0.5px',
              }}
            >
              Start Practicing for 2026 Olympiads Today
            </h2>
            <p style={{ fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)', color: 'rgba(15, 43, 110, 0.9)', margin: '0 0 22px', fontWeight: 700 }}>
              ₹299 Complete Bundle of 5 · ₹99 Single Paper · Instant PDF download
            </p>
            <a
              href="#choose-class"
              style={{
                display: 'inline-block',
                background: 'var(--color-brand-blue)',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1rem',
                boxShadow: '0 6px 20px rgba(15,43,110,0.35)',
                transition: 'transform 0.15s ease',
                width: 'min(100%, 300px)',
              }}
            >
              Choose Your Class →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
