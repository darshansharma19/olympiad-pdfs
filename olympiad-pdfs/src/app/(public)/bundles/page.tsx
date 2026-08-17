import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Bundles — Save More with OlympiadPDFs' };
export default function BundlesPage() {
  return (
    <div className="container-site section">
      <h1 className="section-title" style={{marginBottom:'0.5rem'}}>Bundles</h1>
      <p className="section-subtitle" style={{marginBottom:'2.5rem'}}>Get more for less. Bundles offer multiple subjects or classes at a discounted price.</p>
      <div style={{background:'var(--color-neutral-100)',borderRadius:'1rem',padding:'60px',textAlign:'center',color:'var(--color-neutral-500)'}}>Bundle products will appear here once the database is connected.</div>
    </div>
  );
}
