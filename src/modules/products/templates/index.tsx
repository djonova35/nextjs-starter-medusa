"use client"
import React, { Suspense, useState } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const [activeImg, setActiveImg] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const productImages = images?.length > 0 ? images : 
    product.images?.length > 0 ? product.images : []

  const price = product.variants?.[0]?.calculated_price
  const originalPrice = (price as any)?.original_amount
  const salePrice = (price as any)?.calculated_amount

  return (
    <>
      {/* ===== IMAGE SLIDER ===== */}
      <div className="dj-image-slider">
        <div className="dj-slides">
          {productImages.length > 0 ? (
            productImages.map((img: any, i: number) => (
              <div key={i} className="dj-slide">
                <img
                  src={img.url}
                  alt={product.title || "Product image"}
                />
              </div>
            ))
          ) : (
            <div className="dj-slide" style={{background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:'4rem'}}>👟</span>
            </div>
          )}
        </div>
        {productImages.length > 1 && (
          <div className="dj-dots">
            {productImages.map((_: any, i: number) => (
              <div
                key={i}
                className={`dj-dot ${i === activeImg ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== PRODUCT INFO ===== */}
      <div className="dj-product-info">
        <div className="dj-rating-row">
          <span className="dj-stars">★★★★★</span>
          <span className="dj-rating-count">(47)</span>
        </div>
        <div className="dj-product-title">{product.title}</div>
        <div className="dj-price-row">
          <span className="dj-price-sale">
            £{salePrice ? (salePrice / 100).toFixed(2) : "0.00"}
          </span>
          {originalPrice && originalPrice !== salePrice && (
            <span className="dj-price-original">
              £{(originalPrice / 100).toFixed(2)}
            </span>
          )}
        </div>
        <div className="dj-promo-tag">
          🏷️ Use Code: DJNV20
        </div>
      </div>

      {/* ===== SIZE SELECTOR ===== */}
      <div className="dj-size-section">
        <div className="dj-size-header">
          <span className="dj-size-label">Size</span>
          <span style={{color:'#999'}}>|</span>
          <span className="dj-size-guide">View Size Guide</span>
        </div>
        <Suspense fallback={
          <div className="dj-size-grid">
            {['XS','S','M','L','XL'].map(s => (
              <div key={s} className="dj-size-pill">{s}</div>
            ))}
          </div>
        }>
          <ProductActionsWrapper
            id={product.id}
            region={region}
          />
        </Suspense>
      </div>

      {/* ===== SHIPPING INFO ===== */}
      <div className="dj-shipping-info">
        <div className="dj-shipping-item">
          <div className="dj-shipping-icon">🚚</div>
          <div className="dj-shipping-text">
            <strong>Free UK Standard Delivery</strong>
            On orders over £75 · 3-7 business days
          </div>
        </div>
        <div className="dj-shipping-item">
          <div className="dj-shipping-icon">📦</div>
          <div className="dj-shipping-text">
            <strong>Express Delivery Available</strong>
            2 business days · Silver & Gold Members
          </div>
        </div>
        <div className="dj-shipping-item">
          <div className="dj-shipping-icon">↩️</div>
          <div className="dj-shipping-text">
            <a href="#">30-day Free Returns</a>
          </div>
        </div>
      </div>

      {/* ===== ACCORDIONS ===== */}
      <div className="dj-accordion">
        {[
          {
            id: 'details',
            title: '🧥 Product Details',
            content: product.description || 'Premium quality product from DJONOVA SS26 collection. Designed for those who move with intention.'
          },
          {
            id: 'material',
            title: '🧵 Material & Care',
            content: product.material || '100% ethically sourced materials. Machine wash cold. Do not tumble dry. Iron on low heat.'
          },
          {
            id: 'sizing',
            title: '📏 Sizing Info',
            content: 'This style runs true to size. Model is 5\'8" wearing size S. Check our size guide for detailed measurements.'
          },
        ].map(item => (
          <div key={item.id} className="dj-accordion-item">
            <div
              className="dj-accordion-header"
              onClick={() => setOpenAccordion(
                openAccordion === item.id ? null : item.id
              )}
            >
              {item.title}
              <span className="dj-accordion-icon">
                {openAccordion === item.id ? '∧' : '∨'}
              </span>
            </div>
            {openAccordion === item.id && (
              <div className="dj-accordion-content">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== COMPLETE THE LOOK ===== */}
      <div className="dj-complete-look">
        <div className="dj-section-title">Complete The Look</div>
        <div className="dj-look-grid">
          {[
            {name: 'AURA Low Pro', price: '£189', emoji: '👟'},
            {name: 'NOVA Field Jacket', price: '£245', emoji: '🧥'},
            {name: 'GRID Tech Bag', price: '£195', emoji: '🎒'},
            {name: 'PULSE Pro Buds', price: '£129', emoji: '🎧'},
          ].map((item, i) => (
            <div key={i} className="dj-look-item">
              <div className="dj-look-img">
                <div style={{
                  width:'100%',height:'100%',
                  display:'flex',alignItems:'center',
                  justifyContent:'center',
                  fontSize:'2.5rem',
                  background:'#f5f5f5'
                }}>
                  {item.emoji}
                </div>
                <button className="dj-look-add">🛍️</button>
              </div>
              <div className="dj-look-name">{item.name}</div>
              <div className="dj-look-price">{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== REVIEWS ===== */}
      <div className="dj-reviews">
        <div className="dj-reviews-title">Reviews</div>
        <div className="dj-reviews-summary">
          <div className="dj-reviews-avg">4.9</div>
          <div>
            <div className="dj-reviews-stars">★★★★★</div>
            <div className="dj-reviews-count">(47 reviews)</div>
          </div>
        </div>
        {[
          {
            name: 'Amara O.',
            date: '2 days ago',
            stars: '★★★★★',
            text: 'Absolutely love this! The quality is amazing and it fits perfectly. Will definitely order again!'
          },
          {
            name: 'Marcus T.',
            date: '1 week ago',
            stars: '★★★★★',
            text: 'Fast shipping, beautiful packaging. Exactly as described. DJONOVA never disappoints!'
          },
          {
            name: 'Priya K.',
            date: '2 weeks ago',
            stars: '★★★★★',
            text: 'The material is so soft and comfortable. Got so many compliments wearing this!'
          },
        ].map((review, i) => (
          <div key={i} className="dj-review-item">
            <div className="dj-review-header">
              <span className="dj-reviewer-name">{review.name}</span>
              <span className="dj-review-date">{review.date}</span>
            </div>
            <div style={{color:'#f5a623',fontSize:'0.85rem',marginBottom:'6px'}}>
              {review.stars}
            </div>
            <div className="dj-review-body">{review.text}</div>
          </div>
        ))}
      </div>

      {/* ===== RELATED PRODUCTS ===== */}
      <div style={{padding:'24px 20px',background:'#fff',borderTop:'8px solid #f5f5f5'}}>
        <div className="dj-section-title">You May Also Like</div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
