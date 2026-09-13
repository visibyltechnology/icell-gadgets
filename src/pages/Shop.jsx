import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
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

    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('Popularity');

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
        is_hidden: product.is_hidden || false
    });

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'products'), (snap) => {
            let items = snap.docs.map(d => ensureInventoryFields({ id: d.id, ...d.data() })).filter(p => !p.is_hidden);
            
            if (items.length === 0) {
                items = [
                    { id: '1', name: 'iPhone 15 Pro Max 256GB', price: 1850000, category: 'Smartphones', brand: 'Apple', inventory_status: 'in_stock', is_hidden: false, averageRating: 5, reviewCount: 124 },
                    { id: '2', name: 'Samsung Galaxy S24 Ultra', price: 1650000, category: 'Smartphones', brand: 'Samsung', inventory_status: 'in_stock', is_hidden: false, averageRating: 4.8, reviewCount: 89 },
                ];
            }
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
            else setActiveCategory(cat); // fallback
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
    }, [search, activeCategory, sortBy]);

    const filtered = products.filter(p => {
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        
        const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const searchableText = `${p.name || ''} ${normalizeBrand(p.brand)} ${p.category || ''} ${p.tag || ''}`.toLowerCase();
        const matchSearch = searchTerms.length === 0 || searchTerms.every(term => searchableText.includes(term));
        
        return matchCat && matchSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
        switch(sortBy) {
            case 'Price: Low to High': return (Number(a.price) || 0) - (Number(b.price) || 0);
            case 'Price: High to Low': return (Number(b.price) || 0) - (Number(a.price) || 0);
            case 'Newest': return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            case 'Popularity': default: return 0;
        }
    });

    const itemsPerPage = 24;
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

    return (
        <div style={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* HERO / HEADER SECTION */}
            <div style={{ background: '#1A2856', padding: '4rem 0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(227,30,36,0.15)', pointerEvents: 'none' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="section-num" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
                        {search ? `Search Results` : 'Catalog'}
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
                        margin: '0 0 1rem'
                    }}>
                        {search ? (
                            <>Results for <span style={{ color: '#E31E24' }}>"{search}"</span></>
                        ) : (
                            <>{activeCategory === 'All' ? 'All' : activeCategory} <span style={{ color: '#E31E24' }}>Gadgets.</span></>
                        )}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 400, lineHeight: 1.6 }}>
                        Discover our curated selection of premium devices, carefully vetted for quality and performance.
                    </p>
                </div>
            </div>

            {/* SHOP CONTENT */}
            <div className="shop-page container" style={{ flex: 1 }}>
                
                {/* Horizontal Filter Bar */}
                <div className="shop-filter-bar">
                    <button 
                        className={`filter-tab ${activeCategory === 'All' ? 'active' : ''}`}
                        onClick={() => handleCategoryClick('All')}
                    >
                        All
                    </button>
                    {categories.filter(c => c.name !== 'All').map(cat => (
                        <button 
                            key={cat.id || cat.name}
                            className={`filter-tab ${activeCategory === cat.name ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Toolbar (Count & Sort) */}
                <div className="shop-toolbar">
                    <div className="shop-count">
                        Showing <span>{filtered.length}</span> Products
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By:</span>
                        <select 
                            className="sort-select"
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="Popularity">Popularity</option>
                            <option value="Newest">Newest Arrivals</option>
                            <option value="Price: Low to High">Price: Low to High</option>
                            <option value="Price: High to Low">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="products-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : currentItems.length > 0 ? (
                    <>
                        <div className="products-grid">
                            {currentItems.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ textAlign: 'center' }}>
                                <div className="pagination">
                                    <button 
                                        className="page-btn"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return (
                                                <button 
                                                    key={page}
                                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} style={{ padding: '0 10px', display: 'flex', alignItems: 'center', color: '#9CA3AF' }}>...</span>;
                                        }
                                        return null;
                                    })}

                                    <button 
                                        className="page-btn"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center', background: '#fff', border: '1px solid #E5E7EB' }}>
                        <div style={{ width: 64, height: 64, background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <i className="fa-solid fa-search" style={{ fontSize: '1.5rem', color: '#9CA3AF' }}></i>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem' }}>
                            No products found
                        </h3>
                        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
                            We couldn't find any products matching your current filters.
                        </p>
                        <button onClick={() => { setSearch(''); setActiveCategory('All'); navigate('/products'); }} className="btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

