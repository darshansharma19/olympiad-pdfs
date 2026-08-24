'use client';

import { useEffect } from 'react';

interface SuccessData {
  orderId: string;
  productName: string;
  amount: number;
  customerEmail: string;
  downloads: Array<{ productName: string; url: string }>;
}

interface SuccessModalProps {
  data: SuccessData;
  onClose: () => void;
}

function cleanOlympiadName(name: string): string {
  let clean = name.trim();
  clean = clean.replace(/^Class\s+\d+\s+/i, '');
  clean = clean.replace(/\s*Practice\s*Papers.*$/i, '');
  clean = clean.replace(/^International\s+/i, '');
  return clean || name;
}

export function SuccessModal({ data, onClose }: SuccessModalProps) {
  const { orderId, productName, amount, customerEmail, downloads } = data;
  const shortId = orderId.slice(0, 8).toUpperCase();

  // Lock page scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const downloadSectionTitle =
    downloads.length === 5
      ? '📚 Your 5 Practice Papers'
      : downloads.length === 2
      ? '📚 Your 2 Practice Papers'
      : '📄 Your Practice Paper';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '88vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── 1. FIXED HEADER ────────────────────────────────────── */}
        <div
          style={{
            padding: 'clamp(14px, 3.5vw, 18px) clamp(16px, 4vw, 24px)',
            borderBottom: '1px solid var(--color-neutral-100)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.375rem', lineHeight: 1 }}>🎉</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.0625rem, 3vw, 1.25rem)',
                  color: 'var(--color-brand-blue)',
                  margin: 0,
                }}
              >
                Payment Successful!
              </h2>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>
              Thank you for preparing with OlympiadPDFs.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'var(--color-neutral-100)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              color: 'var(--color-neutral-600)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ── 2. SCROLLABLE CONTENT ──────────────────────────────── */}
        <div
          style={{
            padding: 'clamp(14px, 3.5vw, 20px) clamp(16px, 4vw, 24px)',
            overflowY: 'auto',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Order Details Card */}
          <div
            style={{
              background: 'var(--color-neutral-50)',
              borderRadius: '12px',
              padding: '12px 14px',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Order ID
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-brand-blue)', fontWeight: 800, fontFamily: 'monospace' }}>
                  {shortId}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', borderTop: '1px solid var(--color-neutral-200)', paddingTop: '6px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                  Product
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-800)', fontWeight: 600, textAlign: 'right' }}>
                  {productName}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-neutral-200)', paddingTop: '6px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Amount Paid
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-brand-blue)', fontWeight: 900 }}>
                  ₹{(amount / 100).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#166534',
            }}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>📧</span>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              PDF links sent to: <strong style={{ wordBreak: 'break-all' }}>{customerEmail}</strong>
            </div>
          </div>

          {/* PDF Download Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-brand-blue)' }}>
                {downloadSectionTitle}
              </h3>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-400)' }}>
                Valid for 72h
              </span>
            </div>

            {/* List of Compact Download Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {downloads.map((d, i) => {
                const label = cleanOlympiadName(d.productName);
                return (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-download-row"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#fff',
                      border: '1.5px solid var(--color-neutral-200)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      textDecoration: 'none',
                      color: 'var(--color-neutral-800)',
                      minHeight: '44px',
                      transition: 'all 0.15s ease',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>📄</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--color-brand-blue)',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {label}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: 'var(--color-brand-blue)',
                        color: '#fff',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '5px 10px',
                        borderRadius: '6px',
                        flexShrink: 0,
                      }}
                    >
                      <span>↓</span>
                      <span>Download</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 3. FIXED FOOTER ────────────────────────────────────── */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--color-neutral-100)',
            background: 'var(--color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: 'var(--color-brand-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 16px',
              fontSize: '0.875rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Continue Practicing →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .pdf-download-row:hover {
          border-color: var(--color-brand-blue) !important;
          background: var(--color-brand-blue-50) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
