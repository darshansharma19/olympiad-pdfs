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

// Revalidate every hour so newly added products appear without a redeploy
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
    a: 'We offer three simple, affordable options: Bundle of 5 (All 5 Olympiads) for ₹299, Pack of 2 (Any 2 Olympiads) for ₹149, or a Single Olympiad Paper for ₹99.',
  },
  {
    q: 'How will I receive my purchased PDFs?',
    a: 'Immediately after successful payment via Razorpay, your PDFs are available for download on the confirmation screen and are also sent directly to your registered email address.',
  },
  {
    q: 'Can I choose any two subjects for the Pack of 2?',
    a: 'Yes! You can choose any two different Olympiad subjects (e.g. IMO + ISO, or IMO + IRO) for your class at ₹149.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account creation is required. Simply select your class and Olympiad subjects, enter your basic contact details, pay securely, and download your PDFs.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Payments are processed securely via Razorpay, supporting UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and net banking.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Since PDFs are instant digital downloads, all sales are final once delivered. If you face any technical issues with your download links, our support team is available at support@olympiadpdfs.com.',
  },
];

export default async function HomePage() {
  const productsByClass = await getProductsByClass();

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          style={{
            background:
              'linear-gradient(160deg, var(--color-brand-blue) 0%, #1e4fd8 55%, var(--color-brand-blue-light) 100%)',
            padding: 'clamp(3rem,8vw,4.5rem) 0 clamp(2.5rem,6vw,3.5rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'rgba(245,197,24,0.07)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-60px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }}
          />
          <div className="container-site" style={{ position: 'relative', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245,197,24,0.15)',
                border: '1px solid rgba(245,197,24,0.3)',
                borderRadius: '9999px',
                padding: '6px 18px',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-brand-gold)', fontWeight: 600 }}>
                📚 Classes 6–10 · IMO · ISO · IEO · ICSO · IRO · Instant Delivery
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(2rem,6vw,3.25rem)',
                color: '#fff',
                lineHeight: 1.15,
                letterSpacing: '-1px',
                margin: '0 auto 16px',
                maxWidth: '750px',
              }}
            >
              Prepare Smarter<br />
              <span style={{ color: 'var(--color-brand-gold)' }}>for School Olympiads.</span>
            </h1>
            <p
              style={{
                fontSize: 'clamp(0.9375rem,2.5vw,1.125rem)',
                color: 'rgba(255,255,255,0.85)',
                maxWidth: '560px',
                margin: '0 auto 28px',
                lineHeight: 1.6,
              }}
            >
              Expert-designed Olympiad practice papers for Classes 6–10. Bundle of 5 at ₹299, Pack of 2 at ₹149, or Single Paper at ₹99.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Expert Designed', 'Answer Key Included', 'Instant Delivery', 'No Account Needed'].map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  <span style={{ color: 'var(--color-brand-gold)', fontWeight: 800 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLASS CARDS ────────────────────────────────────────── */}
        <section id="choose-class" className="section" style={{ background: 'var(--color-neutral-50)' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">Choose Your Class</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>
                Select a Bundle of 5 (₹299), Pack of 2 (₹149), or Single Paper (₹99).
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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

        {/* ── HOW IT WORKS ───────────────────────────────────────── */}
        <section className="section">
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle" style={{ margin: '10px auto 0' }}>Four simple steps to start practicing.</p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                { num: '01', title: 'Choose Option', desc: 'Pick Bundle of 5 (₹299), Pack of 2 (₹149), or Single (₹99).' },
                { num: '02', title: 'Enter Details', desc: 'Provide your name, email, and mobile number.' },
                { num: '03', title: 'Pay Securely', desc: 'Complete test/live payment via Razorpay.' },
                { num: '04', title: 'Download PDFs', desc: 'Instant download link + email delivery.' },
              ].map((s) => (
                <div key={s.num} style={{ textAlign: 'center', padding: '0 8px' }}>
                  <div className="step-number" style={{ margin: '0 auto 14px' }}>{s.num}</div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1rem',
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
        <section className="section" style={{ background: 'var(--color-neutral-50)' }}>
          <div className="container-site">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">Why OlympiadPDFs?</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                { icon: '🎯', title: 'Expert Designed', desc: 'Olympiad-standard difficulty covering core curriculum concepts.' },
                { icon: '💡', title: 'Concept Focused', desc: 'Emphasis on analytical thinking and logical problem-solving.' },
                { icon: '⚡', title: 'Instant Delivery', desc: 'Immediate PDF download links sent right to your email.' },
                { icon: '💰', title: 'Affordable Pricing', desc: '₹99 Single · ₹149 Pack of 2 · ₹299 Complete Bundle of 5.' },
                { icon: '📱', title: 'Study Anywhere', desc: 'Printable PDFs accessible on phone, tablet, or desktop.' },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: '#fff',
                    borderRadius: '1rem',
                    padding: '22px',
                    boxShadow: 'var(--shadow-card)',
                    border: '1px solid var(--color-neutral-100)',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{f.icon}</div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
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
        <section className="section">
          <div className="container-site" style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
            {FAQS.map((faq, i) => (
              <details key={i} className="faq-item">
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
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>
                    {faq.q}
                  </span>
                  <span style={{ flexShrink: 0, fontSize: '1.125rem', color: 'var(--color-brand-gold)', fontWeight: 800 }}>
                    +
                  </span>
                </summary>
                <div style={{ paddingBottom: '16px', fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── GOLD CTA ───────────────────────────────────────────── */}
        <section style={{ background: 'var(--color-brand-gold)', padding: '3rem 0' }}>
          <div className="container-site" style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.375rem,4vw,2rem)',
                color: 'var(--color-brand-blue)',
                margin: '0 0 10px',
                letterSpacing: '-0.5px',
              }}
            >
              Start Practicing Today
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(26,58,143,0.75)', margin: '0 0 24px' }}>
              ₹299 Bundle of 5 · ₹149 Pack of 2 · ₹99 Single · Instant PDF delivery
            </p>
            <a
              href="#choose-class"
              style={{
                display: 'inline-block',
                background: 'var(--color-brand-blue)',
                color: '#fff',
                padding: '13px 32px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1rem',
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
