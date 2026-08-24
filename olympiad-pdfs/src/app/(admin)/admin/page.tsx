'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  class: number;
  subject: string;
  price: number;
  pdfUrl: string;
  imageUrl: string;
  isActive: boolean;
}

const SUBJECT_METADATA: Record<string, { code: string; name: string; icon: string; color: string }> = {
  mathematics: { code: 'IMO', name: 'Mathematics Olympiad', icon: '📐', color: '#1e40af' },
  science: { code: 'ISO', name: 'Science Olympiad', icon: '🔬', color: '#047857' },
  english: { code: 'IEO', name: 'English Olympiad', icon: '📖', color: '#7c3aed' },
  computer_science: { code: 'ICSO', name: 'Computer Science Olympiad', icon: '💻', color: '#0284c7' },
  reasoning: { code: 'IRO', name: 'Reasoning Olympiad', icon: '🧩', color: '#c2410c' },
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadProductId, setActiveUploadProductId] = useState<string | null>(null);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/check');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/admin/login');
        } else {
          setAuthChecked(true);
          fetchProducts();
        }
      } catch {
        router.replace('/admin/login');
      }
    }
    checkAuth();
  }, [router]);

  // Fetch all products
  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Handle local state update
  function handleFieldChange(id: string, field: keyof Product, value: any) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  // Save a single product to DB
  async function handleSave(product: Product) {
    setSavingId(product.id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          pdfUrl: product.pdfUrl,
          price: product.price,
          isActive: product.isActive,
          name: product.name,
        }),
      });

      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        showToast(`✅ Saved PDF & details for ${product.name}`);
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    } finally {
      setSavingId(null);
    }
  }

  // Trigger file picker
  function triggerUpload(productId: string) {
    setActiveUploadProductId(productId);
    fileInputRef.current?.click();
  }

  // Handle file upload
  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeUploadProductId) return;

    const prod = products.find((p) => p.id === activeUploadProductId);
    if (!prod) return;

    setUploadingId(activeUploadProductId);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', prod.slug);

    try {
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.status === 401) {
        router.replace('/admin/login');
        return;
      }

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        alert(uploadData.error || 'File upload failed');
        return;
      }

      // Update in state
      handleFieldChange(prod.id, 'pdfUrl', uploadData.pdfUrl);

      // Auto-save to database
      const saveRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prod.id,
          pdfUrl: uploadData.pdfUrl,
        }),
      });

      const saveData = await saveRes.json();
      if (saveData.success) {
        showToast(`📁 Uploaded & saved ${uploadData.fileName} to database!`);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingId(null);
      setActiveUploadProductId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // Log out
  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
        <p style={{ fontWeight: 700 }}>🔒 Verifying administrator credentials...</p>
      </div>
    );
  }

  // Filter products by Class, Subject & Search Query
  const filteredProducts = products.filter((p) => {
    const matchesClass = selectedClass === 'all' || p.class === selectedClass;
    const matchesSubj = selectedSubject === 'all' || p.subject === selectedSubject;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `class ${p.class}`.includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubj && matchesSearch;
  });

  const configuredCount = products.filter((p) => !!p.pdfUrl.trim()).length;
  const missingCount = products.length - configuredCount;

  return (
    <div style={{ minHeight: '100vh', background: '#0b1329', color: '#e2e8f0', fontFamily: 'var(--font-body)' }}>
      {/* Hidden File Input for PDF Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {/* ── 1. TOP NAV / HEADER ───────────────────────────────────── */}
      <header
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1e4fd8 0%, #0f2b6e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 12px rgba(30, 79, 216, 0.3)',
              }}
            >
              📚
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff' }}>
                  OlympiadPDFs Manager
                </h1>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#4ade80',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  ● Active Database
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
                Manage practice paper links and direct PDF uploads
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>View Storefront</span>
              <span>↗</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8125rem',
              }}
            >
              🔒 Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. METRICS DASHBOARD ─────────────────────────────────── */}
      <main style={{ maxWidth: '1280px', margin: '28px auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Card 1: Total */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Total Products
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>
              {products.length}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              5 Classes × 5 Olympiads
            </p>
          </div>

          {/* Card 2: Configured */}
          <div
            style={{
              background: 'rgba(6, 78, 59, 0.3)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase' }}>
              PDFs Configured
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-display)' }}>
              {configuredCount} / {products.length}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#a7f3d0' }}>
              {Math.round((configuredCount / (products.length || 1)) * 100)}% Inventory Ready
            </p>
          </div>

          {/* Card 3: Pending */}
          <div
            style={{
              background: 'rgba(124, 45, 18, 0.25)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#fdba74', textTransform: 'uppercase' }}>
              Pending Uploads
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 900, color: '#fb923c', fontFamily: 'var(--font-display)' }}>
              {missingCount}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#fed7aa' }}>
              Upload or link PDFs below
            </p>
          </div>

          {/* Card 4: Classes */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Olympiad Grades
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-brand-gold)', fontFamily: 'var(--font-display)' }}>
              Classes 6–10
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              IMO, ISO, IEO, ICSO, IRO
            </p>
          </div>
        </div>

        {/* ── 3. FILTER & SEARCH CONTROLS ──────────────────────────── */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Search bar & count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search by class, subject, or title..."
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>
              Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> of {products.length} products
            </span>
          </div>

          {/* Class Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>
              Class:
            </span>
            {(['all', 6, 7, 8, 9, 10] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                style={{
                  background: selectedClass === cls ? '#1e4fd8' : 'rgba(255, 255, 255, 0.06)',
                  color: selectedClass === cls ? '#ffffff' : '#cbd5e1',
                  border: selectedClass === cls ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cls === 'all' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>

          {/* Subject Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>
              Subject:
            </span>
            <button
              onClick={() => setSelectedSubject('all')}
              style={{
                background: selectedSubject === 'all' ? 'var(--color-brand-gold)' : 'rgba(255, 255, 255, 0.06)',
                color: selectedSubject === 'all' ? '#0f172a' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontWeight: 800,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              All Subjects
            </button>
            {Object.entries(SUBJECT_METADATA).map(([slug, meta]) => (
              <button
                key={slug}
                onClick={() => setSelectedSubject(slug)}
                style={{
                  background: selectedSubject === slug ? meta.color : 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{meta.icon}</span>
                <span>{meta.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. PRODUCT LISTING CARDS ────────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Loading database inventory...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredProducts.map((p) => {
              const subjInfo = SUBJECT_METADATA[p.subject] || { code: p.subject.toUpperCase(), name: p.subject, icon: '📄', color: '#3b82f6' };
              const hasPdf = !!p.pdfUrl.trim();
              const isSaving = savingId === p.id;
              const isUploading = uploadingId === p.id;

              return (
                <div
                  key={p.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: hasPdf ? '1px solid rgba(255, 255, 255, 0.12)' : '1.5px solid rgba(249, 115, 22, 0.4)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {/* Top Product Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: '#1e4fd8',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '6px',
                        }}
                      >
                        CLASS {p.class}
                      </span>

                      <span
                        style={{
                          background: subjInfo.color,
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>{subjInfo.icon}</span>
                        <span>{subjInfo.code}</span>
                      </span>

                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                        {p.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Price:</span>
                        <input
                          type="number"
                          value={p.price / 100}
                          onChange={(e) => handleFieldChange(p.id, 'price', Math.round(Number(e.target.value) * 100))}
                          style={{
                            width: '70px',
                            background: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.875rem',
                            textAlign: 'center',
                          }}
                        />
                      </div>

                      {hasPdf ? (
                        <span
                          style={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            color: '#4ade80',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '6px',
                          }}
                        >
                          ✅ Ready
                        </span>
                      ) : (
                        <span
                          style={{
                            background: 'rgba(249, 115, 22, 0.2)',
                            border: '1px solid rgba(249, 115, 22, 0.4)',
                            color: '#fb923c',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '6px',
                          }}
                        >
                          ⚠️ Missing PDF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Input & Action Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        PDF Link:
                      </span>
                      <input
                        type="text"
                        value={p.pdfUrl}
                        onChange={(e) => handleFieldChange(p.id, 'pdfUrl', e.target.value)}
                        placeholder="Paste Google Drive URL, AWS S3 link, or upload PDF file →"
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '9px 14px',
                          color: '#e2e8f0',
                          fontSize: '0.8125rem',
                          fontFamily: 'monospace',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Upload File Button */}
                    <button
                      onClick={() => triggerUpload(p.id)}
                      disabled={isUploading}
                      style={{
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '9px 14px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>📁</span>
                      <span>{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
                    </button>

                    {/* Preview Button */}
                    {hasPdf && (
                      <a
                        href={p.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          color: '#93c5fd',
                          padding: '9px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        👁️ Preview
                      </a>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={() => handleSave(p)}
                      disabled={isSaving}
                      style={{
                        background: 'linear-gradient(135deg, #1e4fd8 0%, #0f2b6e 100%)',
                        color: '#fff',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '9px 18px',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(30, 79, 216, 0.3)',
                      }}
                    >
                      {isSaving ? '⏳ Saving...' : '💾 Save to DB'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#1e4fd8',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            fontSize: '0.875rem',
            fontWeight: 800,
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
