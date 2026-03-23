import React, { useState, useRef, useEffect } from 'react';

const CONFUSED_LETTERS = [
  { pair: ['b', 'd'], hint: '"b" has a belly, "d" has a diaper.', sound: 'bee and dee' },
  { pair: ['p', 'q'], hint: '"p" faces right, "q" faces left.', sound: 'pea and cue' },
  { pair: ['m', 'n'], hint: 'Count the humps!', sound: 'mmm and nnn' },
  { pair: ['w', 'v'], hint: 'Sharp vs Round turns.', sound: 'double-you and vee' },
];

export default function TrainingPage({ addAction }) {
  const [selectedPair, setSelectedPair] = useState(CONFUSED_LETTERS[0]);
  const [activeLetter, setActiveLetter] = useState(selectedPair.pair[0]);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (canvasRef.current) {
      initCanvas();
    }
  }, [activeLetter]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 250px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(activeLetter, canvas.width / 2, canvas.height / 2);
  };

  const speak = (txt) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.rate = 0.8;
    speechSynthesis.speak(u);
  };

  const startDraw = (e) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const finishDraw = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      speak(activeLetter);
      addAction('lettersTraced', `Traced letter "${activeLetter}"`);
    }
  };

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

      <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Phonetic Lab 🧪</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Master commonly confused letters with sight and sound.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {CONFUSED_LETTERS.map(p => (
            <button key={p.pair.join('-')}
              onClick={() => { setSelectedPair(p); setActiveLetter(p.pair[0]); }}
              className="interactive-btn"
              style={{
                background: selectedPair.pair.join('-') === p.pair.join('-') ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: selectedPair.pair.join('-') === p.pair.join('-') ? '#0F172A' : '#fff',
                justifyContent: 'flex-start'
              }}>
              {p.pair[0]} vs {p.pair[1]}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1rem', border: '1px solid var(--accent-color)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>MNEMONIC</div>
          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedPair.hint}</p>
        </div>
      </aside>

      <main className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {selectedPair.pair.map(l => (
            <button key={l}
              onClick={() => { setActiveLetter(l); speak(l); }}
              style={{
                width: '64px', height: '64px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                fontSize: '1.75rem', fontWeight: 900,
                background: activeLetter === l ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                color: activeLetter === l ? '#0F172A' : '#fff',
                transition: 'all 0.2s'
              }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', background: '#fff', borderRadius: '1.5rem', border: '2px solid var(--border-color)', minHeight: '400px', flex: 1, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <canvas
            ref={canvasRef}
            width={700}
            height={450}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={finishDraw}
            onMouseLeave={finishDraw}
            style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
          />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', pointerEvents: 'none' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8' }}>TRACE THE GHOST LETTER ABOVE</span>
          </div>
          <button
            onClick={initCanvas}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: 'none', background: '#F1F5F9', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}>
            Reset Canvas
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontWeight: 800 }}>Hearing Awareness</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The sound of <strong>"{activeLetter}"</strong> is played automatically when you finish tracing.</p>
          </div>
          <button className="interactive-btn" onClick={() => speak(activeLetter)} style={{ background: '#0F172A', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 2rem' }}>
            🔉 Listen Again
          </button>
        </div>
      </main>
    </div>
  );
}
