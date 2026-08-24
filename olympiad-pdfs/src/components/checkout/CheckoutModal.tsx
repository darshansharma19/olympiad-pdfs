'use client';

import { useState, useRef, useEffect } from 'react';
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

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
      const payload: Record<string, any> = {
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
          ondismiss: () => setLoading(false),
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

            // Step 5: Show success
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
      rzp.on('payment.failed', function (resp: any) {
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
    return <SuccessModal data={successData} onClose={onClose} />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: 'clamp(20px, 5vw, 28px)',
          maxWidth: '440px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.25s ease',
          border: '1px solid #e2e8f0',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                color: 'var(--color-brand-blue)',
                margin: 0,
              }}
            >
              Complete Purchase
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: 'var(--color-neutral-400)',
                padding: '6px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '10px',
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ margin: '0 0 2px', fontSize: '0.8125rem', color: 'var(--color-neutral-600)', fontWeight: 600 }}>
              {item.productName}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.375rem',
                  color: 'var(--color-brand-blue)',
                }}
              >
                ₹{(item.amount / 100).toFixed(0)}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', fontWeight: 600 }}>
                (Instant delivery)
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-neutral-700)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Full Name *
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
                padding: '10px 12px',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-neutral-700)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Email Address *{' '}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-neutral-500)' }}>
                (PDFs sent here)
              </span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-neutral-700)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Mobile Number *
            </label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span
                style={{
                  padding: '10px 10px',
                  background: '#f1f5f9',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#334155',
                  whiteSpace: 'nowrap',
                }}
              >
                +91
              </span>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                maxLength={10}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8125rem',
                color: '#991b1b',
                lineHeight: 1.4,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : 'var(--color-brand-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              fontSize: '0.9375rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
              marginTop: '4px',
              boxShadow: '0 4px 12px rgba(26, 58, 143, 0.25)',
              transition: 'all 0.15s',
              minHeight: '46px',
            }}
          >
            {loading ? '⏳ Preparing Gateway...' : `🔒 Pay ₹${(item.amount / 100).toFixed(0)} with UPI / Cards`}
          </button>

          <p
            style={{
              margin: '2px 0 0',
              fontSize: '0.6875rem',
              color: 'var(--color-neutral-500)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            ⚡ UPI (GPay, PhonePe, Paytm, QR) · Cards · Net Banking
          </p>
        </form>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}
