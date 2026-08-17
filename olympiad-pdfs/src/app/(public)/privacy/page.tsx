import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy | OlympiadPDFs' };
export default function PrivacyPage() {
  return (
    <div className="container-site section" style={{maxWidth:'720px',margin:'0 auto'}}>
      <h1 className="section-title" style={{marginBottom:'2rem'}}>Privacy Policy</h1>
      <div style={{fontSize:'0.9375rem',color:'var(--color-neutral-700)',lineHeight:1.8,display:'flex',flexDirection:'column',gap:'20px'}}>
        <p>OlympiadPDFs collects your name, email address, and mobile number at checkout solely to process your order and deliver your purchased PDF. We do not sell or share your personal information with third parties, except as required to process your payment (Razorpay) or deliver your email (our transactional email provider).</p>
        <p>Payment is processed by Razorpay. OlympiadPDFs does not store your card or payment details.</p>
        <p>We may send you transactional emails related to your purchase. By purchasing, you agree to receive these emails.</p>
        <p>For any privacy-related questions, contact us at support@olympiadpdfs.com.</p>
        <p style={{color:'var(--color-neutral-400)',fontSize:'0.8125rem'}}>Last updated: August 2026.</p>
      </div>
    </div>
  );
}
