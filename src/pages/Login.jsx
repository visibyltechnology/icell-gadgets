import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (user.emailVerified) {
        try { await updateDoc(userDocRef, { isEmailVerified: true }); } catch { }
      }
      if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
        toast.success('Welcome back, Admin!');
        navigate('/admin');
        return;
      }
      toast.success('Signed in successfully!');
      navigate('/shop');
    } catch (err) {
      if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(err.code)) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message?.toLowerCase().includes('offline')) {
        setError('Please check your internet connection.');
      } else {
        setError('Failed to sign in. Please try again later.');
      }
      toast.error('Sign in failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F4F0' }}>
      {/* Split-screen layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', minHeight: 'calc(100vh - 200px)' }}
        className="md:grid-cols-2"
      >
        {/* LEFT — brand panel */}
        <div style={{
          background: '#1A2856',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }} className="hidden md:flex">
          {/* decorative red square */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(227,30,36,0.12)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }}></div>

          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#E31E24' }}></div>

          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none', marginBottom: '3rem', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: '#E31E24', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-mobile-screen" style={{ color: '#fff', fontSize: '1.1rem' }}></i>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  ICELL <span style={{ color: '#E31E24' }}>GADGETS</span>
                </div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 3 }}>
                  Nigeria's Trusted Store
                </div>
              </div>
            </div>
          </Link>

          {/* Big headline */}
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            Welcome<br /><span style={{ color: '#E31E24' }}>Back.</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.75, maxWidth: '22rem', marginBottom: '3rem' }}>
            Sign in to manage your orders, track deliveries, and access exclusive deals.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { num: '28K+', label: 'Customers' },
              { num: '4.8★', label: 'Rating' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{s.num}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex items-center justify-center p-4 sm:p-8 md:p-12 bg-white w-full">
          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* Mobile brand */}
            <div className="md:hidden" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2856', letterSpacing: '-0.03em' }}>
                  ICELL <span style={{ color: '#E31E24' }}>GADGETS</span>
                </div>
              </Link>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.04em', margin: '0 0 0.25rem' }}>
              Sign In
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#E31E24', fontWeight: 700 }}>Create one</Link>
            </p>

            {/* Top accent bar */}
            <div style={{ height: 3, background: '#1A2856', marginBottom: '2rem' }}></div>

            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#B91C1C', fontSize: '0.825rem',
                padding: '0.875rem 1rem', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: 8,
                borderLeft: '3px solid #E31E24',
              }}>
                <i className="fas fa-exclamation-triangle"></i> {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {/* Email */}
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.8rem' }}></i>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#1A2856', fontWeight: 700, }}>
                    Forgot?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.8rem' }}></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '0.85rem' }}>
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%', justifyContent: 'center', padding: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem sm:gap-2rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <i className="fas fa-lock" style={{ color: '#1A2856' }}></i> Secure Login
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <i className="fas fa-shield-alt" style={{ color: '#059669' }}></i> 100% Safe
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
