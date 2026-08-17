// Header — logo only, no navigation
// Landing page is focused on sales, not site navigation
export function Header() {
  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid var(--color-neutral-200)',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container-site" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Logo / Brand */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--color-brand-blue)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '1.125rem' }}>📚</span>
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.1875rem',
              color: 'var(--color-brand-blue)',
              letterSpacing: '-0.5px',
            }}>
              OlympiadPDFs
            </span>
          </div>
        </a>
      </div>
    </header>
  );
}
