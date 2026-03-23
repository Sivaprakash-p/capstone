import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import WritingPage from './pages/WritingPage';
import ReadingPage from './pages/ReadingPage';
import MemoryPage from './pages/MemoryPage';
import FeelPage from './pages/FeelPage';
import AdultsPage from './pages/AdultsPage';
import TrainingPage from './pages/TrainingPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';

const TABS = [
  { id: 'write', icon: '✏️', label: 'Writing Center' },
  { id: 'read', icon: '📖', label: 'Reading Library' },
  { id: 'memory', icon: '🧠', label: 'Memory Training' },
  { id: 'feel', icon: '💚', label: 'Emotional Wellness' },
  { id: 'adults', icon: '👩‍🏫', label: 'Parent Resources' },
  { id: 'training', icon: '🧪', label: 'Phonetic Lab' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    const accountProps = { 
      ...commonProps, 
      theme, setTheme, 
      dyslexicFont, setDyslexicFont, 
      rulerActive, setRulerActive 
    };
    switch (tab) {
      case 'write': return <WritingPage {...commonProps} />;
      case 'read': return <ReadingPage {...commonProps} />;
      case 'memory': return <MemoryPage {...commonProps} />;
      case 'feel': return <FeelPage {...commonProps} />;
      case 'adults': return <AdultsPage {...commonProps} />;
      case 'training': return <TrainingPage {...commonProps} />;
      case 'account': return <AccountPage {...accountProps} />;
      default: return <WritingPage {...commonProps} />;
    }
  };

  if (isAuthLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--accent-color)', fontSize: '24px', fontWeight: 'bold' }}>Loading Scribbly...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

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
              background: tab === t.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#fff',
              fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
              opacity: tab === t.id ? 1 : 0.7,
              transition: 'all 0.2s', height: 42,
            }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            title="Account"
            onClick={() => setTab('account')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: tab === 'account' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 18, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: tab === 'account' ? '0 0 0 2px var(--accent-color)' : 'none'
            }}
          >
            👤
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderPage()}
      </main>
    </div>
  );
}
