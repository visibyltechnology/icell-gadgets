import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Footer from '../components/Footer';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { isProductInStock } from '../utils/inventoryService';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImg, setSelectedImg] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setSelectedImg(data.img || data.images?.[0] || '');
          if (data.hasConditionPricing) setSelectedCondition('Brand New');
          if (data.hasVariants && data.variants?.length > 0) setSelectedVariantId(data.variants[0].id);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'products', id, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !isProductInStock(product)) {
      toast.error('Product is out of stock');
      return;
    }
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.hasConditionPricing
        ? (selectedCondition === 'Brand New' ? product.priceBrandNew : product.priceUkUsed)
        : (product.pss && product.pss > 0 ? product.pss : product.price),
      img: selectedImg || product.img,
      category: product.category,
      brand: product.brand,
      condition: product.hasConditionPricing ? selectedCondition : undefined,
      variantId: selectedVariantId
    };
    addToCart(cartItem);
    toast.success('Added to cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to submit a review');
    if (!newReviewText.trim()) return toast.error('Review text cannot be empty');
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, 'products', id, 'reviews'), {
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        rating: newRating,
        text: newReviewText,
        createdAt: serverTimestamp()
      });
      toast.success('Review submitted successfully!');
      setNewReviewText('');
      setNewRating(5);
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1A2856' }}></i>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>{error || 'Product Not Found'}</h2>
        <Link to="/products" className="btn-outline">Return to Shop</Link>
      </div>
    );
  }

  const currentPrice = product.hasConditionPricing
    ? (selectedCondition === 'Brand New' ? product.priceBrandNew : product.priceUkUsed)
    : (product.pss && product.pss > 0 ? product.pss : product.price);
  
  const inStock = isProductInStock(product);
  const images = [product.img, ...(product.images || [])].filter(Boolean);

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Breadcrumbs */}
      <div style={{ borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
        <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', gap: 10, fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Link to="/" style={{ color: '#1A2856' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: '#1A2856' }}>Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/products?cat=${product.category}`} style={{ color: '#1A2856' }}>{product.category}</Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: '#9CA3AF' }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: '2rem 1.5rem 5rem' }}>
        
        {/* Main Product Layout */}
        <div className="detail-grid">
          
          {/* Gallery */}
          <div className="detail-gallery-panel">
            <div className="detail-main-img">
              <img src={selectedImg} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((img, i) => (
                  <div key={i} className={`detail-thumb ${selectedImg === img ? 'active' : ''}`} onClick={() => setSelectedImg(img)}>
                    <img src={img} alt={`Thumb ${i}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info-panel">
            {product.tag && (
              <div style={{ alignSelf: 'flex-start', background: '#E31E24', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                {product.tag}
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 2, color: '#F59E0B', fontSize: '0.8rem' }}>
                {[1,2,3,4,5].map(s => <i key={s} className={s <= (product.averageRating || 0) ? "fas fa-star" : "far fa-star"}></i>)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>({reviews.length || product.reviewCount || 0} Reviews)</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D1D5DB' }}></span>
              <span style={{ fontSize: '0.75rem', color: inStock ? '#059669' : '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1A2856', margin: '1rem 0' }}>
              ₦{Number(currentPrice).toLocaleString()}
            </div>

            {/* Condtions */}
            {product.hasConditionPricing && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', marginBottom: '0.5rem' }}>Condition</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Brand New', 'UK Used'].map(cond => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      style={{
                        flex: 1, padding: '0.75rem',
                        background: selectedCondition === cond ? '#1A2856' : '#fff',
                        color: selectedCondition === cond ? '#fff' : '#374151',
                        border: `1.5px solid ${selectedCondition === cond ? '#1A2856' : '#E5E7EB'}`,
                        fontSize: '0.8rem', fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2
                      }}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.hasVariants && product.variants?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', marginBottom: '0.5rem' }}>Options</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: selectedVariantId === v.id ? '#1A2856' : '#fff',
                        color: selectedVariantId === v.id ? '#fff' : '#374151',
                        border: `1.5px solid ${selectedVariantId === v.id ? '#1A2856' : '#E5E7EB'}`,
                        fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.9rem', marginBottom: '1rem', opacity: inStock ? 1 : 0.5, cursor: inStock ? 'pointer' : 'not-allowed' }}
            >
              <i className="fa-solid fa-cart-shopping"></i> {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Perks */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: '#F3F4F6', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A2856' }}><i className="fa-solid fa-truck-fast"></i></div>
                <div style={{ fontSize: '0.8rem', color: '#374151' }}><strong>Fast Delivery:</strong> Same-day in Lagos, 1-3 days nationwide.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: '#F3F4F6', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A2856' }}><i className="fa-solid fa-shield-halved"></i></div>
                <div style={{ fontSize: '0.8rem', color: '#374151' }}><strong>Warranty:</strong> Covered by official manufacturer guarantee.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: '#F3F4F6', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A2856' }}><i className="fa-solid fa-credit-card"></i></div>
                <div style={{ fontSize: '0.8rem', color: '#374151' }}><strong>Pay Later:</strong> Klump monthly payments available at checkout.</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom Tabs */}
        <div style={{ marginTop: '3rem' }}>
          <div className="tab-row">
            <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Product Details</button>
            <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '2rem' }}>
            {activeTab === 'details' && (
              <div style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {product.description || 'No description available for this product.'}
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                <table className="data-table">
                  <tbody>
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <td style={{ width: '30%', fontWeight: 600, color: '#111827', background: '#F9FAFB' }}>{key}</td>
                          <td>{val}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ textAlign: 'center', padding: '2rem' }}>No specifications available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div style={{ marginBottom: '2.5rem', background: '#FAFAFA', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem' }}>Write a Review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', color: '#F59E0B', fontSize: '1.1rem' }}>
                      {[1,2,3,4,5].map(star => (
                        <i key={star} className={star <= newRating ? "fas fa-star" : "far fa-star"} style={{ cursor: 'pointer' }} onClick={() => setNewRating(star)}></i>
                      ))}
                    </div>
                    <textarea 
                      value={newReviewText}
                      onChange={e => setNewReviewText(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      style={{ width: '100%', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: 2, background: '#fff', outline: 'none', fontSize: '0.875rem', minHeight: 100, marginBottom: '1rem' }}
                      onFocus={e => e.target.style.borderColor = '#1A2856'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    ></textarea>
                    <button type="submit" disabled={isSubmittingReview} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.75rem 1.5rem' }}>
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {reviews.length > 0 ? reviews.map(rev => (
                    <div key={rev.id} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{rev.userName}</div>
                        <div style={{ display: 'flex', gap: 2, color: '#F59E0B', fontSize: '0.75rem' }}>
                          {[1,2,3,4,5].map(s => <i key={s} className={s <= rev.rating ? "fas fa-star" : "far fa-star"}></i>)}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{rev.text}</p>
                      {rev.createdAt && (
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {new Date(rev.createdAt.seconds * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', padding: '2rem 0' }}>
                      No reviews yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

