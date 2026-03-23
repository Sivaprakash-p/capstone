/**
 * WritingPage — Infinity Ink canvas engine + Google Input Tools API
 * Replaced with MyScript setup logic and UI
 */
import { useState, useRef, useEffect, useCallback } from 'react';

const GOOGLE_URL = 'https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8';

export default function WritingPage({ addAction }) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);          // [{x,y,t}[]]
  const currentRef = useRef(null);        // current stroke being drawn
  const timerRef = useRef(null);        // auto-recognise timer
  const isDrawRef = useRef(false);

  const [strokeCount, setStrokeCount] = useState(0);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready for input');

  // ── Canvas setup & resize ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
      redrawAll();
    };
    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => {
      window.removeEventListener('resize', resize);
      ro.disconnect();
    };
  }, []);

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1E293B';
    return ctx;
  };

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1E293B';

    strokesRef.current.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    });
  }, []);

  // ── Pointer helpers ──────────────────────────────────────────────
  const getPos = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0, t: Date.now() };
    const rect = canvasRef.current.getBoundingClientRect();
    const src = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top, t: Date.now() };
  };

  const startDraw = useCallback((e) => {
    if (e.type === 'touchstart') e.preventDefault();
    clearTimeout(timerRef.current);
    const pos = getPos(e);
    currentRef.current = [pos];
    isDrawRef.current = true;
    const ctx = getCtx();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawRef.current) return;
    if (e.type === 'touchmove') e.preventDefault();
    const pos = getPos(e);
    currentRef.current.push(pos);
    const ctx = getCtx();
    if (ctx) {
      const prev = currentRef.current[currentRef.current.length - 2];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }, []);

  const endDraw = useCallback(() => {
    if (!isDrawRef.current) return;
    isDrawRef.current = false;
    strokesRef.current.push(currentRef.current);
    currentRef.current = null;
    setStrokeCount(strokesRef.current.length);
    timerRef.current = setTimeout(() => recognise(), 1200);
  }, []);

  const undo = useCallback(() => {
    clearTimeout(timerRef.current);
    strokesRef.current.pop();
    setStrokeCount(strokesRef.current.length);
    redrawAll();
    if (strokesRef.current.length > 0) {
      timerRef.current = setTimeout(() => recognise(), 1200);
    } else {
      setResult(''); setStatus('Canvas cleared');
    }
  }, [redrawAll]);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    strokesRef.current = [];
    setStrokeCount(0);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setResult(''); setStatus('Canvas cleared');
  }, []);

  const recognise = useCallback(async () => {
    if (strokesRef.current.length === 0) return;
    setLoading(true);
    setStatus('Predicting...');

    const canvas = canvasRef.current;
    const ink = strokesRef.current.map(stroke => [
      stroke.map(p => Math.round(p.x)),
      stroke.map(p => Math.round(p.y)),
      stroke.map(p => p.t)
    ]);

    try {
      const res = await fetch(GOOGLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          options: "enable_pre_space",
          requests: [{
            writing_guide: {
              writing_area_width: canvas.width,
              writing_area_height: canvas.height
            },
            pre_context: "",
            max_num_results: 1,
            max_completions: 0,
            language: "en",
            itc: "en-t-i0-handwrit",
            ink: ink
          }]
        })
      });

      const data = await res.json();
      if (data[0] === 'SUCCESS') {
        const resultText = data[1][0][1][0];
        setResult(resultText);
        setStatus('Predicted successfully');
        addAction('writingCount', `Converted word "${resultText}"`);
      } else {
        setStatus('Recognition failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('Prediction error');
    } finally {
      setLoading(false);
    }
  }, []);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setStatus('Copied to clipboard');
  };

  return (
    <div id="app" style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '1fr 300px', gridTemplateRows: 'auto 1fr auto',
      gap: '1.5rem', padding: '1rem', background: 'var(--bg-color)', color: 'var(--text-primary)'
    }}>
      <header className="card" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800 }}>Writing Workspace</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={undo} className="tool-btn" title="Undo" style={{
            background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)',
            width: 44, height: 44, borderRadius: '0.75rem', border: 'none', cursor: 'pointer'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 14L4 9L9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>
          </button>
          <button onClick={clear} className="tool-btn" title="Clear Canvas" style={{
            background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)',
            width: 44, height: 44, borderRadius: '0.75rem', border: 'none', cursor: 'pointer'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14a0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
          </button>
          <button onClick={recognise} className="interactive-btn" style={{ background: 'var(--accent-color)', color: '#0F172A', height: 44, padding: '0 2rem', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <strong>Convert to Text</strong>
          </button>
        </div>
      </header>

      <main style={{ gridColumn: 1, gridRow: 2, position: 'relative' }}>
        <div className="canvas-container" style={{
          width: '100%', height: '100%', background: 'white', borderRadius: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {loading && (
            <div id="recognition-overlay" style={{
              position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: '1rem', zIndex: 10
            }}>
              <div className="loader"></div>
              <span style={{ color: 'white', fontWeight: 800 }}>Analyzing Strokes...</span>
            </div>
          )}
        </div>
      </main>

      <aside id="result-panel" className="card" style={{ gridRow: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 800 }}>Recognized Text</h3>
          <button onClick={copy} title="Copy" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          </button>
        </div>
        <div id="text-output" style={{ flex: 1, fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif", fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {result || '...'}
        </div>
      </aside>

      <footer style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className={loading ? "predicting-dot" : "status-dot"} />
          <span id="status-message" style={{ fontWeight: 800 }}>{status}</span>
        </div>
        <div className="controls-hint">Auto-converts 1.2s after last stroke</div>
      </footer>
    </div>
  );
}
