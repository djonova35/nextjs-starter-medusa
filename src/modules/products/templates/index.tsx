"use client"
import React, { Suspense, useState } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
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

  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  return (
    <>
      {/* IMAGE GALLERY */}
      <div className="dj-image-slider">
        <ImageGallery images={images ?? []} />
      </div>

      {/* PRODUCT INFO */}
      <div className="dj-product-info">
        <div className="dj-product-title">{product.title}</div>
        <div className="dj-promo-tag">
          🏷️ Use Code: DJNV20 for 20% off
        </div>
      </div>

      {/* PRICE + SIZE + ADD TO CART - Original Working Component */}
      <div className="dj-size-section">
        <Suspense
          fallback={
            <ProductActions
              disabled={true}
              product={product}
              region={region}
            />
          }
        >
          <ProductActionsWrapper
            id={product.id}
            region={region}
          />
        </Suspense>
      </div>

      {/* SHIPPING INFO */}
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

      {/* ACCORDIONS */}
      <div className="dj-accordion">
        {[
          {
            id: "details",
            title: "🧥 Product Details",
            content: product.description ||
              "Premium quality product from DJONOVA SS26 collection.",
          },
          {
            id: "material",
            title: "🧵 Material & Care",
            content: product.material ||
              "100% ethically sourced. Machine wash cold.",
          },
          {
            id: "sizing",
            title: "📏 Sizing Info",
            content:
              "Runs true to size. Check our size guide for measurements.",
          },
        ].map((item) => (
          <div key={item.id} className="dj-accordion-item">
            <div
              className="dj-accordion-header"
              onClick={() =>
                setOpenAccordion(
                  openAccordion === item.id ? null : item.id
                )
              }
            >
              {item.title}
              <span className="dj-accordion-icon">
                {openAccordion === item.id ? "∧" : "∨"}
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

      {/* STYLE IT WITH */}
      <div className="dj-complete-look">
        <div className="dj-section-title">✦ Style It With</div>
        <div className="dj-look-grid">
          {[
            { name: "AURA Low Pro", price: "£189", emoji: "👟" },
            { name: "NOVA Field Jacket", price: "£245", emoji: "🧥" },
            { name: "GRID Tech Bag", price: "£195", emoji: "🎒" },
            { name: "PULSE Pro Buds", price: "£129", emoji: "🎧" },
          ].map((item, i) => (
            <div key={i} className="dj-look-item">
              <div className="dj-look-img">
                <div style={{
                  width:"100%",height:"100%",
                  display:"flex",alignItems:"center",
                  justifyContent:"center",
                  fontSize:"2.5rem",
                  background:"#f5f5f5",
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

      {/* CUSTOMER REVIEWS */}
      <div className="dj-reviews">
        <div className="dj-reviews-title">Customer Reviews</div>

        {/* Write Review Form */}
        <div className="dj-write-review">
          <div className="dj-write-review-title">✍️ Write a Review</div>
          <form
            className="dj-review-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="dj-form-group">
              <label className="dj-form-label">Your Name</label>
              <input
                className="dj-form-input"
                type="text"
                placeholder="e.g. Sarah M."
              />
            </div>
            <div className="dj-form-group">
              <label className="dj-form-label">Rating</label>
              <div className="dj-star-select">
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className="dj-star-option">★</span>
                ))}
              </div>
            </div>
            <div className="dj-form-group">
              <label className="dj-form-label">Your Review</label>
              <textarea
                className="dj-form-textarea"
                placeholder="Tell us what you think..."
                rows={4}
              />
            </div>
            <button type="submit" className="dj-submit-review">
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews Summary */}
        <div className="dj-reviews-summary">
          <div className="dj-reviews-avg">4.9</div>
          <div>
            <div className="dj-reviews-stars">★★★★★</div>
            <div className="dj-reviews-count">Based on 47 reviews</div>
          </div>
        </div>

        {/* Sample Reviews */}
        {[
          {
            name: "Amara O.",
            date: "2 days ago",
            stars: "★★★★★",
            text: "Absolutely love this! Quality is amazing.",
          },
          {
            name: "Marcus T.",
            date: "1 week ago",
            stars: "★★★★★",
            text: "Fast shipping, beautiful packaging!",
          },
          {
            name: "Priya K.",
            date: "2 weeks ago",
            stars: "★★★★★",
            text: "So soft and comfortable. Many compliments!",
          },
        ].map((review, i) => (
          <div key={i} className="dj-review-item">
            <div className="dj-review-header">
              <span className="dj-reviewer-name">{review.name}</span>
              <span className="dj-review-date">{review.date}</span>
            </div>
            <div style={{color:"#f5a623",fontSize:"0.85rem",marginBottom:"6px"}}>
              {review.stars}
            </div>
            <div className="dj-review-body">{review.text}</div>
          </div>
        ))}
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div style={{
        padding:"24px 20px",
        background:"#fff",
        borderTop:"8px solid #f5f5f5",
      }}>
        <div className="dj-section-title">You May Also Like</div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts
            product={product}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
