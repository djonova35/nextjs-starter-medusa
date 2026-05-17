"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#9B7FE8", marginBottom: "12px" }}>
          My Collection
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "300", color: "#2A1F4A" }}>
          My Wishlist
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", border: "1.5px dashed #D4C8F0", borderRadius: "12px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🤍</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: "400", color: "#2A1F4A", marginBottom: "10px" }}>
            Your wishlist is empty
          </h2>
          <p style={{ fontSize: "13px", color: "#9B95B8", marginBottom: "28px" }}>
            Save items you love by clicking the heart icon on any product.
          </p>
          <LocalizedClientLink
            href="/store"
            style={{ background: "#2A1F4A", color: "white", padding: "14px 32px", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}
          >
            Start Shopping
          </LocalizedClientLink>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#9B95B8", fontSize: "13px" }}>
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      )}
    </div>
  )
}
