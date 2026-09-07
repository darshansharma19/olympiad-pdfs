'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SuccessModal } from './SuccessModal';

export interface CheckoutItem {
  type: 'single' | 'pack_2' | 'bundle_5';
  productId?: string;
  productIds?: string[];
  classNumber?: number;
  productName: string;
  amount: number; // display only — server validates
}

interface CheckoutModalProps {
  item: CheckoutItem;
  onClose: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutModal({ item, onClose }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<Parameters<typeof SuccessModal>[0]['data'] | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    // Save original scroll state, lock body
    const prevOverflow = document.body.style.overflow;
    const prevHeight = document.documentElement.style.height;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    return () => {
      // ALWAYS restore on unmount — handles every exit path
      document.body.style.overflow = prevOverflow || '';
      document.documentElement.style.height = prevHeight || '';
    };
  }, []);

  // Explicit close — unlock scroll then fire parent handler
  const handleClose = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.height = '';
    onClose();
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Razorpay order server-side
      const payload: Record<string, unknown> = {
        type: item.type,
        customerName: name.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerMobile: mobile.trim(),
      };

      if (item.type === 'single') {
        payload.productId = item.productId;
      } else if (item.type === 'pack_2') {
        payload.productIds = item.productIds;
      } else if (item.type === 'bundle_5') {
        payload.classNumber = item.classNumber;
      }

      const createRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        setError(createData.error ?? 'Failed to create order. Please try again.');
        setLoading(false);
        return;
      }

      // Step 2: Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setError('Could not load payment gateway. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 3: Open Razorpay Checkout with full UPI & Card support
      const rzpOptions = {
        key: createData.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TQsFu63En5JTU3',
        amount: createData.amount,
        currency: 'INR',
        name: 'OlympiadPDFs',
        description: createData.description,
        order_id: createData.razorpayOrderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: `+91${mobile.trim()}`,
        },
        theme: {
          color: '#1a3a8f',
          backdrop_color: 'rgba(15, 23, 42, 0.7)',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI / QR (Google Pay, PhonePe, Paytm)',
                instruments: [{ method: 'upi' }],
              },
              cards: {
                name: 'Debit / Credit Card',
                instruments: [{ method: 'card' }],
              },
              netbanking: {
                name: 'Net Banking & Wallets',
                instruments: [{ method: 'netbanking' }, { method: 'wallet' }],
              },
            },
            sequence: ['block.upi', 'block.cards', 'block.netbanking'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: () => { setLoading(false); },
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: true,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Step 4: Verify payment server-side
          try {
            const verifyRes = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: createData.orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              setError(
                'Payment received but verification failed. Please contact support@olympiadpdfs.com with your payment ID: ' +
                  response.razorpay_payment_id
              );
              setLoading(false);
              return;
            }

            // Step 5: Unlock scroll BEFORE switching modal so page is scrollable again
            document.body.style.overflow = '';
            document.documentElement.style.height = '';
            setSuccessData({
              orderId: verifyData.orderId,
              productName: item.productName,
              amount: createData.amount,
              customerEmail: verifyData.customerEmail,
              downloads: verifyData.downloads,
            });
          } catch {
            setError('Verification error. Please contact support@olympiadpdfs.com');
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (resp: { error?: { description?: string } }) {
        setError(resp.error?.description || 'Payment was unsuccessful. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (successData) {
    return <SuccessModal data={successData} onClose={handleClose} />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(9,18,45,0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(160deg, #ffffff 0%, #f5f8ff 100%)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(9,18,75,0.22), 0 0 0 1px rgba(99,120,255,0.1)',
          animation: 'checkoutSlideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px 14px', borderBottom: '1px solid #eef0f8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span style={{ fontSize: '1.25rem' }}>🛒</span>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1rem,3vw,1.2rem)', color: '#0f2b6e', letterSpacing: '-0.3px' }}>
              Complete Purchase
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              background: '#f1f4ff',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              fontSize: '1rem',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f1f4ff'; }}
          >
            ✕
          </button>
        </div>

        {/* Product card */}
        <div style={{
          margin: '16px 20px 6px',
          background: 'linear-gradient(135deg, #0f2b6e 0%, #1e4fd8 100%)',
          borderRadius: '14px',
          padding: '14px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '110px', height: '110px',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '50%',
          }} />
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '3px 10px',
            fontSize: '0.6rem',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.08em',
            marginBottom: '8px',
          }}>✨ SECURE CHECKOUT</div>
          <p style={{ margin: '0 0 8px', fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.35 }}>
            {item.productName}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.625rem',
              color: '#f5c518',
              letterSpacing: '-0.5px',
              textShadow: '0 2px 8px rgba(245,197,24,0.3)',
            }}>
              ₹{(item.amount / 100).toFixed(0)}
            </span>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '2px 8px',
            }}>⚡ Instant delivery</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 20px 22px' }}>
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              Full Name <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              style={{
                width: '100%',
                padding: '11px 13px',
                border: '1.5px solid #dde3f0',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                color: '#1e293b',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1e4fd8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,79,216,0.12)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#dde3f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              Email Address <span style={{ color: '#e11d48' }}>*</span>{' '}
              <span style={{ fontWeight: 500, color: '#94a3b8', fontSize: '0.75rem' }}>(PDFs sent here)</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@example.com"
              style={{
                width: '100%',
                padding: '11px 13px',
                border: '1.5px solid #dde3f0',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                color: '#1e293b',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1e4fd8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,79,216,0.12)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#dde3f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Mobile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              Mobile Number <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                padding: '11px 12px',
                background: '#f1f5fd',
                border: '1.5px solid #dde3f0',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#334155',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>🇮🇳 +91</span>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                maxLength={10}
                style={{
                  flex: 1,
                  padding: '11px 13px',
                  border: '1.5px solid #dde3f0',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  color: '#1e293b',
                  background: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#1e4fd8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,79,216,0.12)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#dde3f0'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '10px',
              padding: '10px 13px',
              fontSize: '0.8125rem',
              color: '#9f1239',
              lineHeight: 1.4,
              animation: 'errorShake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)',
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Pay button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? 'linear-gradient(135deg, #475569, #64748b)'
                : 'linear-gradient(135deg, #0f2b6e 0%, #1e4fd8 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '15px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
              marginTop: '2px',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(15,43,110,0.3)',
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              minHeight: '52px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 28px rgba(15,43,110,0.4)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 6px 20px rgba(15,43,110,0.3)';
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2.5px solid rgba(255,255,255,0.35)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'btnSpin 0.7s linear infinite',
                  flexShrink: 0,
                }} />
                Connecting to Payment Gateway...
              </>
            ) : (
              `🔒 Pay ₹${(item.amount / 100).toFixed(0)} — UPI / Cards`
            )}
          </button>

          {/* Trust row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.6875rem',
            color: '#94a3b8',
            fontWeight: 500,
            flexWrap: 'wrap',
            textAlign: 'center',
          }}>
            <span>🔐 256-bit SSL</span>
            <span>·</span>
            <span>⚡ UPI · Cards · Net Banking</span>
            <span>·</span>
            <span>🛡️ Razorpay Secured</span>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes checkoutSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes btnSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes errorShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-5px); }
          40%      { transform: translateX(5px); }
          60%      { transform: translateX(-3px); }
          80%      { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}

