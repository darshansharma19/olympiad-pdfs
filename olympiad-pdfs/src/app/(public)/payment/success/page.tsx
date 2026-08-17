import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Payment Successful | OlympiadPDFs', robots: { index: false } };
export default function PaymentSuccessPage() {
  return (
    <div className="container-site section" style={{textAlign:'center',maxWidth:'480px',margin:'0 auto'}}>
      <div style={{fontSize:'4rem',marginBottom:'16px'}}>🎉</div>
      <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.75rem',color:'var(--color-brand-blue)',marginBottom:'12px'}}>Payment Successful!</h1>
      <p style={{color:'var(--color-neutral-600)',marginBottom:'28px',lineHeight:1.7}}>Thank you for your purchase. Your practice papers have been sent to your email.</p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
