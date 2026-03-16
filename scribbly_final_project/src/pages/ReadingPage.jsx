import React, { useState, useRef, useCallback } from 'react';

const STORIES = [
  { id: 0, title: 'The Little Seed 🌱', text: 'A tiny seed fell into the soft brown earth. Rain came and the sun shone bright. Slowly a small green shoot pushed up through the soil. Day by day it grew taller and stronger. One morning a beautiful flower opened wide and smiled at the sky.' },
  { id: 1, title: 'Max the Dog 🐕', text: 'Max was a small dog with a very big heart. One rainy day he found a lost kitten shivering under a bench. The kitten was cold and scared and alone. Max sat close beside it and kept it warm all night long. In the morning the kitten\'s family came running with joy.' },
  { id: 2, title: 'Stars at Night ✨', text: 'Every night the stars come out to play high above us. They twinkle and sparkle in patterns called constellations. Long ago sailors used these star patterns to find their way safely across dark oceans. You can find a big bear and a little bear up in the sky tonight.' },
];

export default function ReadingPage({ addAction }) {
  const [storyId, setStoryId] = useState(0);
  const [wordIdx, setWordIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [useCustom, setUseCustom] = useState(false);
  const [customText, setCustomText] = useState('');

  const story = STORIES.find(s => s.id === storyId);
  const text = useCustom ? customText : (story?.text || '');
  const words = text.trim().split(/\s+/).filter(Boolean);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setPlaying(false);
    setWordIdx(-1);
  }, []);

  const speakWord = (w, i) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w);
    u.rate = speed;
    u.onstart = () => setWordIdx(i);
    u.onend = () => { if (playing) speakWord(words[i + 1], i + 1); };
    speechSynthesis.speak(u);
  };

  const toggleRead = () => {
    if (playing) {
      stop();
    } else {
      setPlaying(true);
      addAction('readingWords', `Read "${useCustom ? 'Custom' : story.title}"`);
      speakWord(words[wordIdx < 0 ? 0 : wordIdx], wordIdx < 0 ? 0 : wordIdx);
    }
  };

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

      <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Library 📖</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose a story to practice your reading skills.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {STORIES.map(s => (
            <button key={s.id}
              onClick={() => { setStoryId(s.id); setUseCustom(false); stop(); }}
              className="interactive-btn"
              style={{
                background: !useCustom && storyId === s.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: !useCustom && storyId === s.id ? '#0F172A' : '#fff',
                justifyContent: 'flex-start'
              }}>
              {s.title}
            </button>
          ))}
          <button
            onClick={() => { setUseCustom(true); stop(); }}
            className="interactive-btn"
            style={{
              background: useCustom ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: useCustom ? '#0F172A' : '#fff',
              justifyContent: 'flex-start'
            }}>
            ✏️ My Own Text
          </button>
        </div>

        {useCustom && (
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your text here..."
            style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', color: '#fff', padding: '1rem', outline: 'none', fontFamily: 'inherit' }}
          />
        )}
      </aside>

      <main className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '400px', height: '100%', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1.5rem', lineHeight: '2.2', fontSize: '1.35rem', overflowY: 'auto', textAlign: 'justify', hyphens: 'auto' }}>
          {words.map((w, i) => (
            <span key={i}
              onClick={() => speakWord(w, i)}
              style={{
                cursor: 'pointer',
                padding: '0 4px',
                borderRadius: '4px',
                transition: 'all 0.1s',
                background: wordIdx === i ? 'var(--accent-color)' : 'transparent',
                color: wordIdx === i ? '#0F172A' : 'inherit',
                fontWeight: wordIdx === i ? 700 : 400,
                marginRight: '6px'
              }}>
              {w}
            </span>
          ))}
          {words.length === 0 && <span style={{ color: 'var(--text-secondary)' }}>Library content will appear here...</span>}
        </div>

        <footer style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
          <button className="interactive-btn" onClick={toggleRead} style={{ background: 'var(--accent-color)', color: '#0F172A', minWidth: '180px' }}>
            {playing ? '⏸ Stop Narration' : '▶️ Listen to Story'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SPEED</span>
            {[0.8, 1, 1.25].map(s => (
              <button key={s}
                onClick={() => setSpeed(s)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: speed === s ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                  color: speed === s ? '#0F172A' : '#fff', fontWeight: 700
                }}>
                {s}x
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)' }}>{wordIdx + 1}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ {words.length} words</span>
          </div>
        </footer>
      </main>

    </div>
  );
}
