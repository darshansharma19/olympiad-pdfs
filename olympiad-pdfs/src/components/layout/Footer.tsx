import Link from 'next/link';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/classes', label: 'Classes' },
  { href: '/subjects', label: 'Subjects' },
  { href: '/bundles', label: 'Bundles' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

const SUBJECTS = [
  { href: '/subject/mathematics', label: 'Mathematics' },
  { href: '/subject/science', label: 'Science' },
  { href: '/subject/english', label: 'English' },
  { href: '/subject/computer_science', label: 'Computer Science' },
  { href: '/subject/gk', label: 'General Knowledge' },
  { href: '/subject/reasoning', label: 'Reasoning' },
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--color-neutral-900)', color: '#fff', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container-site">

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>

          {/* Brand col */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '7px',
                background: 'var(--color-brand-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 6V14L10 18L17 14V6L10 2Z" fill="#f5c518"/>
                  <path d="M10 6L7 8V12L10 14L13 12V8L10 6Z" fill="var(--color-brand-blue)"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.3px' }}>
                OlympiadPDFs
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)', lineHeight: 1.6, margin: 0 }}>
              Expert Practice. Better Preparation.
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', marginTop: '12px', lineHeight: 1.6 }}>
              Expert-designed Olympiad practice papers for Classes 6–10. Instant digital delivery.
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <a
                href="https://instagram.com/olympiadpdfs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', transition: 'background 0.15s',
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/olympiadpdfs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', transition: 'background 0.15s',
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)', textDecoration: 'none', transition: 'color 0.15s' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Subjects
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SUBJECTS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                Support
              </h3>
              <a href="mailto:support@olympiadpdfs.com" style={{ fontSize: '0.875rem', color: 'var(--color-neutral-400)', textDecoration: 'none' }}>
                support@olympiadpdfs.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', margin: 0 }}>
            © {new Date().getFullYear()} OlympiadPDFs. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', margin: 0 }}>
            Digital products. No physical delivery. Prices inclusive of all taxes.
          </p>
        </div>
      </div>
    </footer>
  );
}
