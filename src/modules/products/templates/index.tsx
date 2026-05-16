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

  // Parse description into bullet points if it contains newlines or dashes
  const renderDescription = (description?: string | null) => {
    if (!description) return null

    const lines = description
      .split(/\n|•|-(?=\s)/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length <= 1) {
      return <p className="dj-description-text">{description}</p>
    }

    return (
      <ul className="dj-description-list">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="djonova-product-page">

      {/* ── 1. FULL WIDTH IMAGE GALLERY ── */}
      <div className="dj-gallery-wrap">
        <ImageGallery images={images} />
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

        {/* ── 3. PRODUCT ACTIONS (Price + Variant Selector + Add to Cart) ── */}
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

        {/* ── 4. PRODUCT DESCRIPTION ── */}
        {product.description && (
          <div className="dj-description-section">
            <h3 className="dj-description-title">Product Details</h3>
            {renderDescription(product.description)}
          </div>
        )}

        {/* ── 5. PROMO CODE BANNER ── */}
        <div className="dj-promo-banner">
          <span className="dj-promo-tag">🏷️</span>
          <span className="dj-promo-text">
            Use code <strong>DJNV20</strong> for 20% off your first order
          </span>
        </div>

        {/* ── 6. SHIPPING INFO ── */}
        <div className="dj-delivery-strip">

          {/* UK Delivery */}
          <div className="dj-delivery-item">
            <span className="dj-delivery-icon">🇬🇧</span>
            <div>
              <div className="dj-delivery-title">UK Standard Delivery</div>
              <div className="dj-delivery-sub">
                3 days processing · 2–7 days shipping
              </div>
              <div className="dj-delivery-sub dj-delivery-free">
                Free on orders over £40
              </div>
            </div>
          </div>

          {/* International Delivery */}
          <div className="dj-delivery-item">
            <span className="dj-delivery-icon">✈️</span>
            <div>
              <div className="dj-delivery-title">International Delivery</div>
              <div className="dj-delivery-sub">
                5 days processing · 7–14 days shipping
              </div>
            </div>
          </div>

          {/* Returns */}
          <div className="dj-delivery-item dj-delivery-item--full">
            <span className="dj-delivery-icon">↩️</span>
            <div>
              <div className="dj-delivery-title">Returns</div>
              <div className="dj-delivery-sub">
                14 days from delivery date ·{" "}
                <a
                  href="/return-policy"
                  className="dj-return-link"
                >
                  View Return Policy
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ── 7. ACCORDIONS ── */}
        <div className="dj-accordions">
          <ProductTabs product={product} />

          <details className="dj-accordion">
            <summary className="dj-accordion-header">
              <span>Material &amp; Care</span>
              <span className="dj-accordion-icon">+</span>
            </summary>
            <div className="dj-accordion-body">
              <p>
                Material information is listed per product. Please check the
                product description above for fabric composition and care
                instructions.
              </p>
            </div>
          </details>

          <details className="dj-accordion">
            <summary className="dj-accordion-header">
              <span>Delivery &amp; Returns</span>
              <span className="dj-accordion-icon">+</span>
            </summary>
            <div className="dj-accordion-body">
              <ul className="dj-accordion-list">
                <li>UK delivery: 3 days processing + 2–7 days shipping</li>
                <li>Free UK delivery on orders over £40</li>
                <li>
                  International delivery: 5 days processing + 7–14 days
                  shipping
                </li>
                <li>
                  Returns accepted within 14 days of delivery —{" "}
                  <a href="/return-policy" className="dj-return-link">
                    View Return Policy
                  </a>
                </li>
                <li>Items must be unworn and in original packaging</li>
              </ul>
            </div>
          </details>
        </div>

        {/* ── ONBOARDING CTA (dev only) ── */}
        <ProductOnboardingCta />

      </div>

      {/* ── 8. RELATED PRODUCTS ── */}
      <div className="dj-related-section">
        <div className="dj-section-header">
          <div className="dj-section-eyebrow">Style It With</div>
          <h2 className="dj-section-title">Complete the Look</h2>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>

      {/* ── 9. CUSTOMER REVIEWS ── */}
      <div className="dj-reviews-section">
        <div className="content-container">
          <div className="dj-section-header">
            <div className="dj-section-eyebrow">What They Say</div>
            <h2 className="dj-section-title">Customer Reviews</h2>
          </div>

          <div className="dj-rating-summary">
            <div className="dj-rating-big">0.0</div>
            <div>
              <div className="dj-stars-big">☆☆☆☆☆</div>
              <div className="dj-rating-total">No reviews yet</div>
            </div>
          </div>

          <div className="dj-no-reviews">
            <div className="dj-no-reviews-icon">✍️</div>
            <h3 className="dj-no-reviews-title">Be the first to review</h3>
            <p className="dj-no-reviews-desc">
              Share your thoughts on this product. Your review helps other
              shoppers make confident decisions.
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

        /* MAIN CONTENT */
        .dj-product-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 28px 20px 60px;
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

        /* DESCRIPTION */
        .dj-description-section {
          margin-bottom: 24px;
          padding: 20px;
          background: #FAF8FF;
          border: 1px solid #EDE8FA;
          border-radius: 8px;
        }
        .dj-description-title {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #9B7FE8;
          font-weight: 500;
          margin-bottom: 12px;
          font-family: 'Space Mono', monospace;
        }
        .dj-description-text {
          font-size: 13px;
          line-height: 1.8;
          color: #4A4066;
        }
        .dj-description-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .dj-description-list li {
          font-size: 13px;
          line-height: 1.8;
          color: #4A4066;
          padding: 5px 0;
          border-bottom: 1px solid #F0EBFF;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .dj-description-list li::before {
          content: '·';
          color: #9B7FE8;
          font-size: 18px;
          line-height: 1.4;
          flex-shrink: 0;
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
        /* Returns row spans full width */
        .dj-delivery-item--full {
          grid-column: 1 / -1;
          padding-top: 12px;
          border-top: 1px solid #EDE8FA;
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
          line-height: 1.6;
        }
        .dj-delivery-free {
          color: #7B5EA7;
          font-weight: 600;
          margin-top: 2px;
        }
        .dj-return-link {
          color: #9B7FE8;
          text-decoration: underline;
          cursor: pointer;
          font-size: 11px;
        }
        .dj-return-link:hover { color: #2A1F4A; }

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
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          color: #2A1F4A;
          cursor: pointer;
          list-style: none;
          text-transform: uppercase;
          font-family: 'Space Mono', monospace;
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
          margin: 0;
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
