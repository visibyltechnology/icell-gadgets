import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const [search, setSearch] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [tickerText, setTickerText] = useState('Brand New & UK Used iPhones · Laptops · Accessories · Power Banks — Nationwide Delivery');
    const [scrolled, setScrolled] = useState(false);
    const { user, isAdmin, logout } = useAuthStore();
    const items = useCartStore((s) => s.items);
    const cartCount = items.reduce((t, i) => t + (i.quantity || 1), 0);
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
    }, [searchOpen]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'settings', 'site_settings');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().tickerMessages) {
                    setTickerText(docSnap.data().tickerMessages.join('     ·     '));
                }
            } catch {}
        };
        fetchSettings();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
            setSearch('');
            setSearchOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('Signed out');
        setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;
    const catActive = (cat) => location.search.includes(cat);

    const LEFT_LINKS = [
        { label: 'Phones', to: '/products?cat=Smartphones', active: catActive('Smartphones') },
        { label: 'iPhone', to: '/products?cat=iPhone', active: catActive('iPhone') },
        { label: 'Laptops', to: '/products?cat=Laptops', active: catActive('Laptops') },
    ];

    const RIGHT_LINKS = [
        { label: 'Tablets', to: '/products?cat=Tablets', active: catActive('Tablets') },
        { label: 'Shop All', to: '/products', active: isActive('/products') && !location.search },
    ];

    return (
        <>
            {/* TICKER */}
            <div className="ticker-bar">
                <div className="ticker-track">
                    {[0,1,2].map(i => (
                        <span key={i} className="ticker-item">
                            <span className="ticker-dot"></span>
                            {tickerText}
                            <span className="ticker-dot"></span>
                        </span>
                    ))}
                </div>
            </div>

            {/* MAIN NAV */}
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
                <div className="container nav-inner">

                    {/* LEFT LINKS */}
                    <div className="nav-left-links">
                        {LEFT_LINKS.map(l => (
                            <Link key={l.to} to={l.to} className={`nav-link${l.active ? ' active' : ''}`}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* CENTER BRAND */}
                    <Link to="/" className="nav-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 28, height: 28,
                                background: '#1A2856',
                                borderRadius: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className="fa-solid fa-mobile-screen" style={{ color: '#fff', fontSize: '0.8rem' }}></i>
                            </div>
                            <div className="nav-brand-name">
                                ICELL <span>GADGETS</span>
                            </div>
                        </div>
                        <div className="nav-brand-tag">Nigeria's Trusted Store</div>
                    </Link>

                    {/* RIGHT LINKS */}
                    <div className="nav-left-links">
                        {RIGHT_LINKS.map(l => (
                            <Link key={l.to} to={l.to}
                                className={`nav-link${l.active ? ' active' : ''}`}
                                style={l.red ? { color: '#E31E24' } : undefined}
                            >
                                {l.red && <i className="fa-solid fa-bolt" style={{ fontSize: '0.6rem' }}></i>}
                                {' '}{l.label}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="nav-right-actions">
                        {/* Search toggle */}
                        <button
                            className="nav-action-btn"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Open search"
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>

                        {/* User / Profile */}
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="nav-action-btn" title="Admin" style={{ color: '#E31E24' }}>
                                        <i className="fa-solid fa-cog"></i>
                                    </Link>
                                )}
                                <Link to="/profile" className="nav-action-btn" title="My Profile">
                                    <i className="fa-solid fa-user"></i>
                                </Link>
                                <button onClick={handleLogout} className="nav-action-btn" title="Logout"
                                    style={{ background: 'none', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#E31E24' }}>
                                    <i className="fa-solid fa-sign-out-alt"></i>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="nav-action-btn" title="Sign In">
                                <i className="fa-solid fa-user"></i>
                            </Link>
                        )}

                        <div className="hidden sm:block">
                            <NotificationBell userId={user?.uid} isMobile={false} />
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="nav-action-btn" aria-label="Cart">
                            <i className="fa-solid fa-bag-shopping"></i>
                            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
                        </Link>

                        {/* Shop now pill */}
                        <Link to="/products" className="nav-shop-pill">
                            Shop Now
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            className="nav-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>

                {/* MOBILE DRAWER */}
                {mobileOpen && (
                    <div className="nav-mobile-drawer">
                        {/* Mobile search */}
                        <form onSubmit={handleSearch} style={{
                            display: 'flex', gap: 0, marginBottom: '1.5rem',
                            border: '1.5px solid #E5E7EB', background: '#FAFAFA',
                        }}>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search gadgets..."
                                style={{
                                    flex: 1, padding: '0.75rem 1rem',
                                    border: 'none', background: 'transparent',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                                    color: '#111827', outline: 'none',
                                }}
                            />
                            <button type="submit" style={{
                                background: '#1A2856', color: '#fff',
                                border: 'none', padding: '0 1rem',
                                cursor: 'pointer', fontSize: '0.8rem',
                            }}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </form>

                        {/* Mobile links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid #E5E7EB' }}>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/products', label: 'Shop All' },
                                { to: '/products?cat=Smartphones', label: 'Phones' },
                                { to: '/products?cat=iPhone', label: 'iPhone' },
                                { to: '/products?cat=Laptops', label: 'Laptops' },
                                { to: '/products?cat=Tablets', label: 'Tablets' },
                            ].map(l => (
                                <Link key={l.to} to={l.to} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '1rem 0',
                                    borderBottom: '1px solid #F3F4F6',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    color: l.red ? '#E31E24' : '#111827',
                                    textDecoration: 'none',
                                }}>
                                    {l.label}
                                    <i className="fa-solid fa-chevron-right" style={{ color: '#D1D5DB', fontSize: '0.7rem' }}></i>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile account */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 8 }}>
                            {user ? (
                                <>
                                    <Link to="/profile" style={{ flex: 1, textAlign: 'center', padding: '0.875rem', background: '#1A2856', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
                                        My Profile
                                    </Link>
                                    <button onClick={handleLogout} style={{ padding: '0.875rem 1.25rem', background: 'transparent', border: '1.5px solid #E5E7EB', color: '#E31E24', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" style={{ flex: 1, textAlign: 'center', padding: '0.875rem', background: '#1A2856', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
                                        Sign In
                                    </Link>
                                    <Link to="/register" style={{ flex: 1, textAlign: 'center', padding: '0.875rem', background: 'transparent', border: '1.5px solid #E5E7EB', color: '#1A2856', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* SEARCH OVERLAY */}
            {searchOpen && (
                <div className="search-overlay" onClick={() => setSearchOpen(false)}>
                    <div className="search-box" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSearch}>
                            <div className="search-input-wrap">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search iPhones, laptops, accessories..."
                                    autoComplete="off"
                                />
                                <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '1rem', padding: 4 }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </form>
                        <div style={{ padding: '0.875rem 1.5rem', display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                            {['iPhone 15', 'MacBook Pro', 'Samsung Galaxy', 'Accessories'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => { navigate(`/products?search=${encodeURIComponent(s)}`); setSearchOpen(false); }}
                                    style={{
                                        padding: '0.45rem 0.875rem', fontSize: '0.75rem',
                                        fontFamily: 'Inter, sans-serif', fontWeight: 600,
                                        border: '1.5px solid #E5E7EB', background: '#F9FAFB',
                                        cursor: 'pointer', borderRadius: 2, color: '#374151',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#1A2856'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1A2856'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
