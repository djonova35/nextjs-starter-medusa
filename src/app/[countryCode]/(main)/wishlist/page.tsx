"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState } from "react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div style={{ minHeight: "100vh", background: "#FEFCFF" }}>
      
      {/* HEADER */}
      <div style={{ textAlign: "center", padding: "60px 20px 40px", borderBottom: "1px solid #EDE8FA" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#9B7FE8", marginBottom: "12px", fontWeight: "300" }}>
          My Collection
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "300", color: "#2A1F4A", marginBottom: "8px" }}>
          My Wishlist
        </h1>
        <p style={{ fontSize: "12px", color: "#9B95B8" }}>
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🤍</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: "400", color: "#2A1F4A", marginBottom: "12px" }}>
            Your wishlist is empty
          </h2>
          <p style={{ fontSize: "13px", color: "#9B95B8", lineHeight: "1.7", marginBottom: "32px" }}>
            Save items you love by clicking the heart icon on any product card or product page.
          </p>
          <LocalizedClientLink
            href="/store"
            style={{ background: "#2A1F4A", color: "white", padding: "14px 36px", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", textDecoration: "none", display: "inline-block", transition: "background 0.3s" }}
          >
            Start Shopping
          </LocalizedClientLink>
        </div>
      )}

      {/* SAVED PRODUCTS */}
      {wishlist.length > 0 && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
            {wishlist.map((productId) => (
              <WishlistCard
                key={productId}
                productId={productId}
                onRemove={() => removeFromWishlist(productId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function WishlistCard({ productId, onRemove }: { productId: string, onRemove: () => void }) {
  return (
    <div style={{ position: "relative", background: "white", border: "1px solid #EDE8FA", borderRadius: "4px", overflow: "hidden" }}>
      
      {/* REMOVE BUTTON */}
      <button
        onClick={onRemove}
        style={{ position: "absolute", top: "8px", right: "8px", zIndex: 10, width: "32px", height: "32px", background: "white", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        title="Remove from wishlist"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#9B7FE8" stroke="#9B7FE8" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* PRODUCT IMAGE PLACEHOLDER */}
      <div style={{ aspectRatio: "3/4", background: "#F8F4FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "32px", opacity: 0.3 }}>👗</span>
      </div>

      {/* PRODUCT INFO */}
      <div style={{ padding: "12px" }}>
        <p style={{ fontSize: "11px", color: "#9B95B8", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Saved item</p>
        <LocalizedClientLink
          href={`/store`}
          style={{ fontSize: "12px", color: "#2A1F4A", textDecoration: "none", fontWeight: "500", display: "block", marginBottom: "10px" }}
        >
          View Product →
        </LocalizedClientLink>
        <button
          onClick={onRemove}
          style={{ width: "100%", padding: "8px", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", background: "transparent", border: "1px solid #EDE8FA", color: "#9B95B8", cursor: "pointer" }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
