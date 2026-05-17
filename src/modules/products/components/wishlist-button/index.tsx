"use client"

import { useWishlist } from "@lib/context/wishlist-context"

export default function WishlistButton({ productId }: { productId: string }) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const wished = isInWishlist(productId)

  return (
    <button
      onClick={() => toggleWishlist(productId)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
        padding: "14px",
        marginTop: "10px",
        background: wished ? "#F0EBFF" : "transparent",
        border: `1px solid ${wished ? "#9B7FE8" : "#EDE8FA"}`,
        color: wished ? "#9B7FE8" : "#2A1F4A",
        fontSize: "11px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.3s",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "#9B7FE8" : "none"} stroke="#9B7FE8" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {wished ? "Saved to Wishlist" : "Add to Wishlist"}
    </button>
  )
}
