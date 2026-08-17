import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Refund Policy | OlympiadPDFs' };
export default function RefundPolicyPage() {
  return (
    <div className="container-site section" style={{maxWidth:'720px',margin:'0 auto'}}>
      <h1 className="section-title" style={{marginBottom:'2rem'}}>Refund &amp; Cancellation Policy</h1>
      <div style={{fontSize:'0.9375rem',color:'var(--color-neutral-700)',lineHeight:1.8,display:'flex',flexDirection:'column',gap:'20px'}}>
        <p>OlympiadPDFs sells digital products (PDF files). Due to the nature of digital goods, <strong>we do not offer refunds once the PDF has been delivered</strong> to your registered email address.</p>
        <p>If you have not received your PDF within 30 minutes of a successful payment, please contact us at support@olympiadpdfs.com with your Order ID and we will resolve the issue promptly.</p>
        <p>In the event of a payment failure where your account was debited but no order was created, please contact us and we will process a full refund within 5–7 business days.</p>
        <p style={{color:'var(--color-neutral-400)',fontSize:'0.8125rem'}}>Last updated: August 2026.</p>
      </div>
    </div>
  );
}
