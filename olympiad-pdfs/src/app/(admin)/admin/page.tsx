'use client';

import { useState, useEffect, useRef } from 'react';
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

const SUBJECT_LABELS: Record<string, { code: string; name: string }> = {
  mathematics: { code: 'IMO', name: 'Mathematics Olympiad' },
  science: { code: 'ISO', name: 'Science Olympiad' },
  english: { code: 'IEO', name: 'English Olympiad' },
  computer_science: { code: 'ICSO', name: 'Computer Science Olympiad' },
  reasoning: { code: 'IRO', name: 'Reasoning Olympiad' },
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadProductId, setActiveUploadProductId] = useState<string | null>(null);

  // Fetch all products
  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
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

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts =
    selectedClass === 'all'
      ? products
      : products.filter((p) => p.class === selectedClass);

  const configuredCount = products.filter((p) => !!p.pdfUrl.trim()).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-body)' }}>
      {/* Hidden File Input for PDF Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {/* Top Header */}
      <header
        style={{
          background: 'var(--color-brand-blue)',
          color: '#fff',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.75rem' }}>📚</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                OlympiadPDFs — Database PDF Manager
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
                Upload & manage PDF practice papers for Classes 6–10
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              PDFs Configured: <strong style={{ color: 'var(--color-brand-gold)' }}>{configuredCount}</strong> / {products.length}
            </div>

            <Link
              href="/"
              target="_blank"
              style={{
                background: 'var(--color-brand-gold)',
                color: 'var(--color-brand-blue)',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.8125rem',
              }}
            >
              View Live Store ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
        {/* Filter Bar */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-neutral-600)' }}>
              Filter by Class:
            </span>
            {(['all', 6, 7, 8, 9, 10] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                style={{
                  background: selectedClass === cls ? 'var(--color-brand-blue)' : 'var(--color-neutral-100)',
                  color: selectedClass === cls ? '#fff' : 'var(--color-neutral-700)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cls === 'all' ? 'All Classes (25)' : `Class ${cls}`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)' }}>
            Showing <strong>{filteredProducts.length}</strong> products
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-neutral-500)' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Loading database products...</p>
          </div>
        ) : (
          /* Products Grid / Table */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredProducts.map((p) => {
              const subjInfo = SUBJECT_LABELS[p.subject] || { code: p.subject.toUpperCase(), name: p.subject };
              const hasPdf = !!p.pdfUrl.trim();
              const isSaving = savingId === p.id;
              const isUploading = uploadingId === p.id;

              return (
                <div
                  key={p.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: hasPdf ? '1px solid var(--color-neutral-200)' : '1.5px solid #fed7aa',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Top Line: Class, Subject, Name, Price & Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: 'var(--color-brand-blue)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '6px',
                        }}
                      >
                        CLASS {p.class}
                      </span>
                      <span
                        style={{
                          background: 'rgba(245,197,24,0.2)',
                          color: '#b45309',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {subjInfo.code}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>
                        {p.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-brand-blue)' }}>
                        ₹{(p.price / 100).toFixed(0)}
                      </span>

                      {hasPdf ? (
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          ✅ PDF Ready
                        </span>
                      ) : (
                        <span
                          style={{
                            background: '#ffedd5',
                            color: '#c2410c',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          ⚠️ Missing PDF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Input & Action Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-neutral-500)', whiteSpace: 'nowrap' }}>
                        PDF URL:
                      </label>
                      <input
                        type="text"
                        value={p.pdfUrl}
                        onChange={(e) => handleFieldChange(p.id, 'pdfUrl', e.target.value)}
                        placeholder="e.g. https://drive.google.com/... or /pdfs/class-6-mathematics.pdf"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid var(--color-neutral-300)',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          outline: 'none',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>

                    {/* Upload PDF File Button */}
                    <button
                      onClick={() => triggerUpload(p.id)}
                      disabled={isUploading}
                      style={{
                        background: '#f1f5f9',
                        color: 'var(--color-neutral-700)',
                        border: '1px solid var(--color-neutral-300)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isUploading ? '⏳ Uploading...' : '📁 Upload PDF File'}
                    </button>

                    {/* Test / View PDF Link */}
                    {hasPdf && (
                      <a
                        href={p.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        👁️ Preview PDF
                      </a>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={() => handleSave(p)}
                      disabled={isSaving}
                      style={{
                        background: 'var(--color-brand-blue)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
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

      {/* Floating Toast Message */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--color-brand-blue)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontSize: '0.875rem',
            fontWeight: 700,
            zIndex: 9999,
            animation: 'slideUp 0.2s ease',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
