'use client';

import { useState } from 'react';

interface OlympiadInfo {
  code: string;
  name: string;
  icon: string;
  tagline: string;
  color: string;
  bgGradient: string;
  focusAreas: string[];
  sampleQuestion: {
    title: string;
    question: string;
    options: string[];
    hint: string;
    answer: string;
  };
}

const OLYMPIADS: OlympiadInfo[] = [
  {
    code: 'IMO',
    name: 'International Mathematics Olympiad',
    icon: '📐',
    tagline: 'Master Logic, Algebra & Mathematical Modeling',
    color: '#1e40af',
    bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    focusAreas: ['Logical Reasoning & Puzzles', 'Algebra & Number Systems', 'Geometry & Mensuration', 'Higher Order Thinking (HOTS)'],
    sampleQuestion: {
      title: 'Sample HOTS Challenge (Class 7 IMO Level)',
      question: 'A train 180m long crosses a platform twice its length in 36 seconds. What is the speed of the train in km/h?',
      options: ['A) 45 km/h', 'B) 54 km/h', 'C) 60 km/h', 'D) 72 km/h'],
      hint: 'Total distance = Train length + Platform length = 180m + 360m = 540m. Speed in m/s = 540 / 36 = 15 m/s. Multiply by 18/5 to get km/h.',
      answer: 'Correct: B) 54 km/h (15 × 18/5 = 54 km/h)',
    },
  },
  {
    code: 'ISO',
    name: 'International Science Olympiad',
    icon: '🔬',
    tagline: 'Explore Experimental Concepts & Scientific Thinking',
    color: '#047857',
    bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    focusAreas: ['Applied Physics & Mechanics', 'Chemical Changes & Reactions', 'Cellular & Human Biology', 'Earth, Climate & Space Science'],
    sampleQuestion: {
      title: 'Sample Concept Challenge (Class 8 ISO Level)',
      question: 'Which of the following changes will increase the frequency of an oscillating simple pendulum?',
      options: ['A) Increasing bob mass', 'B) Decreasing pendulum length', 'C) Increasing amplitude', 'D) Moving to higher altitude'],
      hint: 'Time period T = 2π√(L/g). Frequency f = 1/T. Decreasing string length (L) decreases T, which increases frequency f.',
      answer: 'Correct: B) Decreasing pendulum length',
    },
  },
  {
    code: 'IEO',
    name: 'International English Olympiad',
    icon: '📖',
    tagline: 'Sharpen Grammar, Comprehension & Critical Reading',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    focusAreas: ['Advanced Grammar & Syntax', 'Inference-based Comprehension', 'Idioms, Proverbs & Collocations', 'Spoken & Written Expressions'],
    sampleQuestion: {
      title: 'Sample Verbal Challenge (Class 9 IEO Level)',
      question: 'Identify the grammatically correct sentence with proper subjunctive mood usage:',
      options: [
        'A) If he was the captain, he will choose differently.',
        'B) It is imperative that she attend the orientation on time.',
        'C) I wish I was able to attend the seminar.',
        'D) He acts as though he knows everything.',
      ],
      hint: 'Subjunctive mood expresses a demand, wish, or hypothetical condition. "It is imperative that [subject] [base verb]" uses the base form "attend", not "attends".',
      answer: 'Correct: B) It is imperative that she attend the orientation on time.',
    },
  },
  {
    code: 'ICSO',
    name: 'International Computer Science Olympiad',
    icon: '💻',
    tagline: 'Computational Thinking & Algorithmic Problem Solving',
    color: '#0284c7',
    bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    focusAreas: ['Algorithms & Flowcharts', 'Python / Scratch Logic', 'Computer Networks & Security', 'Data Representation & Number Bases'],
    sampleQuestion: {
      title: 'Sample Algorithmic Challenge (Class 8 ICSO Level)',
      question: 'What is the binary 8-bit equivalent of the decimal number 149?',
      options: ['A) 10010101', 'B) 10011001', 'C) 10100101', 'D) 10010111'],
      hint: '149 = 128 + 16 + 4 + 1 = 2^7 + 2^4 + 2^2 + 2^0 -> bits at positions 7, 4, 2, 0 are 1.',
      answer: 'Correct: A) 10010101',
    },
  },
  {
    code: 'IRO',
    name: 'International Reasoning Olympiad',
    icon: '🧩',
    tagline: 'Train Pattern Recognition & Analytical Deduction',
    color: '#c2410c',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    focusAreas: ['Direction & Distance Logic', 'Blood Relations & Coding-Decoding', 'Series, Analogy & Classification', 'Non-Verbal & Spatial Reasoning'],
    sampleQuestion: {
      title: 'Sample Logic Challenge (Class 6 IRO Level)',
      question: 'In a certain code, OLYMPIAD is written as PMYNQKCE. How is PRACTICE written in that code?',
      options: ['A) QSBDUJDF', 'B) QSBDUJEG', 'C) QSBDVJDF', 'D) QRBCUJEG'],
      hint: 'Inspect alternating shift: +1, +1, +1 for vowel/consonant pattern. O->P (+1), L->M (+1), Y->Y (0), M->N (+1), P->Q (+1), I->K (+2), A->C (+2), D->E (+1).',
      answer: 'Correct: B) QSBDUJEG',
    },
  },
];

export function OlympiadShowcase() {
  const [activeCode, setActiveCode] = useState('IMO');
  const [revealedHint, setRevealedHint] = useState<Record<string, boolean>>({});

  const activeOlympiad = OLYMPIADS.find((o) => o.code === activeCode) || OLYMPIADS[0];
  const isHintRevealed = revealedHint[activeOlympiad.code];

  function toggleHint(code: string) {
    setRevealedHint((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  return (
    <section className="section" style={{ background: '#ffffff', padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
      <div className="container-site">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(26, 58, 143, 0.08)',
              color: 'var(--color-brand-blue)',
              padding: '5px 14px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}
          >
            🏆 Olympiad Subjects & Competition Focus
          </div>
          <h2 className="section-title" style={{ margin: '0 0 10px' }}>
            Built for Olympiad Excellence
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Explore the 5 core Olympiad subjects. Test your skills on sample competition-style questions!
          </p>
        </div>

        {/* 5 Olympiad Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '1.75rem',
          }}
        >
          {OLYMPIADS.map((item) => {
            const isActive = item.code === activeCode;
            return (
              <button
                key={item.code}
                onClick={() => setActiveCode(item.code)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? 'var(--color-brand-blue)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#334155',
                  border: isActive ? '2px solid var(--color-brand-blue)' : '2px solid transparent',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 43, 110, 0.2)' : 'none',
                }}
              >
                <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                <span>{item.code}</span>
              </button>
            );
          })}
        </div>

        {/* Active Subject Showcase Card */}
        <div
          style={{
            background: activeOlympiad.bgGradient,
            borderRadius: '18px',
            border: '1.5px solid rgba(15, 43, 110, 0.1)',
            padding: 'clamp(16px, 3.5vw, 32px)',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Details & Syllabus */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.75rem' }}>{activeOlympiad.icon}</span>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.125rem, 3vw, 1.375rem)',
                    color: 'var(--color-brand-blue)',
                  }}
                >
                  {activeOlympiad.name} ({activeOlympiad.code})
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                  {activeOlympiad.tagline}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Key Focus & HOTS Topics Covered:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '6px' }}>
                {activeOlympiad.focusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '8px',
                      padding: '7px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      border: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span style={{ color: activeOlympiad.color, fontWeight: 900 }}>•</span> {area}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <a
                href="#choose-class"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'var(--color-brand-blue)',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  boxShadow: '0 4px 12px rgba(15, 43, 110, 0.25)',
                  width: 'min(100%, 280px)',
                  textAlign: 'center',
                }}
              >
                Get {activeOlympiad.code} Practice Papers →
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Sample Challenge Teaser */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: 'clamp(16px, 3vw, 22px)',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 8px 20px -5px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span
                style={{
                  background: 'rgba(245, 197, 24, 0.2)',
                  color: '#92400e',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}
              >
                ⚡ Interactive Challenge
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
                {activeOlympiad.code} Sample
              </span>
            </div>

            <h4
              style={{
                margin: '0 0 6px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(0.875rem, 2.5vw, 0.9375rem)',
                color: 'var(--color-brand-blue)',
              }}
            >
              {activeOlympiad.sampleQuestion.title}
            </h4>

            <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>
              {activeOlympiad.sampleQuestion.question}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '6px', marginBottom: '12px' }}>
              {activeOlympiad.sampleQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  style={{
                    background: '#f8fafc',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>

            <button
              onClick={() => toggleHint(activeOlympiad.code)}
              style={{
                width: '100%',
                background: isHintRevealed ? '#f1f5f9' : 'rgba(245, 197, 24, 0.15)',
                color: isHintRevealed ? '#334155' : '#92400e',
                border: '1px solid rgba(245, 197, 24, 0.4)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isHintRevealed ? '▲ Hide Hint & Solution' : '💡 Reveal Hint & Solution'}
            </button>

            {isHintRevealed && (
              <div
                style={{
                  marginTop: '10px',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.75rem',
                  color: '#166534',
                  lineHeight: 1.5,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <p style={{ margin: '0 0 4px', fontWeight: 700 }}>{activeOlympiad.sampleQuestion.answer}</p>
                <p style={{ margin: 0, fontSize: '0.6875rem', color: '#15803d' }}>
                  <strong>Approach:</strong> {activeOlympiad.sampleQuestion.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
}
