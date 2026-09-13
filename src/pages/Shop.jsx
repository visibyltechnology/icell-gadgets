import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Footer from '../components/Footer';
import { listenToCategories, DEFAULT_CATEGORIES } from '../utils/categoryService';
import { listenToBrands, DEFAULT_BRANDS } from '../utils/brandService';
import { ProductCard, SkeletonCard } from '../components/ProductCard';

function pathToCategory(pathname) {
    if (pathname.includes('phones')) return 'Smartphones';
    if (pathname.includes('laptops')) return 'Laptops';
    if (pathname.includes('gaming')) return 'Gaming';
    return null;
}

function normalizeBrand(brand) {
    if (!brand) return '';
    let b = brand.trim().toLowerCase();
    if (b.includes('hisense')) return 'Hisense';
    if (b.includes('tcl')) return 'TCL';
    if (b.includes('lg')) return 'LG';
    if (b.includes('samsung')) return 'Samsung';
    if (b.includes('royal')) return 'Royal';
    if (b.includes('thermocool') || b.includes('haier')) return 'Thermocool';
    if (b.includes('panasonic')) return 'Panasonic';
    if (b.includes('apple') || b.includes('iphone')) return 'Apple';
    if (b.includes('sony')) return 'Sony';
    if (b.includes('hp')) return 'HP';
    return b.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function Shop() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [brands, setBrands] = useState(DEFAULT_BRANDS);

    // Filtering State
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState(0);

    // View & Sorting State
    const [sortBy, setSortBy] = useState('Recommended');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [currentPage, setCurrentPage] = useState(1);
    
    // Data State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = listenToCategories((cats) => {
            setCategories(cats.length > 0 ? cats : DEFAULT_CATEGORIES);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = listenToBrands((brandList) => {
            setBrands(brandList.length > 0 ? brandList : DEFAULT_BRANDS);
        });
        return () => unsubscribe();
    }, []);

    const ensureInventoryFields = (product) => ({
        ...product,
        inventory_status: product.inventory_status || 'in_stock',
        items_left: product.items_left !== undefined ? product.items_left : 5,
        unlimited_stock: product.unlimited_stock || false,
        is_hidden: product.is_hidden || false,
        rating: product.rating || (Math.random() > 0.5 ? 5 : 4) // mock rating if missing
    });

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'products'), (snap) => {
            const items = snap.docs.map(d => ensureInventoryFields({ id: d.id, ...d.data() })).filter(p => !p.is_hidden);
            setProducts(items);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching products:', error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const cat = searchParams.get('cat') || pathToCategory(location.pathname);
        if (cat) {
            const match = categories.find(c => c.name.toLowerCase() === cat.toLowerCase())?.name;
            if (match) setActiveCategory(match);
            else setActiveCategory(cat);
            setSearch('');
        } else {
            setActiveCategory('All');
        }
        
        const searchQ = searchParams.get('search');
        if (searchQ) {
            setSearch(searchQ);
            setActiveCategory('All');
        }
    }, [location.search, location.pathname, searchParams, categories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory, sortBy, minPrice, maxPrice, minRating]);

    const filtered = products.filter(p => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        
        const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const searchableText = `${p.name || ''} ${normalizeBrand(p.brand)} ${p.category || ''} ${p.tag || ''}`.toLowerCase();
        const matchSearch = searchTerms.length === 0 || searchTerms.every(term => searchableText.includes(term));
        
        const price = Number(p.price) || 0;
        const matchMin = minPrice === '' || price >= Number(minPrice);
        const matchMax = maxPrice === '' || price <= Number(maxPrice);
        
        const rating = Number(p.rating) || 0;
        const matchRating = minRating === 0 || rating >= minRating;
        
        return matchCat && matchSearch && matchMin && matchMax && matchRating;
    });

    const sorted = [...filtered].sort((a, b) => {
        switch(sortBy) {
            case 'Price: Low to High': return (Number(a.price) || 0) - (Number(b.price) || 0);
            case 'Price: High to Low': return (Number(b.price) || 0) - (Number(a.price) || 0);
            case 'Newest': return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            case 'Recommended':
            case 'Popularity': default: return 0;
        }
    });

    const itemsPerPage = viewMode === 'list' ? 12 : 24;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);

    const handleCategoryClick = (catName) => {
        setSearch('');
        if (catName === 'All') {
            navigate('/products');
        } else {
            navigate(`/products?cat=${encodeURIComponent(catName)}`);
        }
    };

    // Helper for generating star strings
    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '★' : '☆';
        }
        return stars;
    };

    return (
        <div style={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
            
            {/* HEADER SECTION */}
            <div style={{ background: '#1A2856', padding: '3rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
                        margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase'
                    }}>
                        Shop Electronics
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                        Discover our curated selection of premium devices, carefully vetted for quality and performance.
                    </p>
                </div>
            </div>

            {/* SHOP CONTENT - LAYOUT */}
            <div className="shop-layout-container" style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '2rem 1.5rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
                
                {/* Mobile Filters Toggle */}
                <button 
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    style={{
                        display: 'none', // Shown via CSS media query below for mobile
                        width: '100%', padding: '0.75rem', background: '#fff', border: '1px solid #E2E8F0',
                        borderRadius: 8, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem',
                        color: '#1A2856', marginBottom: '1rem', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                    className="mobile-filters-btn"
                >
                    <i className="fa-solid fa-sliders"></i> Filters
                </button>

                <style>
                    {`
                    .sidebar-filters {
                        width: 260px;
                        flex-shrink: 0;
                    }
                    @media (max-width: 768px) {
                        .shop-layout-container {
                            flex-direction: column;
                        }
                        .sidebar-filters {
                            display: ${isMobileFiltersOpen ? 'block' : 'none'};
                            width: 100%;
                        }
                        .mobile-filters-btn {
                            display: flex !important;
                        }
                        .shop-main-content {
                            width: 100%;
                        }
                        .shop-toolbar-actions {
                            flex-wrap: wrap;
                            justify-content: flex-start;
                        }
                    }
                    .products-list-view {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .products-grid-view {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                        gap: 1.5rem;
                    }
                    `}
                </style>

                {/* SIDEBAR */}
                <aside className="sidebar-filters">
                    
                    {/* Breadcrumbs */}
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link to="/" style={{ color: '#1A2856', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <span style={{ color: '#94A3B8' }}>Shop</span>
                    </div>

                    {/* Filters Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>Filters</h2>
                        <button onClick={() => { setMinPrice(''); setMaxPrice(''); setMinRating(0); setActiveCategory('All'); setSearch(''); }} style={{ background: 'none', border: 'none', color: '#E31E24', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>Clear All</button>
                    </div>

                    {/* Categories */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Categories</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <li>
                                <button onClick={() => handleCategoryClick('All')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, color: activeCategory === 'All' ? '#1A2856' : '#64748B', fontWeight: activeCategory === 'All' ? 700 : 500, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'color 0.2s' }}>
                                    All Products
                                </button>
                            </li>
                            {categories.filter(c => c.name !== 'All').map(cat => (
                                <li key={cat.id || cat.name}>
                                    <button onClick={() => handleCategoryClick(cat.name)} style={{ background: 'none', border: 'none', padding: 0, margin: 0, color: activeCategory === cat.name ? '#1A2856' : '#64748B', fontWeight: activeCategory === cat.name ? 700 : 500, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'color 0.2s' }}>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Range */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Price (₦)</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                style={{ flex: 1, width: '100%', padding: '0.6rem', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: '0.85rem', outline: 'none' }}
                            />
                            <span style={{ color: '#94A3B8' }}>-</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                style={{ flex: 1, width: '100%', padding: '0.6rem', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: '0.85rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Customer Rating */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Customer Rating</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[5, 4, 3].map(rating => (
                                <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="rating" 
                                        checked={minRating === rating} 
                                        onChange={() => setMinRating(rating)}
                                        style={{ accentColor: '#1A2856' }}
                                    />
                                    <span style={{ color: '#F59E0B', letterSpacing: '2px', fontSize: '1.1rem' }}>
                                        {renderStars(rating)}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>& Up</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </aside>

                {/* MAIN CONTENT */}
                <main className="shop-main-content" style={{ flex: 1, minWidth: 0 }}>
                    
                    {/* Toolbar (Count & Sort) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.95rem', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                            Showing <span style={{ fontWeight: 700, color: '#0F172A' }}>{currentItems.length}</span> of <span style={{ fontWeight: 700, color: '#0F172A' }}>{filtered.length}</span> products
                        </div>
                        
                        <div className="shop-toolbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Sort by:</span>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '0.4rem 2rem 0.4rem 0.8rem', borderRadius: 6, border: '1px solid #E2E8F0',
                                        background: '#fff', color: '#0F172A', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                                        outline: 'none', cursor: 'pointer', appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem'
                                    }}
                                >
                                    <option value="Recommended">Recommended</option>
                                    <option value="Newest">Newest Arrivals</option>
                                    <option value="Price: Low to High">Price: Low to High</option>
                                    <option value="Price: High to Low">Price: High to Low</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, padding: 4 }}>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    style={{ 
                                        border: 'none', background: viewMode === 'grid' ? '#F1F5F9' : 'transparent',
                                        color: viewMode === 'grid' ? '#1A2856' : '#94A3B8', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem'
                                    }}
                                    title="Grid View"
                                >
                                    🔲
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    style={{ 
                                        border: 'none', background: viewMode === 'list' ? '#F1F5F9' : 'transparent',
                                        color: viewMode === 'list' ? '#1A2856' : '#94A3B8', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem'
                                    }}
                                    title="List View"
                                >
                                    ☰
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Products Container */}
                    {loading ? (
                        <div className={viewMode === 'list' ? 'products-list-view' : 'products-grid-view'}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                        </div>
                    ) : currentItems.length > 0 ? (
                        <>
                            <div className={viewMode === 'list' ? 'products-list-view' : 'products-grid-view'}>
                                {currentItems.map(product => (
                                    <div key={product.id} style={viewMode === 'list' ? { display: 'flex', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid #E2E8F0', alignItems: 'center' } : {}}>
                                        <div style={viewMode === 'list' ? { flex: 1 } : { height: '100%' }}>
                                            <ProductCard 
                                                product={product} 
                                                onClick={() => navigate(`/products/${product.id}`)}
                                                isList={viewMode === 'list'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', padding: '0.5rem', borderRadius: 99, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                        <button 
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            style={{ 
                                                width: 36, height: 36, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'transparent', color: '#64748B', transition: 'all 0.2s',
                                                opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
                                            }}
                                        >
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                        
                                        {Array.from({ length: totalPages }).map((_, i) => {
                                            const page = i + 1;
                                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                const isActive = currentPage === page;
                                                return (
                                                    <button 
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        style={{
                                                            width: 36, height: 36, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer',
                                                            background: isActive ? '#1A2856' : 'transparent',
                                                            color: isActive ? '#fff' : '#64748B'
                                                        }}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} style={{ padding: '0 8px', color: '#94A3B8' }}>...</span>;
                                            }
                                            return null;
                                        })}

                                        <button 
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            style={{ 
                                                width: 36, height: 36, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'transparent', color: '#64748B', transition: 'all 0.2s',
                                                opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' 
                                            }}
                                        >
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16 }}>
                            <div style={{ width: 64, height: 64, background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <i className="fa-solid fa-search" style={{ fontSize: '1.5rem', color: '#94A3B8' }}></i>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase' }}>
                                No products found
                            </h3>
                            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: 'Inter, sans-serif' }}>
                                We couldn't find any products matching your current filters.
                            </p>
                            <button onClick={() => { setSearch(''); setActiveCategory('All'); setMinPrice(''); setMaxPrice(''); setMinRating(0); navigate('/products'); }} style={{
                                background: '#1A2856', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8,
                                fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'background 0.2s'
                            }}>
                                Clear Filters
                            </button>
                        </div>
                    )}

                </main>
            </div>

            <Footer />
        </div>
    );
}
