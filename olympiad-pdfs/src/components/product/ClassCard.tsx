'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckoutModal, type CheckoutItem } from '../checkout/CheckoutModal';

export interface ClassProduct {
  id: string;
  subject: string;
  name: string;
  price: number; // paise
}

interface ClassCardProps {
  classNumber: number;
  products: ClassProduct[];
  imageUrl: string;
}

const OLYMPIAD_SUBJECT_LABELS: Record<string, { code: string; full: string }> = {
  mathematics: { code: 'IMO', full: 'International Mathematics Olympiad (IMO)' },
  science: { code: 'ISO', full: 'International Science Olympiad (ISO)' },
  english: { code: 'IEO', full: 'International English Olympiad (IEO)' },
  computer_science: { code: 'ICSO', full: 'International Computer Science Olympiad (ICSO)' },
  reasoning: { code: 'IRO', full: 'International Reasoning Olympiad (IRO)' },
};

const BUNDLE_PRICE = 29900; // ₹299
const SINGLE_PRICE = 9900;  // ₹99

export function ClassCard({ classNumber, products, imageUrl }: ClassCardProps) {
  // Single selection state
  const [singleSubject, setSingleSubject] = useState(products[0]?.subject ?? '');
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);

  const hasAllSubjects = products.length === 5;
  const selectedSingleProduct = products.find((p) => p.subject === singleSubject);

  // Action handlers
  function handleBuyBundle() {
    setCheckoutItem({
      type: 'bundle_5',
      classNumber,
      productName: `Class ${classNumber} Complete Bundle of 5 Olympiad Practice Papers`,
      amount: BUNDLE_PRICE,
    });
  }

  function handleBuySingle() {
    if (!selectedSingleProduct) return;
    const code = OLYMPIAD_SUBJECT_LABELS[selectedSingleProduct.subject]?.code || selectedSingleProduct.subject;

    setCheckoutItem({
      type: 'single',
      productId: selectedSingleProduct.id,
      productName: `Class ${classNumber} ${code} Olympiad Practice Paper`,
      amount: selectedSingleProduct.price || SINGLE_PRICE,
    });
  }

  return (
    <>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          border: '1.5px solid var(--color-neutral-200)',
          borderRadius: '16px',
          background: '#fff',
          boxShadow: 'var(--shadow-card)',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Card Header / Image */}
        <div style={{ position: 'relative', height: 130, flexShrink: 0, background: 'var(--color-brand-blue-50)' }}>
          <Image
            src={imageUrl || `/images/classes/class-${classNumber}.svg`}
            alt={`Class ${classNumber}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            unoptimized
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(26,58,143,0.88) 0%, rgba(26,58,143,0.15) 70%)',
            }}
          />
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.5rem',
                color: '#fff',
                lineHeight: 1.1,
              }}
            >
              CLASS {classNumber}
            </p>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--color-brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              OLYMPIAD PRACTICE PAPERS
            </p>
          </div>
        </div>

        {/* Card Body — 2 Clear Purchase Options: Bundle of 5 & Single Paper */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {products.length === 0 ? (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-neutral-500)',
                textAlign: 'center',
                margin: 'auto 0',
                padding: '24px 0',
              }}
            >
              Practice papers coming soon
            </p>
          ) : (
            <>
              {/* ─────────────────────────────────────────────────────────────
                  OPTION 1: BUNDLE OF 5 — ₹299 (PRIMARY / HIGHLIGHTED)
                 ───────────────────────────────────────────────────────────── */}
              <div
                style={{
                  background: hasAllSubjects
                    ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                    : 'var(--color-neutral-50)',
                  border: hasAllSubjects ? '2px solid var(--color-brand-gold)' : '1px solid var(--color-neutral-200)',
                  borderRadius: '12px',
                  padding: '14px',
                  position: 'relative',
                }}
              >
                {hasAllSubjects && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '12px',
                      background: 'var(--color-brand-gold)',
                      color: 'var(--color-brand-blue)',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    ⭐ BEST VALUE
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: 'var(--color-brand-blue)',
                      }}
                    >
                      BUNDLE OF 5
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
                      All 5 Olympiad Papers
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        color: 'var(--color-brand-blue)',
                      }}
                    >
                      ₹299
                    </span>
                    <span
                      style={{
                        marginLeft: '4px',
                        fontSize: '0.6875rem',
                        color: 'var(--color-neutral-400)',
                        textDecoration: 'line-through',
                      }}
                    >
                      ₹495
                    </span>
                  </div>
                </div>

                {/* 5 Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                  {['IMO', 'ISO', 'IEO', 'ICSO', 'IRO'].map((code) => (
                    <span
                      key={code}
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-blue)',
                        background: 'rgba(26,58,143,0.1)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                      }}
                    >
                      {code}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleBuyBundle}
                  disabled={!hasAllSubjects}
                  style={{
                    width: '100%',
                    background: hasAllSubjects ? 'var(--color-brand-gold)' : 'var(--color-neutral-300)',
                    color: hasAllSubjects ? 'var(--color-brand-blue)' : 'var(--color-neutral-500)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: hasAllSubjects ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                >
                  {hasAllSubjects ? 'GET BUNDLE — ₹299' : `Coming Soon (${products.length}/5)`}
                </button>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '-2px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-neutral-200)' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-neutral-400)' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-neutral-200)' }} />
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  OPTION 2: SINGLE PAPER — ₹99
                 ───────────────────────────────────────────────────────────── */}
              <div
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-neutral-200)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: 'var(--color-brand-blue)',
                      }}
                    >
                      SINGLE PAPER
                    </h4>
                    <p style={{ margin: '1px 0 0', fontSize: '0.6875rem', color: 'var(--color-neutral-500)' }}>
                      Choose 1 Subject
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.125rem',
                      color: 'var(--color-brand-blue)',
                    }}
                  >
                    ₹99
                  </span>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <select
                    value={singleSubject}
                    onChange={(e) => setSingleSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1.5px solid var(--color-neutral-300)',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      color: 'var(--color-neutral-800)',
                      background: '#fff',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {products.map((p) => {
                      const info = OLYMPIAD_SUBJECT_LABELS[p.subject];
                      return (
                        <option key={p.subject} value={p.subject}>
                          {info?.code || p.subject.toUpperCase()} — {info?.full || p.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  onClick={handleBuySingle}
                  disabled={!selectedSingleProduct}
                  style={{
                    width: '100%',
                    background: '#fff',
                    color: 'var(--color-brand-blue)',
                    border: '1.5px solid var(--color-brand-blue)',
                    borderRadius: '8px',
                    padding: '8px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  BUY SINGLE — ₹99
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutItem && (
        <CheckoutModal item={checkoutItem} onClose={() => setCheckoutItem(null)} />
      )}
    </>
  );
}
