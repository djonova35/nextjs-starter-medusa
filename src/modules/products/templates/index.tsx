import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import RelatedProducts from "@modules/products/components/related-products"
// ProductInfo is no longer needed here as we will render title/subtitle directly
// import ProductInfo from "@modules/products/templates/product-info" // Removed this import
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

      {/* ── 1. IMAGE GALLERY ── */}
      <div className="dj-gallery-wrap">
        <ImageGallery images={images} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dj-product-content">

        {/* ── 2. PRODUCT TITLE + SUBTITLE + RATING ── */}
        <div className="dj-name-section">
          <h1 className="dj-product-title">{product.title}</h1>
          {product.subtitle && (
            <p className="dj-product-subtitle">{product.subtitle}</p>
          )}
          <div className="dj-rating-row">
            <span className="dj-stars">★★★★★</span>
            <span className="dj-rating-count">Be the first to review</span>
          </div>
        </div>

        {/* ── 3. PRODUCT ACTIONS (Price + Variants + Add to Cart) ── */}
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

        {/* ── 4. PROMO BANNER ── */}
        <div className="dj-promo-banner">
          <span className="dj-promo-tag">🏷️</span>
          <span className="dj-promo-text">
            Use code <strong>DJNV20</strong> for 20% off your first order
          </span>
        </div>

        {/* ── 5. DELIVERY STRIP ── */}
        <div className="dj-delivery-strip">
          <div className="dj-delivery-item">
            <span className="dj-delivery-icon">🇬🇧</span>
            <div>
              <div className="dj-delivery-title">UK Standard Delivery</div>
              <div className="dj-delivery-sub">
                3 days processing · 2–7 days shipping
              </div>
              <div className="dj-delivery-free">
                Free on orders over £40
              </div>
            </div>
          </div>

          <div className="dj-delivery-item">
            <span className="dj-delivery-icon">✈️</span>
            <div>
              <div className="dj-delivery-title">International Delivery</div>
              <div className="dj-delivery-sub">
                5 days processing · 7–14 days shipping
              </div>
            </div>
          </div>

          <div className="dj-delivery-item dj-delivery-item--full">
            <span className="dj-delivery-icon">↩️</span>
            <div>
              <div className="dj-delivery-title">Returns</div>
              <div className="dj-delivery-sub">
                14 days from delivery date ·{" "}
                <a href="/return-policy" className="dj-return-link">
                  View Return Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. ACCORDIONS ── */}
        <div className="dj-accordions">

          {/* Product Details — reads directly from your Medusa description */}
          <details className="dj-accordion">
            <summary className="dj-accordion-header">
              <span>Product Details</span>
              <span className="dj-accordion-icon">+</span>
            </summary>
            <div className="dj-accordion-body">
              {product.description ? (
                // Changed to use p tags for each line, separated by br, for better semantics
                product.description.split("\n").map((line, i) => (
                  <p key={i} className="dj-description-text">
                    {line}
                  </p>
                ))
              ) : (
                <p className="dj-description-text">
                  No description available.
                </p>
              )}
            </div>
          </details>

          {/* Material & Care */}
          <details className="dj-accordion">
            <summary className="dj-accordion-header">
              <span>Material &amp; Care</span>
              <span className="dj-accordion-icon">+</span>
            </summary>
            <div className="dj-accordion-body">
              <p className="dj-description-text">
                Please refer to the product details above for fabric
                composition and care instructions specific to this item.
              </p>
            </div>
          </details>

          {/* Delivery & Returns */}
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
                  Returns accepted within 14 days of delivery ·{" "}
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

      {/* ── 7. RELATED PRODUCTS ── */}
      <div className="dj-related-section">
        <div className="dj-section-header">
          <div className="dj-section-eyebrow">Style It With</div>
          <h2 className="dj-section-title">Complete the Look</h2>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>

      {/* ── 8. CUSTOMER REVIEWS ── */}
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

        /* ── BASE ── */
        .djonova-product-page {
          background: #FEFCFF;
          min-height: 100vh;
        }

        /* ── GALLERY ── */
        .dj-gallery-wrap {
          width: 100%;
          background: #F8F4FC;
        }

        /* ── MAIN CONTENT ── */
        .dj-product-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 28px 20px 60px;
        }

        /* ── NAME + RATING ── */
        .dj-name-section {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #EDE8FA;
        }
        .dj-product-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 6vw, 36px);
          font-weight: 500;
          color: #2A1F4A;
          line-height: 1.1;
          margin: 0 0 8px 0;
        }
        .dj-product-subtitle {
          font-size: 14px;
          color: #6C6285;
          margin: 0 0 12px 0;
        }
        .dj-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
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

        /* ── PRICE / ACTIONS ── */
        .dj-price-section {
          margin-bottom: 24px;
        }

        /* ── PROMO BANNER ── */
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
        .dj-promo-tag {
          font-size: 16px;
          flex-shrink: 0;
        }
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

        /* ── DELIVERY STRIP ── */
        .dj-delivery-strip {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
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
        .dj-delivery-item--full {
          grid-column: 1 / -1;
          padding-top: 14px;
          border-top: 1px solid #EDE8FA;
        }
        .dj-delivery-icon {
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .dj-delivery-title {
          font-size: 12px;
          font-weight: 600;
          color: #2A1F4A;
          margin-bottom: 3px;
        }
        .dj-delivery-sub {
          font-size: 11px;
          color: #9B95B8;
          line-height: 1.6;
        }
        .dj-delivery-free {
          font-size: 11px;
          font-weight: 600;
          color: #7B5EA7;
          margin-top: 3px;
        }
        .dj-return-link {
          color: #9B7FE8;
          text-decoration: underline;
          cursor: pointer;
          font-size: 11px;
        }
        .dj-return-link:hover {
          color: #2A1F4A;
        }

        /* ── ACCORDIONS ── */
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
        .dj-accordion-header::-webkit-details-marker {
          display: none;
        }
        details[open] .dj-accordion-icon {
          transform: rotate(45deg);
        }
        .dj-accordion-icon {
          font-size: 20px;
          color: #9B7FE8;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          line-height: 1;
        }
        .dj-accordion-body {
          padding: 4px 0 20px;
        }
        .dj-description-text {
          font-size: 14px;
          line-height: 1.9;
          color: #4A4066;
          margin-bottom: 10px; /* Add some space between paragraphs */
          white-space: pre-wrap; /* Preserve whitespace including newlines */
          word-break: break-word;
        }
        .dj-description-text:last-child {
            margin-bottom: 0; /* No margin on the last paragraph */
        }

        .dj-accordion-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .dj-accordion-list li {
          font-size: 13px;
          color: #9B95B8;
          line-height: 1.8;
          padding: 7px 0;
          border-bottom: 1px solid #F5F2FF;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .dj-accordion-list li:last-child {
          border-bottom: none;
        }
        .dj-accordion-list li::before {
          content: '✓';
          color: #9B7FE8;
          font-size: 11px;
          margin-top: 3px;
          flex-shrink: 0;
        }

        /* ── SECTION HEADERS ── */
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

        /* ── RELATED PRODUCTS ── */
        .dj-related-section {
          padding: 60px 20px;
          background: #FAF8FF;
          border-top: 1px solid #EDE8FA;
        }

        /* ── REVIEWS ── */
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
        .dj-review-btn:hover {
          background: #9B7FE8;
        }

      `}</style>
    </div>
  )
}

export default ProductTemplate
