"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useWishlist } from "@lib/context/wishlist-context"

export default function WishlistButton() {
  const { wishlist } = useWishlist()
  const count = wishlist.length

  return (
    <>
      <style>{`
        .dj-nav-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          transition: color 0.15s ease;
        }
        .dj-nav-icon:hover { color: #7C3AED; }
        .dj-nav-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: #7C3AED;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
  border-radius: 999px;
  border: 1.5px solid #fff;
  box-sizing: content-box;
  pointer-events: none;
}
      `}</style>

      <LocalizedClientLink
        href="/wishlist"
        className="dj-nav-icon"
        title="Wishlist"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {count > 0 && (
          <span className="dj-nav-badge">{count > 99 ? "99+" : count}</span>
        )}
      </LocalizedClientLink>
    </>
  )
}
