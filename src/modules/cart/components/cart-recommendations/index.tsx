"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"
import { useWishlist } from "@lib/context/wishlist-context"

type Tab = "suggested" | "favourites" | "recent"

type Props = {
  cartItemIds?: string[]
}

type DisplayProduct = {
  id: string
  handle: string
  title: string
  thumbnail: string
  price: string
}

// ── PRICE FORMATTER ──
function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`
  }
}

// ── MAP MEDUSA PRODUCT → DISPLAY PRODUCT ──
function mapMedusaProduct(p: any, fallbackCurrency = "gbp"): DisplayProduct {
  const variant = p.variants?.[0]
  const calc = variant?.calculated_price
  const amount = calc?.calculated_amount ?? 0
  const currency = calc?.currency_code || fallbackCurrency
  return {
    id: p.id,
    handle: p.handle || "",
    title: p.title || "",
    thumbnail: p.thumbnail || "",
    price: formatPrice(amount, currency),
  }
}

export default function CartRecommendations({ cartItemIds = [] }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("suggested")
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "gb"
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // ── DATA SOURCES ──
  const recentlyViewed = useRecentlyViewed(cartItemIds)
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()

  // ── FETCHED PRODUCTS STATE ──
  const [favouriteProducts, setFavouriteProducts] = useState<DisplayProduct[]>([])
  const [suggestedProducts, setSuggestedProducts] = useState<DisplayProduct[]>([])
  const [loadingFavs, setLoadingFavs] = useState(false)
  const [loadingSuggested, setLoadingSuggested] = useState(false)

  // ── FETCH WISHLIST PRODUCTS ──
  useEffect(() => {
    if (!wishlist.length) {
      setFavouriteProducts([])
      return
    }

    setLoadingFavs(true)
    const params = new URLSearchParams()
    wishlist.slice(0, 8).forEach((id) => params.append("id", id))
    params.append("country_code", countryCode)

    fetch(`/api/wishlist-products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        const products = (data.products || []).map((p: any) =>
          mapMedusaProduct(p, data.currency_code)
        )
        setFavouriteProducts(products)
      })
      .catch((e) => {
        console.error("Failed to load wishlist products:", e)
        setFavouriteProducts([])
      })
      .finally(() => setLoadingFavs(false))
  }, [wishlist, countryCode])

  // ── FETCH SUGGESTED PRODUCTS ──
  useEffect(() => {
    setLoadingSuggested(true)
    const params = new URLSearchParams()
    params.append("country_code", countryCode)
    params.append("limit", "8")
    cartItemIds.forEach((id) => params.append("exclude", id))

    fetch(`/api/recommended-products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        const products = (data.products || []).map((p: any) =>
          mapMedusaProduct(p, data.currency_code)
        )
        setSuggestedProducts(products)
      })
      .catch((e) => {
        console.error("Failed to load suggestions:", e)
        setSuggestedProducts([])
      })
      .finally(() => setLoadingSuggested(false))
  }, [countryCode, cartItemIds.join(",")])

  // ── RECENTLY VIEWED ──
  const recentDisplay: DisplayProduct[] = recentlyViewed.slice(0, 8).map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    thumbnail: p.thumbnail,
    price: p.price,
  }))

  const products =
    activeTab === "favourites"
      ? favouriteProducts
      : activeTab === "recent"
      ? recentDisplay
      : suggestedProducts

  const isLoading =
    (activeTab === "favourites" && loadingFavs) ||
    (activeTab === "suggested" && loadingSuggested)

  // ── ARROW LOGIC ──
  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateArrows)
    window.addEventListener("resize", updateArrows)
    return () => {
      el.removeEventListener("scroll", updateArrows)
      window.removeEventListener("resize", updateArrows)
    }
  }, [products.length, activeTab])

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <>
      <style>{`
        .dj-recs-wrap { margin-top: 32px; margin-bottom: 32px; width: 100%; }
        .dj-recs-tabs {
          display: flex; gap: 8px; margin-bottom: 16px;
          overflow-x: auto; scrollbar-width: none;
        }
        .dj-recs-tabs::-webkit-scrollbar { display: none; }
        .dj-recs-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 999px;
          font-size: 13px; font-weight: 600;
          border: 1.5px solid #E5E7EB; background: #fff; color: #6B7280;
          cursor: pointer; white-space: nowrap; transition: all 0.15s ease;
        }
        .dj-recs-pill:hover { border-color: #18162B; color: #18162B; }
        .dj-recs-pill.active {
          background: #18162B; color: #fff; border-color: #18162B;
        }
        .dj-recs-pill-count {
          font-size: 11px; padding: 2px 7px; background: rgba(255,255,255,0.2);
          border-radius: 999px; font-weight: 700;
        }
        .dj-recs-pill:not(.active) .dj-recs-pill-count {
          background: #F4F2FA; color: #6B7280;
        }

        .dj-recs-scroller { position: relative; }
        .dj-recs-scroll {
          display: flex; gap: 12px;
          overflow-x: auto; scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          padding-bottom: 8px; scroll-behavior: smooth;
        }
        .dj-recs-scroll::-webkit-scrollbar { display: none; }

        .dj-rec-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 38px; height: 38px; border-radius: 999px;
          background: #fff; border: 1px solid #E5E7EB;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: none; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px; color: #18162B;
          z-index: 5; transition: all 0.15s ease;
        }
        .dj-rec-arrow:hover {
          background: #18162B; color: #fff; border-color: #18162B;
          transform: translateY(-50%) scale(1.05);
        }
        .dj-rec-arrow.left { left: -16px; }
        .dj-rec-arrow.right { right: -16px; }
        .dj-rec-arrow.hidden { opacity: 0; pointer-events: none; }
        @media (min-width: 768px) { .dj-rec-arrow { display: flex; } }

        .dj-rec-card {
          flex: 0 0 160px; scroll-snap-align: start;
          display: flex; flex-direction: column; gap: 8px;
          text-decoration: none; color: inherit;
          transition: transform 0.15s ease;
        }
        .dj-rec-card:hover { transform: translateY(-2px); }

        .dj-rec-img-wrap {
          position: relative; width: 100%; aspect-ratio: 3/4;
          background: #F4F2FA; border-radius: 12px; overflow: hidden;
        }
        .dj-rec-img { width: 100%; height: 100%; object-fit: cover; }
        .dj-rec-fav {
          position: absolute; top: 8px; right: 8px;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(6px);
          border: none; border-radius: 999px;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 14px; transition: transform 0.15s ease;
        }
        .dj-rec-fav:hover { transform: scale(1.15); }

        .dj-rec-title {
          font-size: 12px; font-weight: 500; color: #18162B; line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .dj-rec-price { font-size: 13px; font-weight: 700; color: #18162B; }

        .dj-recs-empty {
          padding: 32px 20px; text-align: center;
          background: #FAFAFA; border: 1px dashed #E5E7EB;
          border-radius: 14px; color: #6B7280; font-size: 13px;
        }
        .dj-recs-empty-icon { font-size: 28px; margin-bottom: 8px; display: block; }
        .dj-recs-empty-link {
          color: #7C3AED; font-weight: 600; text-decoration: none;
          margin-top: 6px; display: inline-block;
        }

        .dj-recs-loading {
          display: flex; gap: 12px; overflow: hidden;
        }
        .dj-recs-skeleton {
          flex: 0 0 160px; aspect-ratio: 3/4;
          background: linear-gradient(90deg, #F4F2FA 0%, #EAE6F5 50%, #F4F2FA 100%);
          background-size: 200% 100%;
          border-radius: 12px;
          animation: dj-shimmer 1.4s infinite;
        }
        @keyframes dj-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (min-width: 768px) {
          .dj-rec-card { flex: 0 0 180px; }
          .dj-recs-skeleton { flex: 0 0 180px; }
        }
      `}</style>

      <div className="dj-recs-wrap">
        {/* ── PILL TABS ── */}
        <div className="dj-recs-tabs">
          <button
            className={`dj-recs-pill ${activeTab === "suggested" ? "active" : ""}`}
            onClick={() => setActiveTab("suggested")}
          >
            ✨ You May Also Like
            {suggestedProducts.length > 0 && (
              <span className="dj-recs-pill-count">{suggestedProducts.length}</span>
            )}
          </button>
          <button
            className={`dj-recs-pill ${activeTab === "favourites" ? "active" : ""}`}
            onClick={() => setActiveTab("favourites")}
          >
            ❤️ Favourites
            {wishlist.length > 0 && (
              <span className="dj-recs-pill-count">{wishlist.length}</span>
            )}
          </button>
          <button
            className={`dj-recs-pill ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            👀 Recently Viewed
            {recentDisplay.length > 0 && (
              <span className="dj-recs-pill-count">{recentDisplay.length}</span>
            )}
          </button>
        </div>

        {/* ── CONTENT ── */}
        {isLoading ? (
          <div className="dj-recs-loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dj-recs-skeleton" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="dj-recs-scroller">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Scroll left"
              className={`dj-rec-arrow left ${!canScrollLeft ? "hidden" : ""}`}
            >
              ←
            </button>

            <div className="dj-recs-scroll" ref={scrollRef}>
              {products.map((p) => {
                const wishlisted = isInWishlist(p.id)
                return (
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
                          e.stopPropagation()
                          toggleWishlist(p.id)
                        }}
                        aria-label="Toggle wishlist"
                      >
                        {wishlisted ? "❤️" : "🤍"}
                      </button>
                    </div>
                    <div className="dj-rec-title">{p.title}</div>
                    <div className="dj-rec-price">{p.price}</div>
                  </Link>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Scroll right"
              className={`dj-rec-arrow right ${!canScrollRight ? "hidden" : ""}`}
            >
              →
            </button>
          </div>
        ) : (
          <div className="dj-recs-empty">
            <span className="dj-recs-empty-icon">
              {activeTab === "favourites"
                ? "💝"
                : activeTab === "recent"
                ? "✨"
                : "🛍️"}
            </span>
            <div>
              {activeTab === "favourites"
                ? "No favourites yet — tap ❤️ on any product"
                : activeTab === "recent"
                ? "No recently viewed items"
                : "No suggestions available right now"}
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
