import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AccountPage({ 
  sessionData, 
  theme, setTheme, 
  dyslexicFont, setDyslexicFont, 
  rulerActive, setRulerActive 
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Loading account details...
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
      
      <aside className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', height: 'fit-content' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--accent-color), #4F46E5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '4rem', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.2)' 
        }}>
          👤
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your profile</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="interactive-btn"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%', padding: '1rem', marginTop: '1rem' }}
        >
          🚪 Log Out
        </button>
      </aside>

      <main className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <section>
          <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Profile Details</h2>
          </header>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--btn-bg)', borderRadius: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--btn-bg)', borderRadius: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>User ID</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7, fontFamily: 'monospace' }}>{user?.id}</span>
            </div>
          </div>
        </section>

        <section>
          <header style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>App Preferences ⚙️</h2>
          </header>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {/* Theme Toggle */}
            <div style={{ padding: '1.25rem', background: 'var(--btn-bg)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Color Theme</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setTheme('dark')}
                  style={{ 
                    flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', 
                    background: theme === 'dark' ? 'var(--accent-color)' : 'var(--btn-bg)',
                    color: theme === 'dark' ? '#0F172A' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s'
                  }}
                >
                  Dark
                </button>
                <button 
                  onClick={() => setTheme('cream')}
                  style={{ 
                    flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', 
                    background: theme === 'cream' ? 'var(--accent-color)' : 'var(--btn-bg)',
                    color: theme === 'cream' ? '#0F172A' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s'
                  }}
                >
                  Cream
                </button>
              </div>
            </div>

            {/* Dyslexia Font Toggle */}
            <button 
              onClick={() => setDyslexicFont(!dyslexicFont)}
              style={{ 
                padding: '1.25rem', background: dyslexicFont ? 'var(--accent-glow)' : 'var(--btn-bg)', 
                borderRadius: '1rem', border: dyslexicFont ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dyslexic Font</span>
                <span style={{ fontSize: '1.2rem' }}>{dyslexicFont ? '✅' : '⬜'}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Easier to read font for some people.</p>
            </button>

            {/* Reading Ruler Toggle */}
            <button 
              onClick={() => setRulerActive(!rulerActive)}
              style={{ 
                padding: '1.25rem', background: rulerActive ? 'var(--accent-glow)' : 'var(--btn-bg)', 
                borderRadius: '1rem', border: rulerActive ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Reading Ruler</span>
                <span style={{ fontSize: '1.2rem' }}>{rulerActive ? '✅' : '⬜'}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>A focus line that follows your cursor.</p>
            </button>
          </div>
        </section>

        <section>
          <header style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Session Activity 📊</h2>
          </header>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Words Read', value: sessionData.readingWords, icon: '📖' },
              { label: 'Writing Steps', value: sessionData.writingCount, icon: '✏️' },
              { label: 'Brain Score', value: sessionData.memoryScore, icon: '🧠' },
              { label: 'Mood Logs', value: sessionData.moodLogs, icon: '💚' },
              { label: 'Letters Traced', value: sessionData.lettersTraced, icon: '🧪' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
