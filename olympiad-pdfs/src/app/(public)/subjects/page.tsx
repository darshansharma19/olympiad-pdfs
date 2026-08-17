import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Browse by Subject — Olympiad Practice Papers | OlympiadPDFs' };
const SUBJECTS = [
  {slug:'mathematics',label:'Mathematics',tagline:'Think. Solve. Excel.',icon:'📐',bg:'#eef1fb'},
  {slug:'science',label:'Science',tagline:'Understand. Apply. Practice.',icon:'🔬',bg:'#ecfdf5'},
  {slug:'english',label:'English',tagline:'Read. Reason. Master.',icon:'📖',bg:'#fff7ed'},
  {slug:'computer_science',label:'Computer Science',tagline:'Think Computationally.',icon:'💻',bg:'#f0f9ff'},
  {slug:'gk',label:'General Knowledge',tagline:'Know More. Learn More.',icon:'🌍',bg:'#fdf4ff'},
  {slug:'reasoning',label:'Reasoning',tagline:'Challenge Your Thinking.',icon:'🧩',bg:'#fff1f2'},
];
export default function SubjectsPage() {
  return (
    <div className="container-site section">
      <h1 className="section-title" style={{marginBottom:'0.5rem'}}>Browse by Subject</h1>
      <p className="section-subtitle" style={{marginBottom:'2.5rem'}}>Olympiad practice papers across 6 subjects for Classes 6–10.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'16px'}}>
        {SUBJECTS.map(s => (
          <Link key={s.slug} href={'/subject/'+s.slug} style={{display:'flex',flexDirection:'column',gap:'12px',background:s.bg,borderRadius:'1rem',padding:'28px 20px',textDecoration:'none',border:'1.5px solid transparent',transition:'all 0.2s'}}>
            <span style={{fontSize:'2.5rem'}}>{s.icon}</span>
            <div>
              <p style={{margin:'0 0 4px',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1rem',color:'var(--color-brand-blue)'}}>{s.label}</p>
              <p style={{margin:0,fontSize:'0.8125rem',color:'var(--color-neutral-500)'}}>{s.tagline}</p>
            </div>
            <span style={{fontSize:'0.8125rem',fontWeight:600,color:'var(--color-brand-blue)',marginTop:'auto'}}>Browse Papers →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
