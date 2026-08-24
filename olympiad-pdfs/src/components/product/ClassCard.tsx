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

const OLYMPIAD_SUBJECT_LABELS: Record<string, { code: string; icon: string; full: string; color: string }> = {
  mathematics: { code: 'IMO', icon: '📐', full: 'International Mathematics Olympiad (IMO)', color: '#1e40af' },
  science: { code: 'ISO', icon: '🔬', full: 'International Science Olympiad (ISO)', color: '#047857' },
  english: { code: 'IEO', icon: '📖', full: 'International English Olympiad (IEO)', color: '#7c3aed' },
  computer_science: { code: 'ICSO', icon: '💻', full: 'International Computer Science Olympiad (ICSO)', color: '#0284c7' },
  reasoning: { code: 'IRO', icon: '🧩', full: 'International Reasoning Olympiad (IRO)', color: '#c2410c' },
};

const BUNDLE_PRICE = 29900; // ₹299
const SINGLE_PRICE = 9900;  // ₹99

export function ClassCard({ classNumber, products, imageUrl }: ClassCardProps) {
  const [singleSubject, setSingleSubject] = useState(products[0]?.subject ?? '');
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);

  const hasAllSubjects = products.length === 5;
  const selectedSingleProduct = products.find((p) => p.subject === singleSubject);

  function handleBuyBundle() {
    setCheckoutItem({
      type: 'bundle_5',
      classNumber,
      productName: `Class ${classNumber} Complete Bundle — All 5 Olympiads`,
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
        className="card-hover-lift"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}
      >
        {/* ── Card Header Banner ─────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            height: 140,
            flexShrink: 0,
            background: 'linear-gradient(135deg, #071536 0%, #0f2b6e 60%, #1e4fd8 100%)',
          }}
        >
          <Image
            src={imageUrl || `/images/classes/class-${classNumber}.svg`}
            alt={`Class ${classNumber}`}
            fill
            style={{ objectFit: 'cover', opacity: 0.85 }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            unoptimized
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8, 23, 61, 0.95) 0%, rgba(15, 43, 110, 0.4) 60%, rgba(15, 43, 110, 0.1) 100%)',
            }}
          />

          <div style={{ position: 'absolute', bottom: 14, left: 18, right: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.55rem',
                  color: '#ffffff',
                  lineHeight: 1,
                  letterSpacing: '-0.6px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                CLASS {classNumber}
              </p>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Grade {classNumber}
              </span>
            </div>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: 'var(--color-brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              5 OLYMPIADS INCLUDED
            </p>
          </div>
        </div>

        {/* ── Card Body ──────────────────────────────────────────── */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {products.length === 0 ? (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-neutral-500)',
                textAlign: 'center',
                margin: 'auto 0',
                padding: '28px 0',
              }}
            >
              Practice papers coming soon
            </p>
          ) : (
            <>
              {/* ─────────────────────────────────────────────────────
                  OPTION 1: BUNDLE OF 5 — ₹299 (GOLD HIGHLIGHTED)
                 ───────────────────────────────────────────────────── */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #fffdf2 0%, #fef8db 100%)',
                  border: '2px solid #f5c518',
                  borderRadius: '16px',
                  padding: '16px 14px 14px',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(245, 197, 24, 0.18)',
                }}
              >
                {/* Floating Gold Best Value Ribbon */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #f5c518 0%, #eab308 100%)',
                    color: 'var(--color-brand-blue)',
                    fontSize: '0.625rem',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                  }}
                >
                  ⭐ BEST VALUE (60% OFF)
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontSize: '1.0625rem',
                        color: 'var(--color-brand-blue)',
                        lineHeight: 1.2,
                      }}
                    >
                      BUNDLE OF 5
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                      All 5 Olympiad Papers
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontSize: '1.45rem',
                        color: 'var(--color-brand-blue)',
                        lineHeight: 1,
                      }}
                    >
                      ₹299
                    </span>
                    <span
                      style={{
                        marginLeft: '5px',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        textDecoration: 'line-through',
                        fontWeight: 500,
                      }}
                    >
                      ₹495
                    </span>
                  </div>
                </div>

                {/* 5 Subject Badges with Icons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                  {[
                    { code: 'IMO', icon: '📐' },
                    { code: 'ISO', icon: '🔬' },
                    { code: 'IEO', icon: '📖' },
                    { code: 'ICSO', icon: '💻' },
                    { code: 'IRO', icon: '🧩' },
                  ].map((b) => (
                    <span
                      key={b.code}
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        color: 'var(--color-brand-blue)',
                        background: 'rgba(15, 43, 110, 0.08)',
                        borderRadius: '6px',
                        padding: '3px 7px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>{b.icon}</span>
                      <span>{b.code}</span>
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleBuyBundle}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f5c518 0%, #eab308 100%)',
                    color: 'var(--color-brand-blue)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 3px 12px rgba(245, 197, 24, 0.35)',
                    minHeight: '44px',
                  }}
                >
                  GET BUNDLE — ₹299
                </button>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '-2px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94a3b8' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* ─────────────────────────────────────────────────────
                  OPTION 2: SINGLE PAPER — ₹99
                 ───────────────────────────────────────────────────── */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '12px 14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        color: 'var(--color-brand-blue)',
                      }}
                    >
                      SINGLE PAPER
                    </h4>
                    <p style={{ margin: '1px 0 0', fontSize: '0.6875rem', color: '#64748b' }}>
                      Choose 1 Olympiad
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: '1.1875rem',
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
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      color: '#1e293b',
                      background: '#ffffff',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {products.map((p) => {
                      const info = OLYMPIAD_SUBJECT_LABELS[p.subject];
                      return (
                        <option key={p.subject} value={p.subject}>
                          {info?.icon || '📄'} {info?.code || p.subject.toUpperCase()} — {info?.full || p.name}
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
                    background: '#ffffff',
                    color: 'var(--color-brand-blue)',
                    border: '1.5px solid var(--color-brand-blue)',
                    borderRadius: '8px',
                    padding: '9px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: '40px',
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
