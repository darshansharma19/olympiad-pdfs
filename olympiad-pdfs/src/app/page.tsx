import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClassCard, type ClassProduct } from '@/components/product/ClassCard';
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
    a: 'We offer two simple, affordable options: Bundle of 5 (All 5 Olympiads) for ₹299, or a Single Olympiad Paper for ₹99.',
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
              'linear-gradient(155deg, #091a42 0%, #0f2b6e 45%, #1a3a8f 80%, #2563eb 100%)',
            padding: 'clamp(3.5rem,8vw,5.25rem) 0 clamp(3rem,6vw,4.25rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              right: '-100px',
              width: '550px',
              height: '550px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, rgba(245,197,24,0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-80px',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div className="container-site" style={{ position: 'relative', textAlign: 'center' }}>
            {/* Top Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 197, 24, 0.12)',
                border: '1px solid rgba(245, 197, 24, 0.35)',
                backdropFilter: 'blur(8px)',
                borderRadius: '9999px',
                padding: '7px 20px',
                marginBottom: '22px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.02em' }}>
                ⭐ Classes 6–10 · IMO · ISO · IEO · ICSO · IRO · Instant Download
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(2.15rem,6.5vw,3.5rem)',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-1.2px',
                margin: '0 auto 18px',
                maxWidth: '780px',
                textShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}
            >
              Prepare Smarter<br />
              <span style={{ color: 'var(--color-brand-gold)' }}>for School Olympiads.</span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: 'clamp(1rem,2.5vw,1.1875rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                margin: '0 auto 30px',
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              Expert-designed practice papers for Classes 6–10. ₹99 per subject or ₹299 for the Complete 5-Subject Bundle.
            </p>

            {/* Trust Badges — Notice 'Answer Key Included' is removed */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Expert Designed', 'Olympiad Standard', 'Instant PDF Delivery', 'No Account Needed'].map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.95)',
                    background: 'rgba(255,255,255,0.08)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <span style={{ color: 'var(--color-brand-gold)', fontWeight: 900 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLASS CARDS ────────────────────────────────────────── */}
        <section id="choose-class" className="section" style={{ background: '#f8fafc', padding: '4rem 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(26,58,143,0.08)',
                  color: 'var(--color-brand-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  marginBottom: '10px',
                }}
              >
                Available Classes
              </div>
              <h2 className="section-title" style={{ margin: 0 }}>Choose Your Class</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>
                Select a single subject for ₹99, or get all 5 subjects in a complete bundle for ₹299.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '22px',
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
        <section className="section" style={{ background: '#ffffff', padding: '4rem 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>Four simple steps to start practicing immediately.</p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                { num: '01', title: 'Choose Option', desc: 'Pick Complete Bundle of 5 (₹299) or Single Subject (₹99).' },
                { num: '02', title: 'Enter Details', desc: 'Provide your name, email address, and mobile number.' },
                { num: '03', title: 'Pay with UPI / Cards', desc: 'Complete checkout securely via Razorpay.' },
                { num: '04', title: 'Download PDFs', desc: 'Instant download link on screen and sent to your email.' },
              ].map((s) => (
                <div
                  key={s.num}
                  style={{
                    textAlign: 'center',
                    padding: '24px 16px',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    className="step-number"
                    style={{
                      margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, var(--color-brand-blue) 0%, #2563eb 100%)',
                      boxShadow: '0 4px 10px rgba(26, 58, 143, 0.2)',
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

        {/* ── WHY ────────────────────────────────────────────────── */}
        <section className="section" style={{ background: '#f8fafc', padding: '4rem 0' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
              <h2 className="section-title">Why OlympiadPDFs?</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>
                Built to help ambitious school students build conceptual clarity and exam confidence.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px',
              }}
            >
              {[
                { icon: '🎯', title: 'Expert Designed', desc: 'Olympiad-standard difficulty covering core curriculum concepts.' },
                { icon: '💡', title: 'Concept Focused', desc: 'Emphasis on analytical thinking and logical problem-solving.' },
                { icon: '⚡', title: 'Instant Delivery', desc: 'Immediate PDF download links sent right to your email.' },
                { icon: '💰', title: 'Affordable Pricing', desc: '₹99 Single Paper · ₹299 Complete Bundle of 5.' },
                { icon: '📱', title: 'Study Anywhere', desc: 'Printable PDFs accessible on phone, tablet, or desktop.' },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: '#fff',
                    borderRadius: '1rem',
                    padding: '24px 20px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '12px' }}>{f.icon}</div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.9375rem',
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
        <section className="section" style={{ background: '#ffffff', padding: '4rem 0' }}>
          <div className="container-site" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="faq-item"
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '0 18px',
                    border: '1px solid #e2e8f0',
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
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>
                      {faq.q}
                    </span>
                    <span style={{ flexShrink: 0, fontSize: '1.125rem', color: 'var(--color-brand-blue)', fontWeight: 800 }}>
                      +
                    </span>
                  </summary>
                  <div style={{ paddingBottom: '16px', fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── GOLD CTA ───────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #f5c518 0%, #eab308 100%)', padding: '3.5rem 0' }}>
          <div className="container-site" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(1.5rem,4vw,2.25rem)',
                color: 'var(--color-brand-blue)',
                margin: '0 0 10px',
                letterSpacing: '-0.5px',
              }}
            >
              Start Practicing Today
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(26,58,143,0.85)', margin: '0 0 24px', fontWeight: 600 }}>
              ₹299 Bundle of 5 · ₹99 Single Paper · Instant PDF delivery
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
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(26,58,143,0.3)',
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
