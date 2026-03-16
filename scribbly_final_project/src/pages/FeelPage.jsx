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
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDrawMove = (e) => {
    if (!isDrawing.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
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
    <div className="page-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>How are you feeling right now?</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Choose a mood that matches your energy today.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {MOODS.map(m => (
                <button key={m.l}
                  onClick={() => selectMood(m)}
                  className="interactive-btn"
                  style={{
                    height: '120px',
                    flexDirection: 'column',
                    background: selectedMood?.l === m.l ? m.c : 'rgba(255,255,255,0.05)',
                    color: selectedMood?.l === m.l ? '#fff' : 'var(--text-primary)',
                    border: `2px solid ${selectedMood?.l === m.l ? m.b : 'transparent'}`
                  }}>
                  <span style={{ fontSize: '2.5rem' }}>{m.e}</span>
                  <span style={{ fontSize: '1rem' }}>{m.l}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="fade-up" style={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', border: `1px dashed ${selectedMood.c}` }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Draw or scribble how {selectedMood.l} feels:</h3>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  onMouseDown={handleDrawStart}
                  onMouseMove={handleDrawMove}
                  onMouseUp={() => isDrawing.current = false}
                  style={{ background: '#fff', borderRadius: '0.5rem', width: '100%', cursor: 'crosshair', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                />
              </div>
            )}
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>🫁 Calm Zone</h3>
              <div style={{
                width: '160px', height: '160px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-color), #4F46E5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px var(--accent-glow)',
                animation: breathing ? 'pulse 3s infinite ease-in-out' : 'none'
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{breathing ? breathText : 'Start'}</span>
              </div>
              {!breathing ? (
                <button className="interactive-btn" onClick={startBreathing} style={{ background: 'var(--accent-color)', color: '#0F172A' }}>
                  Begin 4-4-4 Breathing
                </button>
              ) : (
                <button className="interactive-btn" onClick={() => { setBreathing(false); setBreathText('Relaxed'); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  Finish
                </button>
              )}
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#fff' }}>
              <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>Daily Reminder</h3>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1rem', lineHeight: 1.5 }}>
                "Your unique brain is a gift, not a burden. You see the world in colors others haven't discovered yet."
              </p>
            </div>
          </aside>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
