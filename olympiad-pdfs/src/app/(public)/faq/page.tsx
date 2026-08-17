import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'FAQ | OlympiadPDFs' };
const FAQS = [
  {q:'What is OlympiadPDFs?',a:'OlympiadPDFs provides expert-designed Olympiad-style practice and sample papers for Classes 6–10 in PDF format.'},
  {q:'Are these official Olympiad papers?',a:'No. These are independently created practice/sample papers designed for Olympiad preparation. They are not official papers of any Olympiad organisation.'},
  {q:'Which classes are available?',a:'Classes 6, 7, 8, 9, and 10.'},
  {q:'Which subjects are available?',a:'Mathematics, Science, English, Computer Science, General Knowledge, and Reasoning.'},
  {q:'How will I receive my purchase?',a:'Your PDF is delivered digitally to the email address you provide during checkout — automatically, within minutes of payment.'},
  {q:'Can I access the PDF on mobile?',a:'Yes. The PDFs are digital files and can be opened on any smartphone, tablet, or computer.'},
  {q:'Do I need to create an account?',a:'No. You can purchase and receive your PDF without creating an account.'},
  {q:'What payment methods are supported?',a:'Payments are processed securely through Razorpay, which supports UPI, credit/debit cards, net banking, and wallets.'},
  {q:'What is your refund policy?',a:'As these are digital products, refunds are not provided once the PDF has been delivered. Please review our Refund Policy for full details.'},
  {q:'How do I apply a coupon?',a:'Enter your coupon code in the coupon field on the checkout page before completing payment.'},
];
export default function FAQPage() {
  return (
    <div className="container-site section" style={{maxWidth:'720px',margin:'0 auto'}}>
      <h1 className="section-title" style={{marginBottom:'0.5rem',textAlign:'center'}}>Frequently Asked Questions</h1>
      <p className="section-subtitle" style={{textAlign:'center',margin:'0 auto 2.5rem'}}>Everything you need to know about OlympiadPDFs.</p>
      <div>
        {FAQS.map((f,i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question" style={{listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 0',gap:'16px',cursor:'pointer'}}>
              <span style={{fontWeight:600,fontSize:'1rem',color:'var(--color-brand-blue)'}}>{f.q}</span>
              <span style={{flexShrink:0,fontSize:'1.25rem',color:'var(--color-brand-gold)',fontWeight:700}}>+</span>
            </summary>
            <div style={{paddingBottom:'18px',fontSize:'0.9375rem',color:'var(--color-neutral-600)',lineHeight:1.7}}>{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
