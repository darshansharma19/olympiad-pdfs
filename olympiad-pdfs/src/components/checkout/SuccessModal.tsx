'use client';

import { useState } from 'react';

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

export function SuccessModal({ data, onClose }: SuccessModalProps) {
  const { orderId, productName, amount, customerEmail, downloads } = data;
  const shortId = orderId.slice(0, 8).toUpperCase();

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '36px 28px',
        maxWidth: 480, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
        animation: 'slideUp 0.3s ease',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.5rem', color: 'var(--color-brand-blue)',
          margin: '0 0 8px',
        }}>
          Payment Successful!
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)', margin: '0 0 24px' }}>
          Thank you for purchasing from OlympiadPDFs.
        </p>

        {/* Order Summary */}
        <div style={{
          background: 'var(--color-neutral-50)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '24px',
          border: '1px solid var(--color-neutral-200)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order ID</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-brand-blue)', fontWeight: 700 }}>{shortId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Product</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-800)', fontWeight: 600, textAlign: 'right' }}>{productName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</span>
              <span style={{ fontSize: '1rem', color: 'var(--color-brand-blue)', fontWeight: 800 }}>₹{(amount / 100).toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '0.875rem',
          color: '#065f46',
          lineHeight: 1.6,
        }}>
          📧 Your PDF{downloads.length > 1 ? 's have' : ' has'} been sent to <strong>{customerEmail}</strong>
        </div>

        {/* Download Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {downloads.map((d, i) => (
            <a
              key={i}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                background: 'var(--color-brand-blue)',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}
            >
              ⬇ {downloads.length > 1
                ? d.productName.replace(/Class \d+ | Olympiad Practice Papers/g, '').trim() || 'Download PDF'
                : 'Download Your PDF'}
            </a>
          ))}
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Links are valid for 72 hours. If you face any issues, email us at support@olympiadpdfs.com
        </p>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1.5px solid var(--color-neutral-300)',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '0.875rem',
            color: 'var(--color-neutral-600)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Close
        </button>
      </div>

      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}
