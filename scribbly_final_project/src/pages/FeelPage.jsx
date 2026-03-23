import React, { useState, useRef, useEffect } from 'react';

const MOODS = [
  { e: '🌤️', l: 'Brilliant', c: '#38BDF8', b: '#0EA5E9' },
  { e: '🌱', l: 'Growing', c: '#4ADE80', b: '#22C55E' },
  { e: '🌊', l: 'Calm', c: '#818CF8', b: '#6366F1' },
  { e: '☁️', l: 'Quiet', c: '#94A3B8', b: '#64748B' },
  { e: '⛈️', l: 'Stormy', c: '#FB7185', b: '#E11D48' },
  { e: '🌙', l: 'Tired', c: '#A78BFA', b: '#8B5CF6' },
];

export default function FeelPage({ addAction }) {
  const [selectedMood, setMood] = useState(null);
  const [breathing, setBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Ready?');
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (selectedMood && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1E293B';
    }
  }, [selectedMood]);

  const handleDrawStart = (e) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const handleDrawMove = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const startBreathing = () => {
    setBreathing(true);
    let steps = ['Breathe In...', 'Hold...', 'Breathe Out...', 'Relax...'];
    let i = 0;
    const next = () => {
      setBreathText(steps[i]);
      i = (i + 1) % steps.length;
    };
    next();
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  };

  const selectMood = (m) => {
    setMood(m);
    addAction('moodLogs', `Logged feeling: ${m.l} ${m.e}`);
  };

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

      <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Wellness Center 💚</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Check in with yourself and find your center.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {MOODS.map(m => (
            <button key={m.l}
              onClick={() => selectMood(m)}
              className="interactive-btn"
              style={{
                background: selectedMood?.l === m.l ? m.c : 'var(--btn-bg)',
                color: selectedMood?.l === m.l ? '#fff' : 'var(--text-primary)',
                border: `2px solid ${selectedMood?.l === m.l ? m.b : 'transparent'}`,
                justifyContent: 'flex-start',
                padding: '0.75rem 1rem'
              }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>{m.e}</span>
              <span style={{ fontWeight: selectedMood?.l === m.l ? 700 : 500 }}>{m.l}</span>
            </button>
          ))}
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff', marginTop: '1rem', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>Daily Reminder</h3>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.75rem', lineHeight: 1.4 }}>
            "Your unique brain is a gift, not a burden. You see the world in colors others haven't discovered yet."
          </p>
        </div>
      </aside>

      <main className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '500px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🫁 Calm Zone</h3>
          <div style={{
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-color), #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px var(--accent-glow)',
            animation: breathing ? 'pulse 3s infinite ease-in-out' : 'none'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>{breathing ? breathText : 'Start'}</span>
          </div>
          {!breathing ? (
            <button className="interactive-btn" onClick={startBreathing} style={{ background: 'var(--accent-color)', color: '#0F172A', padding: '0.75rem 2rem' }}>
              Begin 4-4-4 Breathing
            </button>
          ) : (
            <button className="interactive-btn" onClick={() => { setBreathing(false); setBreathText('Relaxed'); }} style={{ background: 'var(--btn-bg)', color: 'var(--text-primary)' }}>
              Finish
            </button>
          )}
        </div>

        {selectedMood && (
          <div className="fade-up" style={{ width: '100%', marginTop: '1rem', padding: '1.5rem', borderRadius: '1rem', background: 'var(--btn-bg)', border: `1px dashed ${selectedMood.c}` }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Draw or scribble how {selectedMood.l} feels:</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={handleDrawStart}
              onMouseMove={handleDrawMove}
              onMouseUp={() => isDrawing.current = false}
              onMouseLeave={() => isDrawing.current = false}
              style={{ background: '#fff', borderRadius: '0.5rem', width: '100%', cursor: 'crosshair', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
            />
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
