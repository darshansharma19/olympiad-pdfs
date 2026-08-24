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

async function getProductsByClass(): Promise<Record<number, ClassProduct[]>> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ class: 'asc' }, { subject: 'asc' }],
    select: { id: true, class: true, subject: true, name: true, price: true, imageUrl: true },
  });

  const byClass: Record<number, ClassProduct[]> = {};
  for (const p of products) {
    if (!byClass[p.class]) byClass[p.class] = [];
    byClass[p.class].push({ id: p.id, subject: p.subject, name: p.name, price: p.price });
  }
  return byClass;
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
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          style={{
            background:
              'radial-gradient(ellipse at 50% -20%, #1e4fd8 0%, #0f2b6e 45%, #08173d 100%)',
            padding: 'clamp(3.5rem,8vw,5.5rem) 0 clamp(3rem,6vw,4.5rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Floating Student / Olympiad Icons */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '12%',
              left: '6%',
              fontSize: '2rem',
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
              top: '20%',
              right: '8%',
              fontSize: '2.25rem',
              opacity: 0.3,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            🏆
          </div>
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '10%',
              fontSize: '1.75rem',
              opacity: 0.25,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            🔬
          </div>
          <div
            className="animate-float-reverse"
            style={{
              position: 'absolute',
              bottom: '22%',
              right: '12%',
              fontSize: '2rem',
              opacity: 0.25,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            🧩
          </div>

          <div className="container-site" style={{ position: 'relative', textAlign: 'center' }}>
            {/* Top Live Prep Alert Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(245, 197, 24, 0.35)',
                backdropFilter: 'blur(12px)',
                borderRadius: '9999px',
                padding: '8px 22px',
                marginBottom: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
            >
              <span className="live-indicator" />
              <span style={{ fontSize: '0.8125rem', color: '#fbdf6e', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                2026 Olympiad Exam Season Preparation
              </span>
            </div>

            {/* Main Punchy Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(2.25rem, 6.5vw, 3.75rem)',
                color: '#ffffff',
                lineHeight: 1.12,
                letterSpacing: '-1.5px',
                margin: '0 auto 20px',
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
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.92)',
                maxWidth: '640px',
                margin: '0 auto 34px',
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              High-yield, competition-style practice papers for Classes 6–10 in <strong>IMO, ISO, IEO, ICSO, and IRO</strong>. Instant PDF download.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
              <a href="#choose-class" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                🚀 Choose Your Class — From ₹99
              </a>
              <a href="#olympiad-subjects" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                💡 Explore Subjects & Quizzes
              </a>
            </div>

            {/* Trust Pills */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Expert Olympiad Standard', 'HOTS & Logic Focus', 'Instant PDF Delivery', 'Print Ready'].map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.95)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '6px 14px',
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

        {/* ── INTERACTIVE OLYMPIAD SHOWCASE ─────────────────────── */}
        <div id="olympiad-subjects">
          <OlympiadShowcase />
        </div>

        {/* ── CLASS CARDS ────────────────────────────────────────── */}
        <section id="choose-class" className="section" style={{ background: '#f8fafc', padding: '4.5rem 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
              <h2 className="section-title" style={{ margin: 0 }}>Choose Your Class & Get Practicing</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>
                Get all 5 subjects in a complete bundle for ₹299, or select an individual subject paper for ₹99.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
                gap: '24px',
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

        {/* ── HOW IT WORKS ───────────────────────────────────────── */}
        <section className="section" style={{ background: '#ffffff', padding: '4.5rem 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>Four simple steps to start practicing in under 60 seconds.</p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
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
                    padding: '28px 20px',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div
                    className="step-number"
                    style={{
                      margin: '0 auto 16px',
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

        {/* ── WHY STUDENTS LOVE US ───────────────────────────────── */}
        <section className="section" style={{ background: '#f8fafc', padding: '4.5rem 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
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
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1.5px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
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

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="section" style={{ background: '#ffffff', padding: '4.5rem 0' }}>
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
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '0 20px',
                    border: '1.5px solid #e2e8f0',
                  }}
                >
                  <summary
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '18px 0',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>
                      {faq.q}
                    </span>
                    <span style={{ flexShrink: 0, fontSize: '1.125rem', color: 'var(--color-brand-blue)', fontWeight: 800 }}>
                      +
                    </span>
                  </summary>
                  <div style={{ paddingBottom: '18px', fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── GOLD CTA ───────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #f5c518 0%, #eab308 100%)', padding: '4rem 0' }}>
          <div className="container-site" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(1.625rem,4.5vw,2.5rem)',
                color: 'var(--color-brand-blue)',
                margin: '0 0 12px',
                letterSpacing: '-0.5px',
              }}
            >
              Start Practicing for 2026 Olympiads Today
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(15, 43, 110, 0.9)', margin: '0 0 26px', fontWeight: 700 }}>
              ₹299 Complete Bundle of 5 · ₹99 Single Paper · Instant PDF download
            </p>
            <a
              href="#choose-class"
              style={{
                display: 'inline-block',
                background: 'var(--color-brand-blue)',
                color: '#fff',
                padding: '15px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.0625rem',
                boxShadow: '0 6px 20px rgba(15,43,110,0.35)',
                transition: 'transform 0.15s ease',
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
