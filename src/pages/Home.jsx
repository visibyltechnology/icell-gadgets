import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Footer from '../components/Footer';
import { ProductCard, SkeletonCard } from '../components/ProductCard';

const CATEGORIES = [
    { icon: 'fa-mobile-screen-button', label: 'Smartphones', link: '/products?cat=Smartphones' },
    { icon: 'fa-laptop',               label: 'Laptops',     link: '/products?cat=Laptops' },
    { icon: 'fa-mobile-screen',        label: 'iPhone',      link: '/products?cat=iPhone' },
    { icon: 'fa-tablet-screen-button', label: 'Tablets',     link: '/products?cat=Tablets' },
    { icon: 'fa-plug',                 label: 'Accessories', link: '/products?cat=Accessories' },
    { icon: 'fa-battery-full',         label: 'Power Banks', link: '/products?cat=Power%20Banks' },
];

const TESTIMONIALS = [
    { initials: 'AO', name: 'Adebayo Okafor',  role: 'Lagos, Nigeria',     text: 'Got my iPhone 15 Pro in 4 hours! Same-day delivery was seamless. Icell Gadgets is the absolute best in Lagos.' },
    { initials: 'CM', name: 'Chisom Madu',     role: 'Abuja, Nigeria',     text: 'The monthly payment option made getting a MacBook Pro possible for me. Smooth process start to finish. Highly recommended.' },
    { initials: 'EI', name: 'Emeka Ike',       role: 'Port Harcourt',      text: 'Responded in minutes on WhatsApp. Tracking was perfect. Device exactly as described. Will definitely buy again!' },
];

const WHY_US = [
    { icon: 'fa-credit-card',  title: 'Flexible Payments', desc: 'Spread payments over 3–24 months with Klump. Zero hidden fees.' },
    { icon: 'fa-truck-fast',   title: 'Express Delivery',  desc: 'Same-day dispatch in Lagos. Nationwide door delivery & tracking.' },
    { icon: 'fa-shield-halved',title: 'Official Warranty', desc: '100% authentic devices. Sealed original packaging. Guaranteed.' },
    { icon: 'fa-whatsapp',     title: '24/7 WhatsApp',     desc: 'Always reachable on WhatsApp before and after purchase.', wa: true },
];

export default function Home() {
    const [bestSelling, setBestSelling]       = useState([]);
    const [featLoading, setFeatLoading]       = useState(true);
    const [goodMoodDeals, setGoodMoodDeals]   = useState([]);
    const [goodMoodLoading, setGoodMoodLoading] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSent, setNewsletterSent]   = useState(false);
    const navigate = useNavigate();

    /* ── Fetch best-selling / trending ── */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setFeatLoading(true);
                const qRated = query(collection(db, 'products'), where('averageRating', '>=', 4), limit(4));
                const snapRated = await getDocs(qRated);
                let bSellers = snapRated.docs.map(d => ({ id: d.id, ...d.data() }));

                if (bSellers.length < 4) {
                    const qRecent = query(collection(db, 'products'), limit(4 - bSellers.length));
                    const snapRecent = await getDocs(qRecent);
                    for (let d of snapRecent.docs) {
                        if (!bSellers.find(i => i.id === d.id)) bSellers.push({ id: d.id, ...d.data() });
                    }
                }
                if (bSellers.length > 0) setBestSelling(bSellers.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setFeatLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ── Fetch Good Mood Deals ── */
    useEffect(() => {
        const fetchGMD = async () => {
            try {
                setGoodMoodLoading(true);
                const q = query(collection(db, 'products'), where('folder', '==', 'Good Mood Deals'));
                const snap = await getDocs(q);
                setGoodMoodDeals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch {}
            finally { setGoodMoodLoading(false); }
        };
        fetchGMD();
    }, []);

    const handleNewsletter = (e) => {
        e.preventDefault();
        setNewsletterSent(true);
        setTimeout(() => { setNewsletterSent(false); setNewsletterEmail(''); }, 3500);
    };

    return (
        <div style={{ background: '#FFFFFF' }}>

            {/* ============================================================
                ANNOUNCEMENT TICKER
            ============================================================ */}
            <div className="ticker-bar">
                <div className="ticker-track">
                    {[
                        'Free delivery within Lagos',
                        'Pay later with Klump',
                        'Official warranty on all devices',
                        'WhatsApp support 24/7',
                        'Trusted by 28,000+ customers',
                        'Free delivery within Lagos',
                        'Pay later with Klump',
                        'Official warranty on all devices',
                        'WhatsApp support 24/7',
                        'Trusted by 28,000+ customers',
                        'Free delivery within Lagos',
                        'Pay later with Klump',
                    ].map((item, i) => (
                        <span key={i} className="ticker-item">
                            {item} <span className="ticker-dot" />
                        </span>
                    ))}
                </div>
            </div>

            {/* ============================================================
                HERO
            ============================================================ */}
            <section className="hero">
                <div className="container">
                    <div className="hero-card">
                        <div className="hero-pattern" />
                        <div className="glow-orb glow-orb-1" />
                        <div className="glow-orb glow-orb-2" />

                        <div className="hero-grid">
                            {/* LEFT — text */}
                            <div className="anim-slide-up">
                                <div className="hero-eyebrow">
                                    <span className="dot" />
                                    Nigeria's No.1 Phone Store — 2026
                                </div>

                                <h1 className="hero-title">
                                    Upgrade Your<br />
                                    <span className="accent">Phone.</span>
                                </h1>

                                <p className="hero-sub">
                                    Brand new &amp; UK used iPhones, laptops, tablets and accessories.
                                    Nationwide delivery. Pay later with Klump.
                                </p>

                                <div className="hero-actions">
                                    <Link to="/products" className="btn-primary">
                                        <i className="fa-solid fa-bag-shopping"></i> Shop Now
                                    </Link>
                                    <Link to="/good-mood-deals" className="btn-ghost">
                                        <i className="fa-solid fa-bolt" style={{ color: '#E31E24' }}></i> Hot Deals
                                    </Link>
                                </div>

                                {/* Contact row */}
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                    <a href="tel:08036887788" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        background: 'rgba(26,40,86,0.08)', border: '1px solid rgba(26,40,86,0.2)',
                                        color: '#1A2856', padding: '0.45rem 1rem', borderRadius: 99,
                                        fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                                        letterSpacing: '0.05em', textDecoration: 'none',
                                    }}>
                                        <i className="fa-solid fa-phone" style={{ fontSize: '0.7rem' }}></i> 08036887788
                                    </a>
                                    <a href="https://wa.me/2347035062887" target="_blank" rel="noreferrer" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        background: '#25D366', color: '#fff', padding: '0.45rem 1rem', borderRadius: 99,
                                        fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                                        letterSpacing: '0.05em', textDecoration: 'none',
                                    }}>
                                        <i className="fab fa-whatsapp" style={{ fontSize: '0.85rem' }}></i> +234 703 506 2887
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="hero-stats">
                                    {[
                                        { value: '4,800', sup: '+', label: 'Products Listed' },
                                        { value: '28K',   sup: '+', label: 'Happy Customers' },
                                        { value: '98',    sup: '%', label: '5-Star Reviews' },
                                        { value: '24',    sup: '/7', label: 'WhatsApp Support' },
                                    ].map((s, i) => (
                                        <div key={i}>
                                            <div className="stat-value">{s.value}<sup>{s.sup}</sup></div>
                                            <div className="stat-label">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT — image visual */}
                            <div className="hero-visual">
                                <div className="hero-phone-wrap">
                                    <div className="hero-phone-bg" />
                                    <div className="hero-phone-img">
                                        <img
                                            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=85"
                                            alt="Latest iPhone"
                                            loading="eager"
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                    </div>

                                    {/* Floating chips */}
                                    <div className="float-chip chip-top-left">
                                        <div className="float-chip-icon">
                                            <i className="fa-solid fa-shield-halved"></i>
                                        </div>
                                        <div className="float-chip-text">
                                            <strong>Warranty</strong>
                                            <span>All devices</span>
                                        </div>
                                    </div>

                                    <div className="float-chip chip-bot-right">
                                        <div className="float-chip-icon">
                                            <i className="fa-solid fa-truck-fast"></i>
                                        </div>
                                        <div className="float-chip-text">
                                            <strong>Same Day</strong>
                                            <span>Lagos delivery</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CATEGORY BAR
            ============================================================ */}
            <div className="container">
                <nav className="cat-bar" aria-label="Product categories">
                    {CATEGORIES.map(cat => (
                        <Link key={cat.label} to={cat.link} className="cat-item">
                            <i className={`fa-solid ${cat.icon}`}></i>
                            <span>{cat.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ============================================================
                GOOD MOOD DEALS BANNER
            ============================================================ */}
            {(goodMoodLoading || goodMoodDeals.length > 0) && (
                <div className="container">
                    <div className="deal-banner">
                        <div className="deal-banner-glow" />

                        <div className="deal-banner-top">
                            <div className="deal-meta">
                                <div className="deal-label">
                                    <i className="fa-solid fa-bolt"></i> Flash Deals
                                </div>
                                <h2 className="deal-title">Good Mood Deals</h2>
                                <p className="deal-sub">Exclusive discounts — limited time only</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', zIndex: 1 }}>
                                <DealTimer />
                                <Link to="/good-mood-deals" className="btn-red">
                                    View All <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="deal-products-scroll">
                            {goodMoodLoading
                                ? [1,2,3,4,5].map(i => (
                                    <div key={i} className="deal-product-skeleton" />
                                ))
                                : goodMoodDeals.map((product, idx) => (
                                    <div
                                        key={product.id}
                                        className="deal-product-card"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="deal-product-img">
                                            <img src={product.img || product.images?.[0] || ''} alt={product.name} loading="lazy" />
                                            {(idx === 0 || idx === 1) && (
                                                <div className="deal-product-badge">
                                                    {idx === 0 ? '🔥 Hot' : '⚡ Sale'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="deal-product-info">
                                            <p className="deal-product-name">{product.name}</p>
                                            {product.pss && Number(product.pss) < Number(product.price) && (
                                                <p className="deal-product-old">₦{Number(product.price).toLocaleString()}</p>
                                            )}
                                            <p className="deal-product-price">
                                                ₦{Number(product.pss && Number(product.pss) > 0 ? product.pss : product.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                TRENDING / BEST SELLING
            ============================================================ */}
            <div className="container">
                <div className="section-header">
                    <div className="section-label">
                        <div className="section-bar" />
                        <h2 className="section-title">Trending Now</h2>
                    </div>
                    <Link to="/products" className="section-link">
                        View All <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="products-grid">
                    {featLoading
                        ? [1,2,3,4].map(i => <SkeletonCard key={i} />)
                        : bestSelling.map((product, idx) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                tagLabel={idx === 0 ? 'Hot' : idx === 1 ? 'New' : null}
                                onClick={() => navigate(`/products/${product.id}`)}
                            />
                        ))
                    }
                </div>
            </div>

            {/* ============================================================
                COLLECTIONS (FEATURED)
            ============================================================ */}
            <div className="container">
                <div className="section-header">
                    <div className="section-label">
                        <div className="section-bar" />
                        <h2 className="section-title">Collections</h2>
                    </div>
                    <Link to="/products" className="section-link">
                        Browse All <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="featured-grid">
                    {/* Large Card */}
                    <div className="featured-card" style={{ minHeight: 380 }}>
                        <div className="featured-img">
                            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=75" alt="Premium Tech" loading="lazy" />
                        </div>
                        <div className="featured-overlay" />
                        <div className="featured-content">
                            <div className="featured-tag"><i className="fa-solid fa-fire"></i> Editor's Pick</div>
                            <h3>Ultimate Productivity Bundle</h3>
                            <p>MacBook Pro M3 + iPad Pro + AirPods — built for creators.</p>
                            <Link to="/products" className="btn-red" style={{ fontSize: '0.72rem', padding: '0.6rem 1.25rem' }}>
                                Shop Bundle
                            </Link>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="featured-card" style={{ minHeight: 170 }}>
                            <div className="featured-img">
                                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=75" alt="iPhone" loading="lazy" />
                            </div>
                            <div className="featured-overlay" />
                            <div className="featured-content">
                                <div className="featured-tag"><i className="fa-solid fa-mobile-screen"></i> iPhone</div>
                                <h3 style={{ fontSize: '1.1rem' }}>Premium iPhone</h3>
                                <Link to="/products?cat=iPhone" className="btn-red" style={{ fontSize: '0.65rem', padding: '0.4rem 0.875rem' }}>
                                    Explore <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="featured-card" style={{ minHeight: 170 }}>
                            <div className="featured-img">
                                <img src="https://images.unsplash.com/photo-1592899677974-89c095bc68c3?auto=format&fit=crop&w=600&q=75" alt="Accessories" loading="lazy" />
                            </div>
                            <div className="featured-overlay" style={{ background: 'linear-gradient(to top, rgba(100,30,120,0.85) 0%, rgba(100,30,120,0.1) 60%, transparent 100%)' }} />
                            <div className="featured-content">
                                <div className="featured-tag" style={{ background: '#7C3AED' }}><i className="fa-solid fa-plug"></i> Accessories</div>
                                <h3 style={{ fontSize: '1.1rem' }}>Essential Add-ons</h3>
                                <Link to="/products?cat=Accessories" className="btn-red" style={{ fontSize: '0.65rem', padding: '0.4rem 0.875rem' }}>
                                    Explore <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================
                WHY ICELL GADGETS
            ============================================================ */}
            <div className="container">
                <div className="section-header">
                    <div className="section-label">
                        <div className="section-bar" />
                        <h2 className="section-title">Why Icell Gadgets?</h2>
                    </div>
                </div>

                <div className="props-grid">
                    {WHY_US.map((w, i) => (
                        <div className="prop-card" key={i}>
                            <div className="prop-icon" style={w.wa ? { background: '#25D366', border: 'none' } : {}}>
                                <i className={`${w.wa ? 'fab' : 'fa-solid'} ${w.icon}`} style={w.wa ? { color: '#fff' } : {}}></i>
                            </div>
                            <h3 className="prop-title">{w.title}</h3>
                            <p className="prop-desc">{w.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ============================================================
                TESTIMONIALS
            ============================================================ */}
            <div className="container testimonials-section">
                <div className="section-header">
                    <div className="section-label">
                        <div className="section-bar" />
                        <h2 className="section-title">Customer Reviews</h2>
                    </div>
                    <Link to="/products" className="section-link">
                        All Reviews <i className="fa-solid fa-chevron-right"></i>
                    </Link>
                </div>

                <div className="testi-grid">
                    {TESTIMONIALS.map((t, i) => (
                        <div className="testi-card" key={i}>
                            <div className="testi-quote">"</div>
                            <div className="testi-stars">★★★★★</div>
                            <p className="testi-text">{t.text}</p>
                            <div className="testi-author">
                                <div className="testi-avatar">{t.initials}</div>
                                <div>
                                    <div className="testi-name">{t.name}</div>
                                    <div className="testi-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ============================================================
                NEWSLETTER
            ============================================================ */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-inner">
                        <div>
                            <p className="newsletter-tag">Stay in the Loop</p>
                            <h2 className="newsletter-title">Get Exclusive<br />Deals First.</h2>
                        </div>
                        <form onSubmit={handleNewsletter} className="newsletter-form">
                            <input
                                type="email"
                                required
                                className="newsletter-input"
                                placeholder="your@email.com"
                                value={newsletterEmail}
                                onChange={e => setNewsletterEmail(e.target.value)}
                            />
                            <button type="submit" className="newsletter-submit">
                                {newsletterSent ? '✓ Done!' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

/* Countdown timer for the deals banner */
function DealTimer() {
    const [time, setTime] = useState({ h: 5, m: 47, s: 32 });

    useEffect(() => {
        const id = setInterval(() => {
            setTime(prev => {
                let { h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 23; m = 59; s = 59; }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const pad = n => String(n).padStart(2, '0');

    return (
        <div className="deal-timer">
            {[{ v: time.h, l: 'HRS' }, { v: time.m, l: 'MIN' }, { v: time.s, l: 'SEC' }].map(({ v, l }) => (
                <div className="timer-block" key={l}>
                    <div className="timer-num">{pad(v)}</div>
                    <div className="timer-label">{l}</div>
                </div>
            ))}
        </div>
    );
}
