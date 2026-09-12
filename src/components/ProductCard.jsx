import { isProductInStock } from '../utils/inventoryService';
import { useNavigate } from 'react-router-dom';

export function ProductCard({ product, tagLabel = null, onClick }) {
    const rating = Number(product.averageRating || product.rating) || 0;
    const inStock = isProductInStock(product);
    const price = Number(product.hasConditionPricing
        ? Math.min(Number(product.priceBrandNew || 0), Number(product.priceUkUsed || 0))
        : (product.pss && product.pss > 0 ? product.pss : product.price)
    );
    const oldPrice = !product.hasConditionPricing && product.pss && product.pss > 0 && Number(product.pss) < Number(product.price)
        ? Number(product.price) : null;

    const tag = product.tag?.toLowerCase() === 'hot' || tagLabel === 'Hot' ? 'hot'
        : product.tag?.toLowerCase() === 'new' || tagLabel === 'New' ? 'new' : null;

    return (
        <article className="p-card" onClick={onClick} tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick?.()}>
            {/* Top ribbon badge */}
            {tag && (
                <span className={`p-badge ${tag}`}>
                    {tag === 'hot' ? '🔥 HOT' : 'NEW'}
                </span>
            )}

            {/* Wishlist */}
            <button className="p-wishlist" aria-label="Wishlist" onClick={e => e.stopPropagation()}>
                <i className="fa-regular fa-heart"></i>
            </button>

            {/* Image — 4:3 ratio, full bleed */}
            <div className="p-img">
                <img
                    src={product.img || product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    loading="lazy"
                />
            </div>

            {/* Info */}
            <div className="p-body">
                <div className="p-cat">{product.category || 'Gadgets'}</div>

                <h3 className="p-name">{product.name}</h3>

                {/* Stars */}
                <div className="p-rating">
                    <div className="p-stars">
                        {[1,2,3,4,5].map(star => (
                            <i key={star}
                                className={star <= rating ? 'fas fa-star' : 'far fa-star'}
                                style={{ color: star <= rating ? '#F59E0B' : '#D1D5DB', fontSize: '0.6rem' }}
                            ></i>
                        ))}
                    </div>
                    <span className="p-reviews">({product.reviewCount || product.numReviews || 0})</span>
                </div>

                {/* Price row */}
                <div className="p-foot">
                    <div className="p-price-block">
                        {oldPrice && <span className="p-old-price">₦{oldPrice.toLocaleString()}</span>}
                        <span className="p-price">
                            {product.hasConditionPricing && <span style={{ fontSize: '0.65em', color: '#9CA3AF', fontWeight: 600 }}>From </span>}
                            ₦{price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        className="p-add-btn"
                        aria-label="View"
                        disabled={!inStock}
                        onClick={e => { e.stopPropagation(); if (inStock) onClick?.(); }}
                        title={inStock ? 'View product' : 'Out of stock'}
                    >
                        <i className={`fa-solid ${inStock ? 'fa-arrow-right' : 'fa-xmark'}`}></i>
                    </button>
                </div>
            </div>
        </article>
    );
}

export function SkeletonCard() {
    return (
        <article className="p-card p-skeleton">
            <div className="p-img skel-block" style={{ aspectRatio: '4/3' }}></div>
            <div className="p-body" style={{ gap: 10 }}>
                <div className="skel-block" style={{ height: 9, width: '40%', borderRadius: 2 }}></div>
                <div className="skel-block" style={{ height: 14, width: '88%', borderRadius: 2 }}></div>
                <div className="skel-block" style={{ height: 10, width: '55%', borderRadius: 2, marginBottom: 4 }}></div>
                <div className="p-foot" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <div className="skel-block" style={{ height: 20, width: '45%', borderRadius: 2 }}></div>
                    <div className="skel-block" style={{ height: 34, width: 34, borderRadius: 2 }}></div>
                </div>
            </div>
        </article>
    );
}
