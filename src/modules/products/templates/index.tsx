import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

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

  return (
    <div className="djonova-product-page">

      {/* ── 1. FULL WIDTH IMAGE GALLERY (swipeable on mobile) ── */}
      <div className="dj-gallery-wrap">
        <ImageGallery images={images} />
      </div>

      {/* ── STICKY BOTTOM BAR (mobile) ── */}
      <div className="dj-sticky-bar">
        <div className="dj-sticky-inner">
          <div>
            <div className="dj-sticky-name">{product.title}</div>
            <div className="dj-sticky-price">
              {product.variants?.[0]?.calculated_price
                ? `£${(product.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}`
                : ""}
            </div>
          </div>
          <button className="dj-sticky-btn">Add to Bag</button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dj-product-content">

        {/* ── 2. PRODUCT NAME + RATING ── */}
        <div className="dj-name-section">
          <ProductInfo product={product} />
          <div className="dj-rating-row">
            <span className="dj-stars">★★★★★</span>
            <span className="dj-rating-count">Be the first to review</span>
          </div>
        </div>

        {/* ── 3. PRICE ── */}
        <div className="dj-price-section">
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>

        {/* ── 4. PROMO CODE BANNER ── */}
        <div className="dj-promo-banner">
          <span className="dj-promo-tag">🏷️</span>
          <span className="dj-promo-text">
            Use code <strong>DJNV20</strong> for 20% off your first order
          </span>
        </div>

        {/* ── 7. SHIPPING INFO ── */}
        <div className="dj-delivery-strip">
          <div className="dj-delivery-item">
            <span className="dj-delivery-icon">🚚</span>
            <div>
              <div className="dj-delivery-title">Free UK Delivery</div>
              <div className="dj-delivery-sub">On orders over £50 · 3–5 days</div>
            </div>
          </div>
          <div className="dj-delivery-item">
            <span className="dj-delivery-icon">↩️</span>
            <div>
              <div className="dj-delivery-title">Free Returns</div>
              <div className="dj-delivery-sub">30 days · No questions asked</div>
            </div>
          </div>
        </div>

        {/* ── 8 + 9 + 10. ACCORDIONS ── */}
        <div className="dj-accordions">
          <ProductTabs product={product} />

          {/* Material accordion */}
          <details className="dj-accordion">
            <summary className="dj-accordion-header">
              <span>Material & Care</span>
              <span className="dj-accordion-icon">+</span>
            </summary>
            <div className="dj-accordion-body">
              <p>Material information will be added per product. Check the product description for fabric composition and care instructions.</p>
            </div>
          </details>

          <details className="dj-accordion">
            <summary className="dj-accordion-header">
              <span>Delivery & Returns</span>
              <span className="dj-accordion-icon">+</span>
            </summary>
            <div className="dj-accordion-body">
              <ul className="dj-accordion-list">
                <li>Standard UK delivery: 3–5 working days · Free over £50</li>
                <li>Express delivery: 1–2 working days · £4.99</li>
                <li>International delivery: 7–14 working days</li>
                <li>Free returns within 30 days of delivery</li>
                <li>Items must be unworn and in original packaging</li>
              </ul>
            </div>
          </details>
        </div>

        {/* ── ONBOARDING CTA (dev only, hidden in prod) ── */}
        <ProductOnboardingCta />

      </div>

      {/* ── 11. COMPLETE THE LOOK / RELATED PRODUCTS ── */}
      <div className="dj-related-section">
        <div className="dj-section-header">
          <div className="dj-section-eyebrow">Style It With</div>
          <h2 className="dj-section-title">Complete the Look</h2>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>

      {/* ── 12. CUSTOMER REVIEWS ── */}
      <div className="dj-reviews-section">
        <div className="content-container">
          <div className="dj-section-header">
            <div className="dj-section-eyebrow">What They Say</div>
            <h2 className="dj-section-title">Customer Reviews</h2>
          </div>

          {/* Overall rating summary */}
          <div className="dj-rating-summary">
            <div className="dj-rating-big">0.0</div>
            <div>
              <div className="dj-stars-big">☆☆☆☆☆</div>
              <div className="dj-rating-total">No reviews yet</div>
            </div>
          </div>

          {/* Empty state */}
          <div className="dj-no-reviews">
            <div className="dj-no-reviews-icon">✍️</div>
            <h3 className="dj-no-reviews-title">Be the first to review</h3>
            <p className="dj-no-reviews-desc">
              Share your thoughts on this product. Your review helps other shoppers make confident decisions.
            </p>
            <button className="dj-review-btn">Write a Review</button>
          </div>
        </div>
      </div>

      {/* ── STYLES ── */}
      <style>{`
        .djonova-product-page {
          background: #FEFCFF;
          min-height: 100vh;
        }

        /* GALLERY */
        .dj-gallery-wrap {
          width: 100%;
          background: #F8F4FC;
        }

        /* STICKY BOTTOM BAR */
        .dj-sticky-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(254, 252, 255, 0.97);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(180, 140, 210, 0.2);
          padding: 12px 20px;
          z-index: 100;
          display: none;
        }
        @media (max-width: 768px) {
          .dj-sticky-bar { display: block; }
        }
        .dj-sticky-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .dj-sticky-name {
          font-size: 13px;
          font-weight: 500;
          color: #2A1F4A;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dj-sticky-price {
          font-size: 15px;
          font-weight: 600;
          color: #9B7FE8;
        }
        .dj-sticky-btn {
          background: #2A1F4A;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          white-space: nowrap;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .dj-sticky-btn:hover { background: #9B7FE8; }

        /* MAIN CONTENT */
        .dj-product-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 28px 20px 100px;
        }

        /* NAME + RATING */
        .dj-name-section {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #EDE8FA;
        }
        .dj-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        .dj-stars {
          color: #C9A96E;
          font-size: 14px;
          letter-spacing: -1px;
        }
        .dj-rating-count {
          font-size: 12px;
          color: #9B95B8;
          text-decoration: underline;
          cursor: pointer;
        }

        /* PRICE SECTION */
        .dj-price-section {
          margin-bottom: 20px;
        }

        /* PROMO BANNER */
        .dj-promo-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #F0EBFF, #E8DEFF);
          border: 1px solid rgba(155, 127, 232, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        .dj-promo-tag { font-size: 16px; }
        .dj-promo-text {
          font-size: 13px;
          color: #2A1F4A;
          line-height: 1.4;
        }
        .dj-promo-text strong {
          color: #9B7FE8;
          font-family: monospace;
          background: rgba(155, 127, 232, 0.15);
          padding: 1px 6px;
          border-radius: 3px;
        }

        /* DELIVERY STRIP */
        .dj-delivery-strip {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px;
          background: #FAF8FF;
          border: 1px solid #EDE8FA;
          border-radius: 8px;
        }
        .dj-delivery-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .dj-delivery-icon { font-size: 18px; flex-shrink: 0; }
        .dj-delivery-title {
          font-size: 12px;
          font-weight: 600;
          color: #2A1F4A;
          margin-bottom: 2px;
        }
        .dj-delivery-sub {
          font-size: 11px;
          color: #9B95B8;
          line-height: 1.4;
        }

        /* ACCORDIONS */
        .dj-accordions {
          border-top: 1px solid #EDE8FA;
          margin-bottom: 8px;
        }
        .dj-accordion {
          border-bottom: 1px solid #EDE8FA;
        }
        .dj-accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: #2A1F4A;
          cursor: pointer;
          list-style: none;
          text-transform: uppercase;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
        }
        .dj-accordion-header::-webkit-details-marker { display: none; }
        details[open] .dj-accordion-icon { transform: rotate(45deg); }
        .dj-accordion-icon {
          font-size: 20px;
          color: #9B7FE8;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          line-height: 1;
        }
        .dj-accordion-body {
          padding: 0 0 20px;
          font-size: 13px;
          line-height: 1.8;
          color: #9B95B8;
        }
        .dj-accordion-list {
          list-style: none;
          padding: 0;
        }
        .dj-accordion-list li {
          padding: 6px 0;
          border-bottom: 1px solid #F5F2FF;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .dj-accordion-list li::before {
          content: '✓';
          color: #9B7FE8;
          font-size: 11px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* SECTION HEADERS */
        .dj-section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .dj-section-eyebrow {
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #9B7FE8;
          font-weight: 300;
          margin-bottom: 10px;
          font-family: 'Space Mono', monospace;
        }
        .dj-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 300;
          color: #2A1F4A;
          line-height: 1.1;
        }

        /* RELATED PRODUCTS */
        .dj-related-section {
          padding: 60px 20px;
          background: #FAF8FF;
          border-top: 1px solid #EDE8FA;
        }

        /* REVIEWS */
        .dj-reviews-section {
          padding: 60px 20px 80px;
          background: #FEFCFF;
          border-top: 1px solid #EDE8FA;
        }
        .dj-rating-summary {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: #FAF8FF;
          border: 1px solid #EDE8FA;
          border-radius: 12px;
          margin-bottom: 32px;
          max-width: 300px;
        }
        .dj-rating-big {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          font-weight: 300;
          color: #2A1F4A;
          line-height: 1;
        }
        .dj-stars-big {
          font-size: 20px;
          color: #C9A96E;
          letter-spacing: -2px;
          margin-bottom: 4px;
        }
        .dj-rating-total {
          font-size: 11px;
          color: #9B95B8;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* NO REVIEWS STATE */
        .dj-no-reviews {
          text-align: center;
          padding: 60px 20px;
          border: 1.5px dashed #D4C8F0;
          border-radius: 12px;
          max-width: 480px;
          margin: 0 auto;
        }
        .dj-no-reviews-icon {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.6;
        }
        .dj-no-reviews-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 400;
          color: #2A1F4A;
          margin-bottom: 10px;
        }
        .dj-no-reviews-desc {
          font-size: 13px;
          color: #9B95B8;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .dj-review-btn {
          background: #2A1F4A;
          color: white;
          border: none;
          padding: 14px 32px;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.3s;
        }
        .dj-review-btn:hover { background: #9B7FE8; }
      `}</style>
    </div>
  )
}

export default ProductTemplate
