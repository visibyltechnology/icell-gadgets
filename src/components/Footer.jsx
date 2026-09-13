import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const WA = 'https://wa.me/2347035062887?text=Hi%20Icell%20Gadgets%2C%20I%20want%20to%20enquire%20about%20a%20device.';

    const handleSub = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSent(true);
            setTimeout(() => { setSent(false); setEmail(''); }, 4000);
        }
    };

    return (
        <footer style={{ background: '#1A2856', color: '#fff', paddingTop: '4rem', paddingBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
            <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3rem', marginBottom: '1.5rem' }}>

                    {/* Brand & Newsletter */}
                    <div>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className="fa-solid fa-mobile-screen" style={{ color: '#1A2856', fontSize: '1.2rem' }}></i>
                            </div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', margin: 0, color: '#fff', letterSpacing: '0.04em' }}>
                                ICELL <span style={{ color: '#E31E24' }}>GADGETS</span>
                            </h2>
                        </Link>

                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: 300 }}>
                            Nigeria's premier destination for brand new & UK used smartphones, laptops, tablets, and accessories. Delivered nationwide.
                        </p>

                        <form onSubmit={handleSub} style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden', maxWidth: 320, marginBottom: '1.5rem' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email for deals..."
                                required
                                style={{
                                    flex: 1, padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.05)', border: 'none',
                                    color: '#fff', fontSize: '0.85rem', outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 1.25rem', background: sent ? '#10B981' : '#E31E24',
                                    border: 'none', color: '#fff', fontFamily: 'Outfit, sans-serif',
                                    fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.05em'
                                }}
                            >
                                {sent ? '✓ Done' : 'Subscribe'}
                            </button>
                        </form>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[
                                { icon: 'fa-whatsapp', href: WA },
                                { icon: 'fa-instagram', href: '#' },
                                { icon: 'fa-facebook', href: '#' },
                                { icon: 'fa-tiktok', href: '#' },
                            ].map((s, i) => (
                                <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
                                    width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', textDecoration: 'none', transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#E31E24'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <i className={`fab ${s.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Store links */}
                    <div>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.25rem', color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Store</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'All Gadgets', to: '/products' },
                                { label: 'Smartphones', to: '/products?cat=Smartphones' },
                                { label: 'MacBooks & Laptops', to: '/products?cat=Laptops' },
                                { label: 'Premium iPhone', to: '/products?cat=iPhone' },
                                { label: 'Tablets', to: '/products?cat=Tablets' },
                                { label: '⚡ Hot Deals', to: '/good-mood-deals' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <Link to={l.to} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.25rem', color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Support</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'My Account', to: '/profile' },
                                { label: 'Track Delivery', to: '/delivery' },
                                { label: 'Privacy Policy', to: '/privacy' },
                                { label: 'Terms & Conditions', to: '/terms' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <Link to={l.to} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.25rem', color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contact</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#E31E24', fontSize: '1.25rem', marginTop: 4 }}></i>
                            <div>
                                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Warri, Delta State</div>
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: 4 }}>C38 Robinson Pz Deco Road</div>
                            </div>
                        </div>

                        <a href="tel:08036887788" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem', textDecoration: 'none' }}>
                            <i className="fas fa-phone" style={{ color: '#3B82F6', fontSize: '1.25rem', marginTop: 4 }}></i>
                            <div>
                                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>08036887788</div>
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: 4 }}>Call / WhatsApp</div>
                            </div>
                        </a>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1.5rem' }}>
                            {['Smartphones', 'Laptops', 'iPhone', 'Accessories'].map(cat => (
                                <Link key={cat} to={`/products?cat=${encodeURIComponent(cat)}`} style={{
                                    fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)',
                                    background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 99,
                                    textDecoration: 'none', transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#E31E24'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    <p style={{ margin: 0 }}>
                        © {year} <strong style={{ color: '#fff', fontWeight: 600 }}>Icell Gadgets</strong>. All Rights Reserved.
                        <Link to="/privacy" style={{ color: 'inherit', marginLeft: 16, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        >Privacy</Link>
                        <Link to="/terms" style={{ color: 'inherit', marginLeft: 16, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        >Terms</Link>
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Outfit, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <i className="fa-solid fa-shield-halved" style={{ color: '#3B82F6' }}></i> Secured Payment
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Outfit, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <i className="fa-solid fa-truck-fast" style={{ color: '#10B981' }}></i> Nationwide Delivery
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
