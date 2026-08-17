import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms & Conditions | OlympiadPDFs' };
export default function TermsPage() {
  return (
    <div className="container-site section" style={{maxWidth:'720px',margin:'0 auto'}}>
      <h1 className="section-title" style={{marginBottom:'2rem'}}>Terms &amp; Conditions</h1>
      <div style={{fontSize:'0.9375rem',color:'var(--color-neutral-700)',lineHeight:1.8,display:'flex',flexDirection:'column',gap:'20px'}}>
        <p>By purchasing from OlympiadPDFs, you agree to these terms. OlympiadPDFs sells digital PDF products. All sales are final once the PDF has been delivered to your registered email address.</p>
        <p>The practice papers sold by OlympiadPDFs are independently created and are not affiliated with or endorsed by any official Olympiad organisation.</p>
        <p>You may use the purchased PDFs for personal, non-commercial use only. Redistribution, resale, or sharing of purchased PDFs is strictly prohibited.</p>
        <p>OlympiadPDFs reserves the right to modify prices, products, and policies at any time without prior notice.</p>
        <p style={{color:'var(--color-neutral-400)',fontSize:'0.8125rem'}}>Last updated: August 2026.</p>
      </div>
    </div>
  );
}
