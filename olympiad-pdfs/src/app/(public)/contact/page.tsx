import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Contact Us | OlympiadPDFs' };
export default function ContactPage() {
  return (
    <div className="container-site section" style={{maxWidth:'560px',margin:'0 auto'}}>
      <h1 className="section-title" style={{marginBottom:'0.5rem',textAlign:'center'}}>Contact Us</h1>
      <p className="section-subtitle" style={{textAlign:'center',margin:'0 auto 2.5rem'}}>Have a question? We are here to help.</p>
      <div className="card" style={{padding:'32px'}}>
        <p style={{fontSize:'0.9375rem',color:'var(--color-neutral-700)',marginBottom:'20px',lineHeight:1.7}}>For any support queries, please email us at:</p>
        <a href="mailto:support@olympiadpdfs.com" style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.125rem',color:'var(--color-brand-blue)',textDecoration:'none'}}>support@olympiadpdfs.com</a>
        <p style={{fontSize:'0.875rem',color:'var(--color-neutral-500)',marginTop:'24px',lineHeight:1.6}}>We typically respond within 24 hours on business days. For issues with PDF delivery after payment, please include your Order ID in the email.</p>
      </div>
    </div>
  );
}
