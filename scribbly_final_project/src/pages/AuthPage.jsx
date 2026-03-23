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
      flexDirection: 'row',
      background: '#0F172A',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Left Panel - Image & Branding */}
      <div style={{
        flex: '1.2',
        position: 'relative',
        display: window.innerWidth < 900 ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        color: '#fff',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("/auth-bg.png")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(225deg, rgba(56, 189, 248, 0.4), rgba(15, 23, 42, 0.8))',
          zIndex: 2
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '16px' }}>Scribbly</div>
          <p style={{ fontSize: '20px', fontWeight: '500', opacity: 0.9, lineHeight: 1.6, maxWidth: '400px' }}>
            Empowering every mind to learn, grow, and shine through creative engagement.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#0F172A'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#F8FAFC', marginBottom: '8px' }}>Welcome</h1>
            <p style={{ color: '#94A3B8', fontSize: '16px', fontWeight: '500' }}>
              {isLogin ? 'Login with Email' : 'Join our Community'}
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-10px', left: '16px', background: '#0F172A', padding: '0 4px', fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>Full Name</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '4px 16px', transition: 'all 0.2s' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" style={{ marginRight: '12px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Enter your name"
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '15px', background: 'transparent', color: '#F8FAFC' }}
                  />
                </div>
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-10px', left: '16px', background: '#0F172A', padding: '0 4px', fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>Email Id</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '4px 16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" style={{ marginRight: '12px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="name@example.com"
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '15px', background: 'transparent', color: '#F8FAFC' }}
                />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-10px', left: '16px', background: '#0F172A', padding: '0 4px', fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>Password</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '4px 16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" style={{ marginRight: '12px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••••••"
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '15px', background: 'transparent', color: '#F8FAFC' }}
                />
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button type="button" style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13px', cursor: 'pointer' }}>Forgot your password?</button>
              </div>
            </div>

            <button type="submit" style={{
              background: '#38BDF8', color: '#fff', border: 'none', borderRadius: '12px',
              padding: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
              marginTop: '8px', boxShadow: '0 8px 30px rgba(56, 189, 248, 0.3)',
              transition: 'transform 0.2s'
            }}>
              {isLogin ? 'LOGIN' : 'SIGN UP'}
            </button>
          </form>


          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '15px' }}>
              {isLogin ? "Don't have account? " : "Already have an account? "}
            </span>
            <button onClick={handleToggle} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: '800', cursor: 'pointer', fontSize: '15px' }}>
              {isLogin ? 'Register Now' : 'Login Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
