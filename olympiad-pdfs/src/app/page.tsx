import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClassCard, type ClassProduct } from '@/components/product/ClassCard';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'OlympiadPDFs — Expert Practice Papers for Classes 6–10',
  description:
    'Olympiad-style practice papers for Classes 6–10 in Mathematics, Science, English, Computer Science, and Reasoning. ₹99 per subject. Instant PDF delivery.',
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
  { q: 'What is OlympiadPDFs?', a: 'OlympiadPDFs provides expert-designed practice papers for Classes 6–10 in Mathematics, Science, English, Computer Science, and Reasoning.' },
  { q: 'Are these official Olympiad papers?', a: 'No — these are independently created practice papers for Olympiad preparation. They are not affiliated with any official Olympiad organisation.' },
  { q: 'How will I receive my purchase?', a: 'Your PDF is automatically emailed to you after payment. You will also get a direct download link on the confirmation screen.' },
  { q: 'Do I need to create an account?', a: 'No. Just select your subject, pay, and receive your PDF — no account required.' },
  { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and wallets — all secured by Razorpay.' },
  { q: 'What is your refund policy?', a: 'Since PDFs are digital goods, refunds are not provided after delivery. If you face any issue, email support@olympiadpdfs.com.' },
];

export default async function HomePage() {
  const productsByClass = await getProductsByClass();

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(160deg, var(--color-brand-blue) 0%, #1e4fd8 55%, var(--color-brand-blue-light) 100%)',
          padding: 'clamp(3rem,8vw,5rem) 0 clamp(2.5rem,6vw,4rem)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(245,197,24,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div className="container-site" style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)',
              borderRadius: '9999px', padding: '6px 18px', marginBottom: '24px',
            }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-brand-gold)', fontWeight: 600 }}>
                📚 Classes 6–10 · 5 Subjects · Instant Digital Delivery
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2rem,6vw,3.5rem)',
              color: '#fff', lineHeight: 1.1, letterSpacing: '-1px',
              margin: '0 auto 16px', maxWidth: '700px',
            }}>
              Prepare Smarter<br />
              <span style={{ color: 'var(--color-brand-gold)' }}>for Olympiads.</span>
            </h1>
            <p style={{
              fontSize: 'clamp(0.9375rem,2.5vw,1.125rem)',
              color: 'rgba(255,255,255,0.85)', maxWidth: '520px',
              margin: '0 auto 32px', lineHeight: 1.7,
            }}>
              Expert practice papers for Classes 6–10. ₹99 per subject. ₹299 for all 5 subjects. PDF delivered instantly after payment.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Expert Designed', 'Answer Key Included', 'Instant Delivery', 'No Account Needed'].map((t) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
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
                Select a subject for ₹99, or get all 5 subjects in a bundle for ₹299.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { num: '01', title: 'Choose', desc: 'Select your class and subject — or pick the bundle.' },
                { num: '02', title: 'Fill Details', desc: 'Enter your name, email, and mobile number.' },
                { num: '03', title: 'Pay', desc: 'Complete payment securely via Razorpay.' },
                { num: '04', title: 'Receive', desc: 'PDF delivered instantly to your email.' },
              ].map((s) => (
                <div key={s.num} style={{ textAlign: 'center', padding: '0 8px' }}>
                  <div className="step-number" style={{ margin: '0 auto 14px' }}>{s.num}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-brand-blue)', margin: '0 0 8px' }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>{s.desc}</p>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
              {[
                { icon: '🎯', title: 'Expert Designed', desc: 'Created with Olympiad-style difficulty and preparation in mind.' },
                { icon: '💡', title: 'Concept Focused', desc: 'Questions emphasise understanding and problem-solving.' },
                { icon: '⚡', title: 'Instant Delivery', desc: 'No shipping or waiting. PDF emailed right after payment.' },
                { icon: '💰', title: 'Affordable', desc: '₹99 per subject. ₹299 for all 5. No subscriptions.' },
                { icon: '📱', title: 'Any Device', desc: 'Download once, study on phone, tablet, or computer.' },
              ].map((f) => (
                <div key={f.title} style={{ background: '#fff', borderRadius: '1rem', padding: '22px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-neutral-100)' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-blue)', margin: '0 0 6px' }}>{f.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>{f.desc}</p>
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
                <summary style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', gap: '12px', cursor: 'pointer' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>{faq.q}</span>
                  <span style={{ flexShrink: 0, fontSize: '1.125rem', color: 'var(--color-brand-gold)', fontWeight: 800 }}>+</span>
                </summary>
                <div style={{ paddingBottom: '16px', fontSize: '0.9375rem', color: 'var(--color-neutral-600)', lineHeight: 1.7 }}>{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── GOLD CTA ───────────────────────────────────────────── */}
        <section style={{ background: 'var(--color-brand-gold)', padding: '3rem 0' }}>
          <div className="container-site" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.375rem,4vw,2rem)', color: 'var(--color-brand-blue)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              Start Practicing Today
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(26,58,143,0.75)', margin: '0 0 24px' }}>
              ₹99 per subject · ₹299 for all 5 · Instant PDF delivery
            </p>
            <a href="#choose-class" style={{
              display: 'inline-block',
              background: 'var(--color-brand-blue)', color: '#fff',
              padding: '13px 32px', borderRadius: '10px',
              textDecoration: 'none', fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: '1rem',
            }}>
              Choose Your Class →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
