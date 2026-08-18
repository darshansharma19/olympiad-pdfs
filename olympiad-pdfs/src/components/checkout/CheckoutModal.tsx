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

      // Step 3: Open Razorpay Checkout
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
          contact: mobile.trim(),
        },
        theme: { color: '#1a3a8f' },
        modal: {
          ondismiss: () => setLoading(false),
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
        background: 'rgba(15,23,42,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px 28px',
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
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
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              background: 'var(--color-neutral-50)',
              borderRadius: '8px',
              padding: '12px 14px',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            <p style={{ margin: '0 0 2px', fontSize: '0.8125rem', color: 'var(--color-neutral-500)', fontWeight: 600 }}>
              {item.productName}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.375rem',
                color: 'var(--color-brand-blue)',
              }}
            >
              ₹{(item.amount / 100).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-neutral-700)',
                display: 'block',
                marginBottom: '6px',
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
                padding: '11px 14px',
                border: '1.5px solid var(--color-neutral-300)',
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
                marginBottom: '6px',
              }}
            >
              Email Address *{' '}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-neutral-500)' }}>
                (PDFs will be sent here)
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
                padding: '11px 14px',
                border: '1.5px solid var(--color-neutral-300)',
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
                marginBottom: '6px',
              }}
            >
              Mobile Number *
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  padding: '11px 12px',
                  background: 'var(--color-neutral-100)',
                  border: '1.5px solid var(--color-neutral-300)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-neutral-700)',
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
                  padding: '11px 14px',
                  border: '1.5px solid var(--color-neutral-300)',
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
                padding: '12px 14px',
                fontSize: '0.875rem',
                color: '#991b1b',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'var(--color-neutral-400)' : 'var(--color-brand-blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
              marginTop: '4px',
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? '⏳ Processing...' : `🔒 Pay ₹${(item.amount / 100).toFixed(0)} Securely`}
          </button>

          <p
            style={{
              margin: '4px 0 0',
              fontSize: '0.75rem',
              color: 'var(--color-neutral-500)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Secured by Razorpay · UPI, Cards, Net Banking · Instant PDF delivery
          </p>
        </form>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}
