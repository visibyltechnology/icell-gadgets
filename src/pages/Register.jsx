import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Footer from '../components/Footer';
import LegalModal from '../components/LegalModal';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [activeLegal, setActiveLegal] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    if (!agreedToTerms || !agreedToPrivacy) {
      setError('You must read and accept both the Terms of Service and Privacy Policy to continue.');
      toast.error('Please accept all terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      let emailExists = false;
      try {
        const methods = await fetchSignInMethodsForEmail(auth, formData.email);
        if (methods && methods.length > 0) emailExists = true;
      } catch (_) {}

      if (emailExists) {
        setError('This email is already registered. Please login or reset your password.');
        toast.error('This email is already registered. Please log in.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        isAdmin: false,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      });

      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/login`,
          handleCodeInApp: false,
        });
        setSuccessMessage('Account created! Please check your email to verify your account.');
        toast.success('Verification email sent! Check your inbox.');
      } catch (emailErr) {
        console.warn('Verification email failed to send:', emailErr?.code, emailErr?.message);
        setSuccessMessage('Account created! The verification email could not be sent right now. You can request a new one after logging in.');
        toast.success('Account created! Log in and request email verification.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message && err.message.toLowerCase().includes('offline')) {
        setError('Please check your internet connection and try again.');
        toast.error('Check your internet connection.');
      } else {
        let errorMsg = err.message || 'Registration failed. Please try again.';
        if (err.code === 'auth/email-already-in-use') {
          errorMsg = 'This email is already registered. Please go to the Login page to sign in.';
        } else if (err.message && err.message.includes('Firebase:')) {
          errorMsg = err.message.replace(/Firebase:\s*(.*?)\s*\(auth.*\)./, '$1');
        }
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          
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

          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 60px rgba(26,40,86,0.08)', border: '1px solid var(--border)' }}>
            
            {/* Header */}
            <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(227,30,36,0.08)', color: '#E31E24', padding: '4px 12px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
                <i className="fa-solid fa-user-plus" /> New Account
              </div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#1A2856', margin: 0, textTransform: 'uppercase' }}>
                Create Account
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Join ICELL GADGETS today</p>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem 2.5rem' }}>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', fontWeight: 500 }}>
                  <i className="fas fa-exclamation-circle" /> {error}
                </div>
              )}

              {successMessage ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '2.5rem 2rem' }}>
                    <CheckCircle size={56} style={{ color: '#16A34A' }} strokeWidth={2} />
                    <div>
                      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: 8 }}>Account Created!</h3>
                      <p style={{ color: '#15803D', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>{successMessage}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 12 }}>Click the link in the email to activate your account, then log in.</p>
                    </div>
                  </div>
                  <Link to="/login" className="btn-primary" style={{ marginTop: '2rem' }}>
                    Go to Login <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                  </div>

                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+234 800 000 0000" />
                  <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />

                  <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  
                  <div>
                    <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 600, marginTop: 8 }}>
                        <i className="fas fa-times-circle" style={{ marginRight: 4 }} /> Passwords do not match
                      </p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && (
                      <p style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: 600, marginTop: 8 }}>
                        <i className="fas fa-check-circle" style={{ marginRight: 4 }} /> Passwords match
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                    <LegalCheckbox agreed={agreedToTerms} label="Terms of Service" onRead={() => setActiveLegal('terms')} />
                    <LegalCheckbox agreed={agreedToPrivacy} label="Privacy Policy" onRead={() => setActiveLegal('privacy')} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: '100%', justifyContent: 'center', padding: '1rem',
                      marginTop: '1rem',
                    }}
                  >
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Already have an account?{' '}
                      <Link to="/login" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {activeLegal && (
        <LegalModal
          type={activeLegal}
          onClose={() => setActiveLegal(null)}
          onAccept={(type) => {
            if (type === 'terms') setAgreedToTerms(true);
            if (type === 'privacy') setAgreedToPrivacy(true);
          }}
        />
      )}
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input className="auth-input" {...props} />
    </div>
  );
}

function PasswordField({ label, show, onToggle, ...props }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input className="auth-input" type={show ? 'text' : 'password'} minLength="6" required {...props} />
        <button
          type="button" onClick={onToggle}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function LegalCheckbox({ agreed, label, onRead }) {
  return (
    <div
      onClick={() => !agreed && onRead()}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.25rem', borderRadius: 12,
        border: `1px solid ${agreed ? '#BBF7D0' : 'var(--border)'}`,
        background: agreed ? '#F0FDF4' : 'var(--bg-card)',
        cursor: agreed ? 'default' : 'pointer', transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: agreed ? '#22C55E' : '#fff',
        border: agreed ? 'none' : '1px solid var(--border-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
      }}>
        {agreed && <i className="fas fa-check" style={{ fontSize: '0.7rem', color: '#fff' }} />}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.85rem', color: agreed ? '#15803D' : 'var(--text-2)', fontWeight: 600, margin: 0 }}>
          I have read and agree to the{' '}
          <button type="button" onClick={e => { e.stopPropagation(); onRead(); }} style={{ color: 'var(--red)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            {label}
          </button>
        </p>
      </div>
    </div>
  );
}
