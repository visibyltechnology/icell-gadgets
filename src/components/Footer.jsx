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
        <footer className="site-footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">

                        {/* Brand */}
                        <div>
                            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 2,
                                    background: '#1A2856',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-mobile-screen" style={{ color: '#fff', fontSize: '1rem' }}></i>
                                </div>
                                <h2 className="footer-brand-name">
                                    ICELL <span>GADGETS</span>
                                </h2>
                            </Link>

                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: '22rem', margin: '1.25rem 0 1.5rem' }}>
                                Nigeria's premier destination for brand new & UK used smartphones, laptops, tablets and accessories. Delivered nationwide.
                            </p>

                            {/* Newsletter inline */}
                            <form onSubmit={handleSub} style={{
                                display: 'flex', gap: 0,
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.04)',
                                marginBottom: '1.5rem',
                                width: '100%',
                                maxWidth: 320,
                            }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email for deals..."
                                    required
                                    style={{
                                        flex: 1, padding: '0.7rem 1rem',
                                        background: 'transparent', border: 'none',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.7rem 1rem',
                                        background: sent ? '#059669' : '#E31E24',
                                        border: 'none',
                                        color: '#fff',
                                        fontFamily: 'Syne, sans-serif',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        transition: 'background 0.25s',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {sent ? '✓ Done' : 'Subscribe'}
                                </button>
                            </form>

                            {/* Socials */}
                            <div className="footer-socials">
                                {[
                                    { icon: 'fa-whatsapp', href: WA, fab: true },
                                    { icon: 'fa-instagram', href: '#', fab: true },
                                    { icon: 'fa-facebook', href: '#', fab: true },
                                    { icon: 'fa-tiktok', href: '#', fab: true },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noreferrer" className="footer-social">
                                        <i className={`${s.fab ? 'fab' : 'fas'} ${s.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Store links */}
                        <div>
                            <p className="footer-col-title">Store</p>
                            <ul className="footer-links">
                                {[
                                    { label: 'All Gadgets', to: '/products' },
                                    { label: 'Smartphones', to: '/products?cat=Smartphones' },
                                    { label: 'MacBooks & Laptops', to: '/products?cat=Laptops' },
                                    { label: 'Premium iPhone', to: '/products?cat=iPhone' },
                                    { label: 'Tablets', to: '/products?cat=Tablets' },
                                    { label: '⚡ Hot Deals', to: '/good-mood-deals' },
                                ].map((l, i) => (
                                    <li key={i}><Link to={l.to}>{l.label}</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <p className="footer-col-title">Support</p>
                            <ul className="footer-links">
                                {[
                                    { label: 'My Account', to: '/profile' },
                                    { label: 'Track Delivery', to: '/delivery' },
                                    { label: 'Privacy Policy', to: '/privacy' },
                                    { label: 'Terms & Conditions', to: '/terms' },
                                ].map((l, i) => (
                                    <li key={i}><Link to={l.to}>{l.label}</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <p className="footer-col-title">Contact</p>
                            <div className="footer-contact-item">
                                <div className="footer-contact-icon">
                                    <i className="fas fa-map-marker-alt" style={{ color: '#E31E24' }}></i>
                                </div>
                                <div>
                                    <div className="footer-contact-val">Warri, Delta State</div>
                                    <div className="footer-contact-lbl">C38 Robinson Pz Deco Road</div>
                                </div>
                            </div>
                            <a href="tel:08036887788" className="footer-contact-item" style={{ textDecoration: 'none' }}>
                                <div className="footer-contact-icon">
                                    <i className="fas fa-phone" style={{ color: '#60A5FA' }}></i>
                                </div>
                                <div>
                                    <div className="footer-contact-val">08036887788</div>
                                    <div className="footer-contact-lbl">Call / WhatsApp</div>
                                </div>
                            </a>
                            <a href="tel:07035062887" className="footer-contact-item" style={{ textDecoration: 'none' }}>
                                <div className="footer-contact-icon">
                                    <i className="fas fa-phone" style={{ color: '#60A5FA' }}></i>
                                </div>
                                <div>
                                    <div className="footer-contact-val">+234 703 506 2887</div>
                                    <div className="footer-contact-lbl">WhatsApp</div>
                                </div>
                            </a>

                            {/* Category tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '1rem' }}>
                                {['Smartphones', 'Laptops', 'iPhone', 'Accessories'].map(cat => (
                                    <Link key={cat} to={`/products?cat=${encodeURIComponent(cat)}`} style={{
                                        fontSize: '0.68rem', fontWeight: 600,
                                        color: 'rgba(255,255,255,0.4)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '3px 10px', borderRadius: 2,
                                        transition: 'all 0.2s', textDecoration: 'none',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#E31E24'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>

                            <a href={WA} target="_blank" rel="noreferrer" className="footer-wa-btn">
                                <i className="fab fa-whatsapp" style={{ fontSize: '1rem' }}></i>
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="container">
                <div className="footer-bottom">
                    <p className="footer-copy">
                        © {year} <strong>Icell Gadgets</strong>. All Rights Reserved.
                        <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 12, textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                        >Privacy</Link>
                        <Link to="/terms" style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 12, textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                        >Terms</Link>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'Syne, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <i className="fa-solid fa-shield-halved" style={{ color: '#60A5FA' }}></i>
                            Secured Payment
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'Syne, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <i className="fa-solid fa-truck-fast" style={{ color: '#4ADE80' }}></i>
                            Nationwide Delivery
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
