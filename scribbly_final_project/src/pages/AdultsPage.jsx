import React from 'react';

export default function AdultsPage({ sessionData }) {
  const stats = [
    { label: 'Words Read', value: sessionData.readingWords || 0, icon: '📖', color: '#38BDF8' },
    { label: 'Mood Logs', value: sessionData.moodLogs || 0, icon: '💚', color: '#4ADE80' },
    { label: 'Letters Traced', value: sessionData.lettersTraced || 0, icon: '🧪', color: '#FACC15' },
    { label: 'Writing Sessions', value: sessionData.writingCount || 0, icon: '✏️', color: '#FB7185' },
  ];

  const sessionDuration = Math.round((Date.now() - (sessionData.startTime || Date.now())) / 60000);

  return (
    <div className="page-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        <header className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: 'linear-gradient(135deg, #1E40AF, #0369A1)', color: '#fff' }}>
          <div style={{ fontSize: '3.5rem' }}>👩‍🏫</div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Teacher Dashboard</h2>
            <p style={{ opacity: 0.8 }}>Real-time session analysis and learner engagement insights.</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>ACTIVE SESSION</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{sessionDuration}m</div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: `4px solid ${s.color}` }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{s.icon} {s.label}</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          <section className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Live Activity Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessionData.recentActions.length > 0 ? (
                sessionData.recentActions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)' }} />
                    <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 500 }}>{a.d}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(a.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No activities recorded yet in this session.
                </div>
              )}
            </div>
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ background: 'var(--accent-color)22', border: '1px solid var(--accent-color)44' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent-color)' }}>Evidence Focus</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Based on current activity, the learner is showing strong engagement in <strong>Visual Matching</strong>. This is an excellent exercise for spatial awareness - a core area for dyslexic support.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Support Strategies</h3>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>🎯 <strong>Praise the Process:</strong> Acknowledge the effort in memory games.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>⏳ <strong>Give Space:</strong> Allow extra time for decoding words in the Read tab.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>🎨 <strong>Vibrant Inputs:</strong> Multisensory feedback (color + sound) improves retention.</li>
              </ul>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
