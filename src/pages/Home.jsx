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

export default function Home() {
    const [bestSelling, setBestSelling] = useState([]);
    const [featLoading, setFeatLoading] = useState(true);
    const [goodMoodDeals, setGoodMoodDeals] = useState([]);
    const [goodMoodLoading, setGoodMoodLoading] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSent, setNewsletterSent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFeatLoading(true);
                const qRated = query(collection(db, "products"), where("averageRating", ">=", 4), limit(4));
                const snapRated = await getDocs(qRated);
                let bSellers = snapRated.docs.map(d => ({ id: d.id, ...d.data() }));

                if (bSellers.length < 4) {
                    const qRecent = query(collection(db, "products"), limit(4 - bSellers.length));
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
        <div style={{ background: '#FAFAFA' }}>

            {/* ========================================================
                HERO — Full-bleed, asymmetric, editorial
            ======================================================== */}
            <section className="hero-wrap">
                <div className="hero-stripe"></div>
                <div className="hero-circle-deco"></div>
                <div className="hero-circle-deco-2"></div>

                <div className="container">
                    <div className="hero-inner">
                        {/* LEFT TEXT */}
                        <div className="hero-left anim-slide-up">
                            <div className="hero-eyebrow">
                                <div className="hero-eyebrow-line"></div>
                                <span className="hero-eyebrow-text">Nigeria's No.1 Phone Store — 2026</span>
                            </div>

                            {/* Big editorial headline */}
                            <p className="hero-headline-italic">It's time to</p>
                            <h1 className="hero-headline">
                                UPGRADE<br />
                                YOUR <span className="red">PHONE.</span>
                            </h1>

                            <p className="hero-sub">
                                Brand new & UK used iPhones, laptops, tablets and accessories.
                                Nationwide delivery. Pay later with Klump.
                            </p>

                            <div className="hero-cta-row">
                                <Link to="/products" className="btn-primary">
                                    <i className="fa-solid fa-bag-shopping"></i> Shop Now
                                </Link>
                                <Link to="/good-mood-deals" className="btn-outline">
                                    <i className="fa-solid fa-bolt" style={{ color: '#E31E24' }}></i> Hot Deals
                                </Link>
                            </div>

                            {/* Contact numbers — matching the reference image */}
                            <div className="hero-contact-row">
                                <a href="tel:08036887788" className="hero-contact-chip">
                                    <i className="fa-solid fa-phone" style={{ fontSize: '0.75rem' }}></i>
                                    08036887788
                                </a>
                                <a href="https://wa.me/2347035062887" target="_blank" rel="noreferrer" className="hero-contact-chip wa">
                                    <i className="fab fa-whatsapp" style={{ fontSize: '0.9rem' }}></i>
                                    +234 703 506 2887
                                </a>
                            </div>
                        </div>

                        {/* RIGHT — Full-bleed image panel */}
                        <div className="hero-right">
                            <img
                                className="hero-right-img"
                                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85"
                                alt="Latest iPhone"
                                loading="eager"
                            />
                            {/* Floating label on image */}
                            <div className="hero-img-label">
                                <div className="hero-img-label-icon">
                                    <i className="fa-solid fa-shield-halved"></i>
                                </div>
                                <div className="hero-img-label-text">
                                    <strong>Warranty Included</strong>
                                    <span>Manufacturer Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <div className="hero-stats-bar">
                <div className="container">
                    <div className="hero-stats-inner">
                        <div className="hero-stat">
                            <div>
                                <div className="hero-stat-num">4,800<span>+</span></div>
                                <div className="hero-stat-label">Products Listed</div>
                            </div>
                        </div>
                        <div className="hero-stat">
                            <div>
                                <div className="hero-stat-num">28K<span>+</span></div>
                                <div className="hero-stat-label">Happy Customers</div>
                            </div>
                        </div>
                        <div className="hero-stat">
                            <div>
                                <div className="hero-stat-num">98<span>%</span></div>
                                <div className="hero-stat-label">5-Star Reviews</div>
                            </div>
                        </div>
                        <div className="hero-stat">
                            <div>
                                <div className="hero-stat-num">24<span>/7</span></div>
                                <div className="hero-stat-label">WhatsApp Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORY STRIP */}
            <div className="container">
                <div className="cat-strip" role="navigation" aria-label="Product categories">
                    {CATEGORIES.map(cat => (
                        <Link key={cat.label} to={cat.link} className="cat-pill">
                            <i className={`fa-solid ${cat.icon}`}></i>
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ========================================================
                GOOD MOOD DEALS — Full-width dark stripe
            ======================================================== */}
            {(goodMoodLoading || goodMoodDeals.length > 0) && (
                <section className="deal-stripe">
                    <div className="container">
                        <div className="deal-stripe-inner">
                            <div>
                                <div className="deal-stripe-label">
                                    <i className="fa-solid fa-bolt"></i> Flash Deals
                                </div>
                                <Link to="/good-mood-deals" style={{ textDecoration: 'none' }}>
                                    <h2 className="deal-stripe-title">Good Mood Deals</h2>
                                </Link>
                            </div>
                            <Link to="/good-mood-deals" className="deal-view-btn">
                                View All <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="deal-scroll">
                            {goodMoodLoading
                                ? [1,2,3,4,5].map(i => (
                                    <div key={i} style={{ flexShrink: 0, width: 180, height: 220, background: 'rgba(255,255,255,0.05)' }} />
                                ))
                                : goodMoodDeals.map((product, idx) => (
                                    <div
                                        key={product.id}
                                        className="deal-card"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        <div className="deal-card-img">
                                            <img
                                                src={product.img || product.images?.[0] || ''}
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                            {idx === 0 && <span className="deal-card-badge">🔥 Top Deal</span>}
                                            {idx === 1 && <span className="deal-card-badge">⚡ Hot</span>}
                                        </div>
                                        <div className="deal-card-info">
                                            <p className="deal-card-name">{product.name}</p>
                                            {product.pss && Number(product.pss) < Number(product.price) && (
                                                <p className="deal-card-old">₦{Number(product.price).toLocaleString()}</p>
                                            )}
                                            <p className="deal-card-price">
                                                ₦{Number(product.pss && Number(product.pss) > 0 ? product.pss : product.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>
            )}

            {/* ========================================================
                TRENDING — Editorial numbered section
            ======================================================== */}
            <div className="container" style={{ paddingTop: '4rem' }}>
                <div className="section-row">
                    <div className="section-label-group">
                        <span className="section-num">01 — Trending</span>
                        <h2 className="section-heading">Trending Now<span className="dot">.</span></h2>
                    </div>
                    <Link to="/products" className="section-view-all">
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

            {/* ========================================================
                FEATURED BENTO GRID
            ======================================================== */}
            <div className="container">
                <div className="section-row">
                    <div className="section-label-group">
                        <span className="section-num">02 — Featured</span>
                        <h2 className="section-heading">Collections<span className="dot">.</span></h2>
                    </div>
                    <Link to="/products" className="section-view-all">
                        Browse All <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                {/* Asymmetric bento grid */}
                <div className="bento-grid">
                    {/* Large left cell spanning 2 rows */}
                    <div className="bento-cell bento-cell-span">
                        <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=75" alt="Premium Tech" />
                        <div className="bento-cell-overlay"></div>
                        <div className="bento-cell-content">
                            <span className="bento-cell-tag"><i className="fa-solid fa-fire"></i> Editor's Pick</span>
                            <h3>Ultimate Productivity Bundle</h3>
                            <p>MacBook Pro M3 + iPad Pro + AirPods — built for creators.</p>
                            <Link to="/products" className="btn-red" style={{ fontSize: '0.72rem', padding: '0.6rem 1.25rem' }}>
                                Shop Bundle
                            </Link>
                        </div>
                    </div>

                    {/* Top right */}
                    <div className="bento-cell">
                        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=75" alt="iPhone" />
                        <div className="bento-cell-overlay"></div>
                        <div className="bento-cell-content">
                            <span className="bento-cell-tag"><i className="fa-solid fa-mobile-screen"></i> iPhone</span>
                            <h3 style={{ fontSize: '1.1rem' }}>Premium iPhone</h3>
                            <Link to="/products?cat=iPhone" className="deal-view-btn" style={{ fontSize: '0.65rem', padding: '0.4rem 0.875rem' }}>
                                Explore <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom right */}
                    <div className="bento-cell">
                        <img src="https://images.unsplash.com/photo-1592899677974-89c095bc68c3?auto=format&fit=crop&w=600&q=75" alt="Accessories" />
                        <div className="bento-cell-overlay" style={{ background: 'linear-gradient(to top, rgba(100,30,120,0.85) 0%, rgba(100,30,120,0.1) 60%, transparent 100%)' }}></div>
                        <div className="bento-cell-content">
                            <span className="bento-cell-tag" style={{ background: '#7C3AED' }}><i className="fa-solid fa-plug"></i> Accessories</span>
                            <h3 style={{ fontSize: '1.1rem' }}>Essential Add-ons</h3>
                            <Link to="/products?cat=Accessories" className="deal-view-btn" style={{ fontSize: '0.65rem', padding: '0.4rem 0.875rem' }}>
                                Explore <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================
                WHY US — Horizontal strip, numbered
            ======================================================== */}
            <div className="container">
                <div className="section-row">
                    <div className="section-label-group">
                        <span className="section-num">03 — Why Us</span>
                        <h2 className="section-heading">Why Icell Gadgets<span className="dot">?</span></h2>
                    </div>
                </div>

                <div className="why-strip">
                    {[
                        { num: '01', icon: 'fa-credit-card', title: 'Flexible Payments', desc: 'Spread payments over 3–24 months with Klump. Zero hidden fees.' },
                        { num: '02', icon: 'fa-truck-fast', title: 'Express Delivery', desc: 'Same-day dispatch in Lagos. Nationwide door delivery & tracking.' },
                        { num: '03', icon: 'fa-shield-halved', title: 'Official Warranty', desc: '100% authentic devices. Sealed original packaging. Guaranteed.' },
                        { num: '04', icon: 'fa-brands fa-whatsapp', title: '24/7 WhatsApp', desc: 'Always reachable on WhatsApp before and after purchase.', wa: true },
                    ].map((w, i) => (
                        <div className="why-cell" key={i}>
                            <div className="why-num">{w.num}</div>
                            <div className="why-icon" style={w.wa ? { background: '#25D366' } : undefined}>
                                <i className={`${w.wa ? 'fab' : 'fa-solid'} ${w.icon}`}></i>
                            </div>
                            <h3 className="why-title">{w.title}</h3>
                            <p className="why-desc">{w.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========================================================
                TESTIMONIALS
            ======================================================== */}
            <div className="container">
                <div className="section-row">
                    <div className="section-label-group">
                        <span className="section-num">04 — Reviews</span>
                        <h2 className="section-heading">Customer Reviews<span className="dot">.</span></h2>
                    </div>
                    <Link to="/products" className="section-view-all">All Reviews <i className="fa-solid fa-chevron-right"></i></Link>
                </div>

                <div className="testi-section">
                    <div className="testi-scroll">
                        {[
                            { initials: 'AO', name: 'Adebayo Okafor', location: 'Lagos, Nigeria', text: 'Got my iPhone 15 Pro in 4 hours! Same-day delivery was seamless. Icell Gadgets is the absolute best in Lagos.' },
                            { initials: 'CM', name: 'Chisom Madu', location: 'Abuja, Nigeria', text: 'The monthly payment option made getting a MacBook Pro possible for me. Smooth process start to finish. Highly recommended.' },
                            { initials: 'EI', name: 'Emeka Ike', location: 'Port Harcourt', text: 'Responded in minutes on WhatsApp. Tracking was perfect. Device exactly as described. Will definitely buy again!' },
                        ].map((t, i) => (
                            <div className="testi-card" key={i}>
                                <div className="testi-stars">★★★★★</div>
                                <p className="testi-text">{t.text}</p>
                                <div className="testi-author-row">
                                    <div className="testi-avatar">{t.initials}</div>
                                    <div>
                                        <div className="testi-name">{t.name}</div>
                                        <div className="testi-loc">{t.location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================================
                NEWSLETTER — Full-bleed red
            ======================================================== */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-inner">
                        <div className="newsletter-text">
                            <p className="newsletter-tag">Stay in the Loop</p>
                            <h2 className="newsletter-title">
                                Get Exclusive<br />Deals First.
                            </h2>
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

