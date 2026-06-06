"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"

type Tab = "favourites" | "recent"

type Props = {
  wishlistItems?: any[] // pass your wishlist items here (optional)
  cartItemIds?: string[] // to exclude from recommendations
}

export default function CartRecommendations({ wishlistItems = [], cartItemIds = [] }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("favourites")
  const { countryCode } = useParams()
  const scrollRef = useRef<HTMLDivElement>(null)

  const recentlyViewed = useRecentlyViewed(cartItemIds)

  const products = activeTab === "favourites" 
    ? wishlistItems.slice(0, 8) 
    : recentlyViewed.slice(0, 8)

  return (
    <>
    <style>{`
      .dj-recs-wrap {
        margin-top: 32px;
        margin-bottom: 32px;
      }
      .dj-recs-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .dj-recs-tabs::-webkit-scrollbar { display: none; }
      .dj-recs-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 9px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        border: 1.5px solid #E5E7EB;
        background: #fff;
        color: #6B7280;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      }
      .dj-recs-pill:hover {
        border-color: #18162B;
        color: #18162B;
      }
      .dj-recs-pill.active {
        background: #18162B;
        color: #fff;
        border-color: #18162B;
      }
      .dj-recs-pill-count {
        font-size: 11px;
        padding: 2px 7px;
        background: rgba(255,255,255,0.2);
        border-radius: 999px;
        font-weight: 700;
      }
      .dj-recs-pill:not(.active) .dj-recs-pill-count {
        background: #F4F2FA;
        color: #6B7280;
      }

      .dj-recs-scroll {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 8px;
      }
      .dj-recs-scroll::-webkit-scrollbar { display: none; }

      .dj-rec-card {
        flex: 0 0 160px;
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-decoration: none;
        color: inherit;
        transition: transform 0.15s ease;
      }
      .dj-rec-card:hover { transform: translateY(-2px); }

      .dj-rec-img-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 3/4;
        background: #F4F2FA;
        border-radius: 12px;
        overflow: hidden;
      }
      .dj-rec-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .dj-rec-fav {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(6px);
        border: none;
        border-radius: 999px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        transition: transform 0.15s ease;
      }
      .dj-rec-fav:hover { transform: scale(1.1); }

      .dj-rec-title {
        font-size: 12px;
        font-weight: 500;
        color: #18162B;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .dj-rec-price {
        font-size: 13px;
        font-weight: 700;
        color: #18162B;
      }

      .dj-recs-empty {
        padding: 32px 20px;
        text-align: center;
        background: #FAFAFA;
        border: 1px dashed #E5E7EB;
        border-radius: 14px;
        color: #6B7280;
        font-size: 13px;
      }
      .dj-recs-empty-icon {
        font-size: 28px;
        margin-bottom: 8px;
        display: block;
      }
      .dj-recs-empty-link {
        color: #7C3AED;
        font-weight: 600;
        text-decoration: none;
        margin-top: 6px;
        display: inline-block;
      }

      @media (min-width: 768px) {
        .dj-rec-card { flex: 0 0 180px; }
      }
    `}</style>

    <div className="dj-recs-wrap">
      {/* ── PILL TABS ── */}
      <div className="dj-recs-tabs">
        <button
          className={`dj-recs-pill ${activeTab === "favourites" ? "active" : ""}`}
          onClick={() => setActiveTab("favourites")}
        >
          ❤️ Favourites
          {wishlistItems.length > 0 && (
            <span className="dj-recs-pill-count">{wishlistItems.length}</span>
          )}
        </button>
        <button
          className={`dj-recs-pill ${activeTab === "recent" ? "active" : ""}`}
          onClick={() => setActiveTab("recent")}
        >
          👀 Recently Viewed
          {recentlyViewed.length > 0 && (
            <span className="dj-recs-pill-count">{recentlyViewed.length}</span>
          )}
        </button>
      </div>

      {/* ── PRODUCT CARDS ── */}
      {products.length > 0 ? (
        <div className="dj-recs-scroll" ref={scrollRef}>
          {products.map((p: any) => (
            <Link
              key={p.id}
              href={`/${countryCode}/products/${p.handle}`}
              className="dj-rec-card"
            >
              <div className="dj-rec-img-wrap">
                {p.thumbnail && (
                  <img src={p.thumbnail} alt={p.title} className="dj-rec-img" />
                )}
                <button
                  className="dj-rec-fav"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: toggle wishlist
                  }}
                  aria-label="Add to wishlist"
                >
                  {activeTab === "favourites" ? "❤️" : "🤍"}
                </button>
              </div>
              <div className="dj-rec-title">{p.title}</div>
              <div className="dj-rec-price">{p.price}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="dj-recs-empty">
          <span className="dj-recs-empty-icon">
            {activeTab === "favourites" ? "💝" : "✨"}
          </span>
          <div>
            {activeTab === "favourites"
              ? "No favourites yet"
              : "No recently viewed items"}
          </div>
          <Link href={`/${countryCode}/store`} className="dj-recs-empty-link">
            Discover products →
          </Link>
        </div>
      )}
    </div>
    </>
  )
}
