import { useState, useEffect } from 'react';
import WritingPage from './pages/WritingPage';
import ReadingPage from './pages/ReadingPage';
import MemoryPage from './pages/MemoryPage';
import FeelPage from './pages/FeelPage';
import AdultsPage from './pages/AdultsPage';
import TrainingPage from './pages/TrainingPage';
import AboutPage from './pages/SettingsPage';

const TABS = [
  { id: 'write', icon: '✏️', label: 'Write' },
  { id: 'read', icon: '📖', label: 'Read' },
  { id: 'memory', icon: '🧠', label: 'Brain' },
  { id: 'feel', icon: '💚', label: 'Feel' },
  { id: 'adults', icon: '👩‍🏫', label: 'Adults' },
  { id: 'training', icon: '🧪', label: 'Lab' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
];

export default function App() {
  const [tab, setTab] = useState('write');
  const [theme, setTheme] = useState('dark'); // dark, cream, blue
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerY, setRulerY] = useState(0);

  // Session Stats State
  const [sessionData, setSessionData] = useState({
    writingCount: 0,
    readingWords: 0,
    memoryScore: 0,
    moodLogs: 0,
    lettersTraced: 0,
    startTime: Date.now(),
    recentActions: []
  });

  const addAction = (type, desc) => {
    setSessionData(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
      recentActions: [{ t: Date.now(), d: desc }, ...prev.recentActions].slice(0, 10)
    }));
  };

  useEffect(() => {
    document.body.className = '';
    if (theme !== 'dark') document.body.classList.add(`theme-${theme}`);
    if (dyslexicFont) document.body.classList.add('font-dyslexic');
    if (rulerActive) document.body.classList.add('ruler-active');
  }, [theme, dyslexicFont, rulerActive]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rulerActive) setRulerY(e.clientY - 30);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rulerActive]);

  const renderPage = () => {
    const commonProps = { addAction, sessionData };
    switch (tab) {
      case 'write': return <WritingPage {...commonProps} />;
      case 'read': return <ReadingPage {...commonProps} />;
      case 'memory': return <MemoryPage {...commonProps} />;
      case 'feel': return <FeelPage {...commonProps} />;
      case 'adults': return <AdultsPage {...commonProps} />;
      case 'training': return <TrainingPage {...commonProps} />;
      case 'about': return <AboutPage {...commonProps} />;
      default: return <WritingPage {...commonProps} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>

      {/* Reading Ruler Overlay */}
      <div className="reading-ruler" style={{ top: rulerY }} />

      {/* Top nav */}
      <nav style={{
        background: 'linear-gradient(90deg,#0A1A3A,#1D4ED8)',
        display: 'flex', alignItems: 'center', gap: 2,
        padding: '0 20px', height: 60, flexShrink: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 100,
      }}>
        <div style={{ marginRight: 24, paddingRight: 24, borderRight: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Scribbly</div>
          <div style={{ fontSize: 9, color: 'rgba(56,189,248,0.9)', fontWeight: 800, textTransform: 'uppercase' }}>Special Minds</div>
        </div>

        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '0 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 8,
              color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.6)',
              fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
              transition: 'all 0.2s', height: 42,
            }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Accessibility Controls */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 10, gap: 4 }}>
            <button title="Contrast Theme" onClick={() => setTheme(p => p === 'cream' ? 'dark' : 'cream')}
              style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: theme === 'cream' ? '#fff' : 'transparent', cursor: 'pointer', fontSize: 16 }}>🍦</button>
            <button title="Dyslexic Font" onClick={() => setDyslexicFont(!dyslexicFont)}
              style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: dyslexicFont ? '#fff' : 'transparent', cursor: 'pointer', fontSize: 16, fontWeight: 900 }}>Aa</button>
            <button title="Reading Ruler" onClick={() => setRulerActive(!rulerActive)}
              style={{ width: 32, height: 32, borderRadius: 6, border: 'none', background: rulerActive ? '#fff' : 'transparent', cursor: 'pointer', fontSize: 16 }}>📏</button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderPage()}
      </main>
    </div>
  );
}
