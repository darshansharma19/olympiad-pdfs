import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Browse by Class — Olympiad Practice Papers' };
export default function ClassesPage() {
  return (
    <div className="container-site section">
      <h1 className="section-title" style={{marginBottom:'1rem'}}>Browse by Class</h1>
      <p className="section-subtitle" style={{marginBottom:'2.5rem'}}>Select your class to find the right Olympiad practice papers.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'20px'}}>
        {[6,7,8,9,10].map(cls => (
          <Link key={cls} href={'/class/'+cls} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fff',borderRadius:'1rem',padding:'40px 20px',boxShadow:'var(--shadow-card)',textDecoration:'none',border:'2px solid transparent',transition:'all 0.2s',gap:'8px'}}>
            <span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'3.5rem',color:'var(--color-brand-blue)',lineHeight:1}}>{cls}</span>
            <span style={{fontSize:'0.875rem',fontWeight:600,color:'var(--color-neutral-500)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Class {cls}</span>
            <span style={{fontSize:'0.8125rem',color:'var(--color-brand-blue)',fontWeight:600,marginTop:'8px'}}>Explore Papers →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
