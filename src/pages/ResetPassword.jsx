import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../firebase';
import { confirmPasswordReset } from 'firebase/auth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!oobCode) {
      toast.error('Invalid or missing password reset code.');
      navigate('/login');
    }
  }, [oobCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      toast.error('Password too short.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Password successfully reset! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error('Reset Password Error:', err);
      let errorMessage = err.message || 'Failed to reset password.';
      if (err.code === 'auth/invalid-action-code') {
        errorMessage = 'The reset link is invalid or has expired.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'The user account has been disabled.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'The user account does not exist.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: '#1A2856', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-mobile-screen" style={{ color: '#fff', fontSize: '1rem' }}></i>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#1A2856', letterSpacing: '0.04em' }}>
                  ICELL<span style={{ color: '#E31E24' }}> GADGETS</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Card */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 60px rgba(26,40,86,0.08)', border: '1px solid var(--border)' }}>
            <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#1A2856', margin: 0, textTransform: 'uppercase' }}>
                Create New Password
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Enter your new secure password below</p>
            </div>

            <div style={{ padding: '2rem 2.5rem' }}>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', fontWeight: 500 }}>
                  <i className="fas fa-exclamation-circle" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* New Password */}
                <div className="form-field">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.9rem' }}></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-field">
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.9rem' }}></i>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Resetting...</>
                  ) : (
                    <><i className="fas fa-check-circle"></i> Reset Password</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
