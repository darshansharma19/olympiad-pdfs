import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Payment Failed | OlympiadPDFs', robots: { index: false } };
export default function PaymentFailedPage() {
  return (
    <div className="container-site section" style={{textAlign:'center',maxWidth:'480px',margin:'0 auto'}}>
      <div style={{fontSize:'4rem',marginBottom:'16px'}}>😔</div>
      <h1 style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.75rem',color:'var(--color-brand-blue)',marginBottom:'12px'}}>Payment Failed</h1>
      <p style={{color:'var(--color-neutral-600)',marginBottom:'28px',lineHeight:1.7}}>Something went wrong with your payment. Please try again or contact us if the issue persists.</p>
      <Link href="/classes" className="btn-primary">Try Again</Link>
    </div>
  );
}
