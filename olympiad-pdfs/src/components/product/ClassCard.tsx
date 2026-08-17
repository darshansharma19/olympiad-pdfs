'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckoutModal } from '../checkout/CheckoutModal';

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

const SUBJECT_LABELS: Record<string, string> = {
  mathematics: 'Mathematics',
  science: 'Science',
  english: 'English',
  computer_science: 'Computer Science',
  reasoning: 'Reasoning',
};

const BUNDLE_PRICE = 29900; // ₹299

export function ClassCard({ classNumber, products, imageUrl }: ClassCardProps) {
  const [selectedSubject, setSelectedSubject] = useState(products[0]?.subject ?? '');
  const [checkoutItem, setCheckoutItem] = useState<{
    type: 'individual' | 'bundle';
    productId?: string;
    classNumber?: number;
    productName: string;
    amount: number;
  } | null>(null);

  const selectedProduct = products.find((p) => p.subject === selectedSubject);
  const hasAllSubjects = products.length === 5;

  function handleBuySubject() {
    if (!selectedProduct) return;
    setCheckoutItem({
      type: 'individual',
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      amount: selectedProduct.price,
    });
  }

  function handleBuyBundle() {
    setCheckoutItem({
      type: 'bundle',
      classNumber,
      productName: `Class ${classNumber} Complete Bundle — All 5 Subjects`,
      amount: BUNDLE_PRICE,
    });
  }

  return (
    <>
      <div className="card" style={{
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', padding: 0,
      }}>
        {/* Card Image */}
        <div style={{ position: 'relative', height: 140, flexShrink: 0, background: 'var(--color-brand-blue-50)' }}>
          <Image
            src={imageUrl || `/images/classes/class-${classNumber}.svg`}
            alt={`Class ${classNumber}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            unoptimized // SVGs don't need Next.js optimization
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(26,58,143,0.85) 0%, rgba(26,58,143,0) 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 12, left: 14, right: 14,
          }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.625rem', color: '#fff', lineHeight: 1 }}>
              CLASS {classNumber}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-brand-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              PRACTICE PAPERS
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {products.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', textAlign: 'center', margin: 'auto 0', padding: '16px 0' }}>
              Papers coming soon
            </p>
          ) : (
            <>
              {/* Subject Dropdown */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-neutral-500)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1.5px solid var(--color-brand-blue)',
                    borderRadius: '8px', fontSize: '0.9375rem',
                    fontFamily: 'var(--font-body)', fontWeight: 600,
                    color: 'var(--color-brand-blue)',
                    background: '#fff', cursor: 'pointer',
                    outline: 'none', appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a3a8f' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    paddingRight: '36px',
                  }}
                >
                  {products.map((p) => (
                    <option key={p.subject} value={p.subject}>
                      {SUBJECT_LABELS[p.subject] ?? p.subject} — ₹{(p.price / 100).toFixed(0)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected subject preview */}
              {selectedProduct && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-brand-blue-50)', borderRadius: '8px', padding: '10px 12px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-neutral-500)', fontWeight: 600 }}>Class {classNumber}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', color: 'var(--color-brand-blue)', fontWeight: 700 }}>
                      {SUBJECT_LABELS[selectedProduct.subject]}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-brand-blue)' }}>
                    ₹{(selectedProduct.price / 100).toFixed(0)}
                  </span>
                </div>
              )}

              {/* BUY SUBJECT button */}
              <button
                onClick={handleBuySubject}
                disabled={!selectedProduct}
                style={{
                  background: 'var(--color-brand-blue)', color: '#fff',
                  border: 'none', borderRadius: '10px', padding: '13px',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '0.9375rem', cursor: 'pointer', width: '100%',
                }}
              >
                BUY NOW →
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-neutral-200)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-neutral-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-neutral-200)' }} />
              </div>

              {/* Bundle section */}
              <div style={{
                border: hasAllSubjects ? '1.5px solid var(--color-brand-gold)' : '1.5px solid var(--color-neutral-200)',
                borderRadius: '10px', padding: '14px',
                background: hasAllSubjects ? 'var(--color-brand-gold-50)' : 'var(--color-neutral-50)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>
                      Complete Bundle
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>
                      All 5 Subjects
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-brand-blue)' }}>
                      ₹299
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-neutral-400)', textDecoration: 'line-through' }}>₹495</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {['Math', 'Science', 'English', 'CS', 'Reasoning'].map((s) => (
                    <span key={s} style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-brand-blue)', background: 'rgba(26,58,143,0.08)', borderRadius: '4px', padding: '2px 7px' }}>
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleBuyBundle}
                  disabled={!hasAllSubjects}
                  title={!hasAllSubjects ? `Bundle unavailable — only ${products.length}/5 subjects available` : ''}
                  style={{
                    background: hasAllSubjects ? 'var(--color-brand-gold)' : 'var(--color-neutral-300)',
                    color: hasAllSubjects ? 'var(--color-brand-blue)' : 'var(--color-neutral-500)',
                    border: 'none', borderRadius: '8px', padding: '11px',
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '0.875rem', cursor: hasAllSubjects ? 'pointer' : 'not-allowed',
                    width: '100%',
                  }}
                >
                  {hasAllSubjects ? 'GET BUNDLE — ₹299' : `Coming Soon (${products.length}/5 subjects)`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutItem && (
        <CheckoutModal
          item={checkoutItem}
          onClose={() => setCheckoutItem(null)}
        />
      )}
    </>
  );
}
