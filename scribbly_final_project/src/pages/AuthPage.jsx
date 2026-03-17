import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.name }
          }
        });
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          setError('User already exists. Please log in.');
          return;
        }
      }
      onAuthSuccess();
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A1A3A 0%, #1D4ED8 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px' }}>Scribbly</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#38BDF8', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
            {isLogin ? 'Log in to continue your learning journey' : 'Sign up to start your learning adventure'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '16px', outline: 'none', transition: 'all 0.3s'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '16px', outline: 'none', transition: 'all 0.3s'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '16px', outline: 'none', transition: 'all 0.3s'
              }}
            />
          </div>

          <button type="submit" className="interactive-btn" style={{
            background: '#38BDF8', color: '#0F172A', width: '100%', justifyContent: 'center',
            padding: '16px', fontSize: '16px', marginTop: '10px', boxShadow: '0 8px 20px -4px rgba(56, 189, 248, 0.4)'
          }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <button onClick={handleToggle} style={{
            background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer',
            fontSize: '15px', transition: 'color 0.2s', padding: '8px'
          }}>
            {isLogin ? (
              <>Don't have an account? <span style={{ color: '#38BDF8', fontWeight: '600' }}>Sign up</span></>
            ) : (
              <>Already have an account? <span style={{ color: '#38BDF8', fontWeight: '600' }}>Log in</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
