import React, { useState, useRef, useCallback, useEffect } from 'react';

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
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [readMode, setReadMode] = useState('word'); // 'word' or 'continuous'
 
  const isPlayingRef = useRef(false);
  const speedRef = useRef(speed);
  const voicesRef = useRef([]);
  const selectedVoiceNameRef = useRef('');
  const readModeRef = useRef(readMode);

  // Sync refs with state
  speedRef.current = speed;
  selectedVoiceNameRef.current = selectedVoiceName;
  readModeRef.current = readMode;

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      voicesRef.current = availableVoices;
      
      if (!selectedVoiceNameRef.current && availableVoices.length > 0) {
        const friendly = availableVoices.find(v => 
          v.name.includes('Google') || 
          v.lang.startsWith('en') && v.name.includes('Female')
        ) || availableVoices[0];
        setSelectedVoiceName(friendly.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      speechSynthesis.cancel();
    };
  }, []);

  const story = STORIES.find(s => s.id === storyId);
  const text = useCustom ? customText : (story?.text || '');
  const words = text.trim().split(/\s+/).filter(Boolean);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setPlaying(false);
    isPlayingRef.current = false;
    setWordIdx(-1);
  }, []);

  // Mode 1: Single Word Narration (High Focus)
  const speakWord = useCallback((i) => {
    if (i >= words.length || !isPlayingRef.current) {
      if (i >= words.length) stop();
      return;
    }

    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(words[i]);
    u.rate = speedRef.current;
    
    const voice = voicesRef.current.find(v => v.name === selectedVoiceNameRef.current);
    if (voice) u.voice = voice;
    u.pitch = 1.05; 
    
    u.onend = () => {
      if (isPlayingRef.current) setTimeout(() => speakWord(i + 1), 10);
    };
    u.onstart = () => setWordIdx(i);
    u.onerror = () => { if (isPlayingRef.current) stop(); };
    speechSynthesis.speak(u);
  }, [words, stop]);

  // Mode 2: Continuous Narration (Natural Flow)
  const speakContinuous = useCallback((startIndex) => {
    speechSynthesis.cancel();
    
    // Join remaining words from startIndex
    const remainingText = words.slice(startIndex).join(' ');
    const u = new SpeechSynthesisUtterance(remainingText);
    u.rate = speedRef.current;
    
    const voice = voicesRef.current.find(v => v.name === selectedVoiceNameRef.current);
    if (voice) u.voice = voice;
    u.pitch = 1.05;

    u.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
        // Find which word this character index corresponds to in the full text
        const textToSearch = remainingText.slice(0, charIdx + 1).trim();
        const currentWordIdx = startIndex + (textToSearch ? textToSearch.split(/\s+/).length - 1 : 0);
        setWordIdx(currentWordIdx);
      }
    };

    u.onend = () => {
      if (isPlayingRef.current) stop();
    };

    u.onerror = () => { if (isPlayingRef.current) stop(); };
    speechSynthesis.speak(u);
  }, [words, stop]);

  const toggleRead = () => {
    if (isPlayingRef.current) {
      stop();
    } else {
      setPlaying(true);
      isPlayingRef.current = true;
      addAction('readingWords', `Read "${useCustom ? 'Custom' : story.title}" in ${readMode} mode`);
      const startAt = wordIdx < 0 ? 0 : wordIdx;
      if (readModeRef.current === 'word') {
        speakWord(startAt);
      } else {
        speakContinuous(startAt);
      }
    }
  };

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

      <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Reading Collection 📖</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose a story to practice your reading skills.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {STORIES.map(s => (
            <button key={s.id}
              onClick={() => { setStoryId(s.id); setUseCustom(false); stop(); }}
              className="interactive-btn"
              style={{
                background: !useCustom && storyId === s.id ? 'var(--accent-color)' : 'var(--btn-bg)',
                color: !useCustom && storyId === s.id ? '#0F172A' : 'var(--text-primary)',
                justifyContent: 'flex-start'
              }}>
              {s.title}
            </button>
          ))}
          <button
            onClick={() => { setUseCustom(true); stop(); }}
            className="interactive-btn"
            style={{
              background: useCustom ? 'var(--accent-color)' : 'var(--btn-bg)',
              color: useCustom ? '#0F172A' : 'var(--text-primary)',
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
            style={{ width: '100%', height: '150px', background: 'var(--btn-bg)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '1rem', outline: 'none', fontFamily: 'inherit' }}
          />
        )}

        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 800 }}>Reading Style</h4>
            <div style={{ display: 'flex', background: 'var(--btn-bg)', padding: '4px', borderRadius: '0.75rem', gap: '4px' }}>
              <button 
                onClick={() => { setReadMode('word'); stop(); }}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                  background: readMode === 'word' ? 'var(--accent-color)' : 'transparent',
                  color: readMode === 'word' ? '#0F172A' : 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                Focus Mode
              </button>
              <button 
                onClick={() => { setReadMode('continuous'); stop(); }}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                  background: readMode === 'continuous' ? 'var(--accent-color)' : 'transparent',
                  color: readMode === 'continuous' ? '#0F172A' : 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                Flow Mode
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 800 }}>Narration Voice</h4>
            <select 
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                background: 'var(--btn-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {voices.filter(v => v.lang.startsWith('en')).map(v => (
                <option key={v.name} value={v.name} style={{ background: '#fff', color: '#000' }}>{v.name}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Choose a natural-sounding voice for a better experience.
            </p>
          </div>
        </div>
      </aside>

      <main className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '400px', height: '100%', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: 'var(--panel-bg-solid)', borderRadius: '1rem', padding: '1.5rem', lineHeight: '2.2', fontSize: '1.35rem', overflowY: 'auto', textAlign: 'justify', hyphens: 'auto', color: 'var(--text-primary)' }}>
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
                  background: speed === s ? 'var(--accent-color)' : 'var(--btn-bg)',
                  color: speed === s ? '#0F172A' : 'var(--text-primary)', fontWeight: 700
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
