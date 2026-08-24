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
    options: { key: string; text: string }[];
    correctKey: string;
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
      options: [
        { key: 'A', text: 'A) 45 km/h' },
        { key: 'B', text: 'B) 54 km/h' },
        { key: 'C', text: 'C) 60 km/h' },
        { key: 'D', text: 'D) 72 km/h' },
      ],
      correctKey: 'B',
      hint: 'Total distance = Train length + Platform length = 180m + 360m = 540m. Speed in m/s = 540 / 36 = 15 m/s. Multiply by 18/5 to get km/h (15 × 18/5 = 54 km/h).',
      answer: 'Correct: B) 54 km/h',
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
      options: [
        { key: 'A', text: 'A) Increasing bob mass' },
        { key: 'B', text: 'B) Decreasing pendulum length' },
        { key: 'C', text: 'C) Increasing amplitude' },
        { key: 'D', text: 'D) Moving to higher altitude' },
      ],
      correctKey: 'B',
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
        { key: 'A', text: 'A) If he was the captain, he will choose differently.' },
        { key: 'B', text: 'B) It is imperative that she attend the orientation.' },
        { key: 'C', text: 'C) I wish I was able to attend the seminar.' },
        { key: 'D', text: 'D) He acts as though he knows everything.' },
      ],
      correctKey: 'B',
      hint: 'Subjunctive mood expresses a demand, wish, or requirement. "It is imperative that [subject] [base verb]" uses the base form "attend", not "attends".',
      answer: 'Correct: B) It is imperative that she attend the orientation.',
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
      options: [
        { key: 'A', text: 'A) 10010101' },
        { key: 'B', text: 'B) 10011001' },
        { key: 'C', text: 'C) 10100101' },
        { key: 'D', text: 'D) 10010111' },
      ],
      correctKey: 'A',
      hint: '149 = 128 + 16 + 4 + 1 = 2^7 + 2^4 + 2^2 + 2^0 -> binary is 10010101.',
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
      options: [
        { key: 'A', text: 'A) QSBDUJDF' },
        { key: 'B', text: 'B) QSBDUJEG' },
        { key: 'C', text: 'C) QSBDVJDF' },
        { key: 'D', text: 'D) QRBCUJEG' },
      ],
      correctKey: 'B',
      hint: 'Inspect alternating shift rule: +1, +1, 0, +1, +1, +2, +2, +1 applied sequentially to PRACTICE gives QSBDUJEG.',
      answer: 'Correct: B) QSBDUJEG',
    },
  },
];

export function OlympiadShowcase() {
  const [activeCode, setActiveCode] = useState('IMO');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedHint, setRevealedHint] = useState<Record<string, boolean>>({});

  const activeOlympiad = OLYMPIADS.find((o) => o.code === activeCode) || OLYMPIADS[0];
  const currentSelectedKey = selectedAnswers[activeOlympiad.code];
  const isHintRevealed = revealedHint[activeOlympiad.code] || !!currentSelectedKey;

  function handleOptionClick(key: string) {
    setSelectedAnswers((prev) => ({ ...prev, [activeOlympiad.code]: key }));
    setRevealedHint((prev) => ({ ...prev, [activeOlympiad.code]: true }));
  }

  function handleResetQuestion() {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[activeOlympiad.code];
      return next;
    });
    setRevealedHint((prev) => ({ ...prev, [activeOlympiad.code]: false }));
  }

  function toggleHint() {
    setRevealedHint((prev) => ({ ...prev, [activeOlympiad.code]: !prev[activeOlympiad.code] }));
  }

  const isCorrect = currentSelectedKey === activeOlympiad.sampleQuestion.correctKey;
  const isAnswered = !!currentSelectedKey;

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
            🏆 Olympiad Subjects & Interactive Challenge
          </div>
          <h2 className="section-title" style={{ margin: '0 0 10px' }}>
            Built for Olympiad Excellence
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Explore the 5 core Olympiad subjects. <strong>Click an option below to test your skills!</strong>
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
            const hasAnsweredThis = !!selectedAnswers[item.code];
            const isThisCorrect = selectedAnswers[item.code] === item.sampleQuestion.correctKey;

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
                {hasAnsweredThis && (
                  <span style={{ fontSize: '0.75rem' }}>
                    {isThisCorrect ? '✅' : '❌'}
                  </span>
                )}
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

          {/* Right Column: Interactive Quiz Challenge Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: 'clamp(16px, 3vw, 22px)',
              border: isAnswered
                ? isCorrect
                  ? '2px solid #22c55e'
                  : '2px solid #ef4444'
                : '1.5px solid #cbd5e1',
              boxShadow: '0 8px 20px -5px rgba(0,0,0,0.05)',
              transition: 'border 0.2s ease',
            }}
          >
            {/* Badge Row */}
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
                ⚡ Interactive Quiz
              </span>

              {isAnswered ? (
                <span
                  style={{
                    background: isCorrect ? '#dcfce7' : '#fee2e2',
                    color: isCorrect ? '#15803d' : '#b91c1c',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect Attempt'}
                </span>
              ) : (
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
                  Click an option to answer 👇
                </span>
              )}
            </div>

            {/* Question Title */}
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

            {/* Question Text */}
            <p style={{ margin: '0 0 14px', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>
              {activeOlympiad.sampleQuestion.question}
            </p>

            {/* Interactive Clickable Option Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px', marginBottom: '12px' }}>
              {activeOlympiad.sampleQuestion.options.map((opt) => {
                const isThisSelected = currentSelectedKey === opt.key;
                const isThisCorrectOption = opt.key === activeOlympiad.sampleQuestion.correctKey;

                let btnBg = '#f8fafc';
                let btnBorder = '1.5px solid #e2e8f0';
                let btnColor = '#334155';

                if (isAnswered) {
                  if (isThisSelected) {
                    if (isCorrect) {
                      btnBg = '#dcfce7';
                      btnBorder = '2px solid #22c55e';
                      btnColor = '#15803d';
                    } else {
                      btnBg = '#fee2e2';
                      btnBorder = '2px solid #ef4444';
                      btnColor = '#b91c1c';
                    }
                  } else if (isThisCorrectOption) {
                    // Highlight correct option when wrong selected
                    btnBg = '#f0fdf4';
                    btnBorder = '2px dashed #22c55e';
                    btnColor = '#15803d';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleOptionClick(opt.key)}
                    style={{
                      background: btnBg,
                      border: btnBorder,
                      color: btnColor,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: isThisSelected ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{opt.text}</span>
                    {isAnswered && isThisSelected && (
                      <span style={{ fontSize: '0.8125rem' }}>{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Bar (Reset / Solution Toggle) */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                onClick={toggleHint}
                style={{
                  flex: 1,
                  background: isHintRevealed ? '#f1f5f9' : 'rgba(245, 197, 24, 0.15)',
                  color: isHintRevealed ? '#334155' : '#92400e',
                  border: '1px solid rgba(245, 197, 24, 0.4)',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isHintRevealed ? '▲ Hide Solution' : '💡 Reveal Solution'}
              </button>

              {isAnswered && (
                <button
                  onClick={handleResetQuestion}
                  style={{
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '7px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🔄 Retry
                </button>
              )}
            </div>

            {/* Hint & Solution Box */}
            {isHintRevealed && (
              <div
                style={{
                  marginTop: '10px',
                  background: isAnswered && isCorrect ? '#f0fdf4' : '#eff6ff',
                  border: isAnswered && isCorrect ? '1px solid #86efac' : '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.75rem',
                  color: isAnswered && isCorrect ? '#166534' : '#1e40af',
                  lineHeight: 1.5,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <p style={{ margin: '0 0 4px', fontWeight: 800 }}>{activeOlympiad.sampleQuestion.answer}</p>
                <p style={{ margin: 0, fontSize: '0.6875rem', color: '#334155' }}>
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
