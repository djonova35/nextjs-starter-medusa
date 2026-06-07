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
          top: -6px;
          right: -8px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background: #7C3AED;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          box-sizing: content-box;
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
