import React, { useState, useEffect } from 'react';

export default function MemoryPage({ addAction }) {
  const [activeGame, setActiveGame] = useState(null); // sequence, match, null
  const [gameState, setGameState] = useState('menu'); // menu, playing, feedback
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [lastActionType, setLastActionType] = useState(''); // Correct!, Matched!, etc.

  // Match Game State
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const sequenceColors = [
    { id: 1, c: '#38BDF8' }, { id: 2, c: '#4ADE80' },
    { id: 3, c: '#FACC15' }, { id: 4, c: '#FB7185' }
  ];

  const matchIcons = ['🍎', '🚀', '🌈', '🧩', '🎸', '🍦'];

  // --- Sequence Game Logic ---
  const startSequence = () => {
    const nextSeq = [Math.floor(Math.random() * 4) + 1];
    setSequence(nextSeq);
    setUserSequence([]);
    setScore(0);
    setGameState('playing');
    playSequence(nextSeq);
  };

  const playSequence = async (seq) => {
    setActiveButton(null);
    for (const id of seq) {
      await new Promise(r => setTimeout(r, 600));
      setActiveButton(id);
      await new Promise(r => setTimeout(r, 400));
      setActiveButton(null);
    }
  };

  const handleSequenceInput = (id) => {
    if (gameState !== 'playing' || activeButton !== null) return;
    
    // Check if correct before update
    if (id !== sequence[userSequence.length]) {
      setGameState('feedback');
      addAction('memoryScore', `Scored ${score} in Sequence Game`);
      return;
    }

    // Success!
    const nextUserSeq = [...userSequence, id];
    setUserSequence(nextUserSeq);
    setScore(s => s + 1);

    if (nextUserSeq.length === sequence.length) {
      // Completed round!
      setLastActionType('Sequence Complete! 🌟');
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 800);

      const nextSeq = [...sequence, Math.floor(Math.random() * 4) + 1];
      setSequence(nextSeq);
      setUserSequence([]);
      setTimeout(() => playSequence(nextSeq), 1500); // Increased delay for better focus
    }
  };

  // --- Match Game Logic ---
  const startMatch = () => {
    const deck = [...matchIcons, ...matchIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon }));
    setCards(deck);
    setMatched([]);
    setFlipped([]);
    setScore(0);
    setGameState('playing');
  };

  const handleMatchInput = (id) => {
    if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const [first, second] = nextFlipped;
      if (cards[first].icon === cards[second].icon) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setScore(s => s + 5); // More points for a full match
        setLastActionType('Pair Matched! 🎈');
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 800);

        if (matched.length + 2 === cards.length) {
          setGameState('feedback');
          addAction('memoryScore', `Cleared Visual Match!`);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

      <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cognitive Training 🧠</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose a focus area to sharpen your skills.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => { setActiveGame('sequence'); setGameState('menu'); }}
            className="interactive-btn"
            style={{
              background: activeGame === 'sequence' ? 'var(--accent-color)' : 'var(--btn-bg)',
              color: activeGame === 'sequence' ? '#0F172A' : 'var(--text-primary)',
              justifyContent: 'flex-start'
            }}>
            🔢 Sequential Memory
          </button>
          <button
            onClick={() => { setActiveGame('match'); setGameState('menu'); }}
            className="interactive-btn"
            style={{
              background: activeGame === 'match' ? 'var(--accent-color)' : 'var(--btn-bg)',
              color: activeGame === 'match' ? '#0F172A' : 'var(--text-primary)',
              justifyContent: 'flex-start'
            }}>
            🧩 Visual Matching
          </button>
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '0.5rem' }}>SESSION BEST</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{score}</div>
        </div>
      </aside>

      <section className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '500px', justifyContent: 'center' }}>
        {gameState === 'menu' && !activeGame && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧠</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Select a Game</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Choose a focus area from the sidebar to sharpen your skills.
            </p>
          </div>
        )}

        {gameState === 'menu' && activeGame && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{activeGame === 'sequence' ? '🔢' : '🧩'}</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{activeGame === 'sequence' ? 'Color Sequence' : 'Visual Match'}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {activeGame === 'sequence' ? 'Watch the sequence and repeat it.' : 'Find all the hidden pairs in the grid.'}
            </p>
            <button className="interactive-btn"
              onClick={activeGame === 'sequence' ? startSequence : startMatch}
              style={{ background: 'var(--accent-color)', color: '#0F172A', padding: '1rem 3.5rem', margin: '0 auto' }}>
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && activeGame === 'sequence' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {sequenceColors.map(col => (
              <button key={col.id} onClick={() => handleSequenceInput(col.id)}
                style={{
                  width: '140px', height: '140px', borderRadius: '2rem', border: 'none', cursor: 'pointer',
                  background: activeButton === col.id ? col.c : 'var(--btn-bg)',
                  boxShadow: activeButton === col.id ? `0 0 40px ${col.c}88` : 'none',
                  transform: activeButton === col.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.15s',
                  border: `4px solid ${col.c}22`
                }}
              />
            ))}
          </div>
        )}

        {gameState === 'playing' && activeGame === 'match' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {cards.map((card, i) => (
              <button key={i} onClick={() => handleMatchInput(i)}
                style={{
                  width: '90px', height: '90px', borderRadius: '1rem', border: 'none', cursor: 'pointer',
                  fontSize: '2rem', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  background: matched.includes(i) || flipped.includes(i) ? 'var(--accent-color)' : 'var(--btn-bg)',
                  transform: matched.includes(i) || flipped.includes(i) ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  opacity: matched.includes(i) ? 0.5 : 1
                }}>
                {(matched.includes(i) || flipped.includes(i)) ? card.icon : '❓'}
              </button>
            ))}
          </div>
        )}

        {gameState === 'feedback' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Finished!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You performed brilliantly. Keep training to be even better!</p>
            <button className="interactive-btn" onClick={() => { setGameState('menu'); setScore(0); }} style={{ background: 'var(--accent-color)', color: '#0F172A', margin: '0 auto' }}>
              Back to Menu
            </button>
          </div>
        )}

        {/* Global Congrats Popup */}
        {showCongrats && (
          <div style={{
            position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 2000, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: 'congrats-float 0.8s ease-out forwards'
          }}>
            <style>{`
              @keyframes congrats-float {
                0% { opacity: 0; transform: translate(-50%, -30%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -70%) scale(0.9); }
              }
            `}</style>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
            <div style={{ 
              fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)', 
              textShadow: '0 4px 10px rgba(0,0,0,0.5)', letterSpacing: '1px'
            }}>
              {lastActionType}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
