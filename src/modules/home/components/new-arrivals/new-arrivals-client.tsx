"use client"

import { useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useWishlist } from "@lib/context/wishlist-context"

type Tab = { key: string; label: string; tagMatch?: string[] }

const TABS: Tab[] = [
  { key: "all", label: "All" },
  { key: "footwear", label: "Footwear", tagMatch: ["footwear"] },
  { key: "mens", label: "Men's", tagMatch: ["mens", "men", "men's"] },
  { key: "womens", label: "Women's", tagMatch: ["womens", "women", "women's"] },
  { key: "tech", label: "Tech", tagMatch: ["tech", "tech-essentials"] },
]

// ─────────────────────────── helpers ───────────────────────────

function getCategoryLabel(product: HttpTypes.StoreProduct): string {
  const tagValues = (product.tags ?? []).map((t) => (t.value || "").toLowerCase())
  if (tagValues.some((v) => ["tech", "tech-essentials"].includes(v))) return "Tech Essentials"
  if (tagValues.some((v) => ["footwear"].includes(v))) return "Footwear"
  if (tagValues.some((v) => ["mens", "men", "men's"].includes(v))) return "Men's"
  if (tagValues.some((v) => ["womens", "women", "women's"].includes(v))) return "Women's"
  if (tagValues.some((v) => ["kids", "kids-toddlers"].includes(v))) return "Kids"
  return product.collection?.title ?? "DJONOVA"
}

function getColorSwatches(product: HttpTypes.StoreProduct): string[] {
  const colorOption = product.options?.find((o) =>
    ["color", "colour"].includes((o.title || "").toLowerCase())
  )
  if (!colorOption) return []
  const values = (colorOption.values ?? [])
    .map((v) => v.value)
    .filter(Boolean) as string[]
  return Array.from(new Set(values)).slice(0, 3).map(colorNameToHex)
}

function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    black: "#1a1a2e", white: "#f8f4f0", cream: "#f0e8e0", beige: "#c8a882",
    brown: "#3a3028", purple: "#8040c0", violet: "#6B4EE6", lilac: "#c4b5f0",
    blue: "#b0c8e8", navy: "#1a1a2e", red: "#c84040", green: "#6a9968",
  }
  return map[name.trim().toLowerCase()] ?? "#c4b5f0"
}

function getPrices(product: HttpTypes.StoreProduct): {
  price: string | null
  oldPrice: string | null
  fromLabel: boolean
} {
  const variants = product.variants ?? []
  const calcs = variants
    .map((v) => (v as any).calculated_price)
    .filter((cp) => cp && typeof cp.calculated_amount === "number")

  if (calcs.length === 0) return { price: null, oldPrice: null, fromLabel: false }

  const cheapest = calcs.reduce((a, b) => (a.calculated_amount <= b.calculated_amount ? a : b))
  const mostExpensive = calcs.reduce((a, b) => (a.calculated_amount >= b.calculated_amount ? a : b))

  const fmt = (amt: number, cur: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: (cur || "GBP").toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amt)

  return {
    price: fmt(cheapest.calculated_amount, cheapest.currency_code),
    oldPrice: cheapest.original_amount > cheapest.calculated_amount 
      ? fmt(cheapest.original_amount, cheapest.currency_code) 
      : null,
    fromLabel: mostExpensive.calculated_amount > cheapest.calculated_amount
  }
}

function getBadge(product: HttpTypes.StoreProduct, hasSale: boolean): string | null {
  if (hasSale) return "Sale"
  const tagValues = (product.tags ?? []).map((t) => (t.value || "").toLowerCase())
  if (tagValues.includes("ss26")) return "SS26"
  if (tagValues.includes("tech")) return "Tech"
  const created = product.created_at ? new Date(product.created_at).getTime() : 0
  if ((Date.now() - created) / (1000 * 60 * 60 * 24) <= 14) return "New"
  return null
}

// ─────────────────────────── component ───────────────────────────

export default function NewArrivalsClient({
  products,
}: {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const { isInWishlist, toggleWishlist } = useWishlist()

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.key === activeTab)
    const matches = (!tab || !tab.tagMatch) 
      ? products 
      : products.filter((p) => (p.tags ?? []).some((t) => tab.tagMatch!.includes((t.value || "").toLowerCase())))
    return matches.slice(0, 4)
  }, [activeTab, products])

  return (
    <section className="new-arrivals">
      <div className="container">
        <div className="arrivals-header">
          <div>
            <span className="section-label">Fresh In</span>
            <h2 className="section-heading">New<br />Arrivals</h2>
          </div>
          <div className="arrivals-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab-pill ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filtered.map((product, i) => {
            const { price, oldPrice, fromLabel } = getPrices(product)
            const badge = getBadge(product, !!oldPrice)
            const colors = getColorSwatches(product)
            const isWished = isInWishlist(product.id)

            return (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                className={`product-card p${i + 1} fade-up fade-up-${i + 1}`}
              >
                <div className="product-img">
                  <div className="product-img-bg"></div>
                  {product.thumbnail && (
                    <img src={product.thumbnail} alt={product.title} className="actual-product-image" 
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  )}
                  {badge && <span className="product-badge">{badge}</span>}
                  
                  <button
                    className="product-wishlist"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s',
                      background: isWished ? 'rgba(155, 127, 232, 0.1)' : 'white'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" 
                      fill={isWished ? "#9B7FE8" : "none"} 
                      stroke="#9B7FE8" strokeWidth="1.5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                <div className="product-info">
                  <div className="product-category">{getCategoryLabel(product)}</div>
                  <div className="product-name">{product.title}</div>
                  
                  {colors.length > 0 && (
                    <div className="product-colors">
                      {colors.map((c, idx) => (
                        <div key={idx} className={`color-dot ${idx === 0 ? 'active' : ''}`} style={{ background: c }}></div>
                      ))}
                    </div>
                  )}

                  <div className="product-price-row">
                    <div className="product-price">
                      {fromLabel && <span style={{ fontSize: '0.65em', color: '#8A82A8', marginRight: '4px', textTransform: 'uppercase' }}>From</span>}
                      {price}
                      {oldPrice && <span className="old">{oldPrice}</span>}
                    </div>
                    <div className="product-rating"><span className="stars">★★★★★</span> 4.9</div>
                  </div>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <LocalizedClientLink href="/store" className="btn btn-dark">View All Products →</LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
