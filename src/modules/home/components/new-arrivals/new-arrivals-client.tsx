"use client"

import { useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Tab = { key: string; label: string; tagMatch?: string[] }

const TABS: Tab[] = [
  { key: "all", label: "All" },
  { key: "footwear", label: "Footwear", tagMatch: ["footwear"] },
  { key: "mens", label: "Men's", tagMatch: ["mens", "men", "men's"] },
  { key: "womens", label: "Women's", tagMatch: ["womens", "women", "women's"] },
  { key: "tech", label: "Tech", tagMatch: ["tech", "tech-essentials"] },
]

// Heuristic to pick a category label from tags
function getCategoryLabel(product: HttpTypes.StoreProduct): string {
  const tagValues = (product.tags ?? []).map((t) => (t.value || "").toLowerCase())
  if (tagValues.some((v) => ["tech", "tech-essentials"].includes(v))) return "Tech Essentials"
  if (tagValues.some((v) => ["footwear"].includes(v))) return "Footwear"
  if (tagValues.some((v) => ["mens", "men", "men's"].includes(v))) return "Men's"
  if (tagValues.some((v) => ["womens", "women", "women's"].includes(v))) return "Women's"
  if (tagValues.some((v) => ["kids", "kids-toddlers"].includes(v))) return "Kids"
  return product.collection?.title ?? "DJONOVA"
}

// Get a fallback emoji from category
function getEmoji(product: HttpTypes.StoreProduct): string {
  const cat = getCategoryLabel(product).toLowerCase()
  if (cat.includes("tech")) return "🎧"
  if (cat.includes("foot")) return "👟"
  if (cat.includes("men")) return "🧥"
  if (cat.includes("women")) return "👗"
  if (cat.includes("kid")) return "🧸"
  return "✦"
}

// Extract color swatches from variants (looks for "Color" / "Colour" option)
function getColorSwatches(product: HttpTypes.StoreProduct): string[] {
  const colorOption = product.options?.find((o) =>
    ["color", "colour"].includes((o.title || "").toLowerCase())
  )
  if (!colorOption) return []
  const values = (colorOption.values ?? [])
    .map((v) => v.value)
    .filter(Boolean) as string[]
  return Array.from(new Set(values)).slice(0, 4).map(colorNameToHex)
}

// Map common color names → hex (extend as needed)
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    black: "#1a1a2e",
    white: "#f8f4f0",
    cream: "#f0e8e0",
    beige: "#c8a882",
    brown: "#3a3028",
    tan: "#c8a882",
    purple: "#8040c0",
    violet: "#6B4EE6",
    lilac: "#c4b5f0",
    blue: "#b0c8e8",
    navy: "#1a1a2e",
    red: "#c84040",
    pink: "#f0b0c8",
    green: "#6a9968",
    grey: "#9a9a9a",
    gray: "#9a9a9a",
  }
  const key = name.trim().toLowerCase()
  return map[key] ?? "#c4b5f0"
}

// Get cheapest variant price
function getPrices(product: HttpTypes.StoreProduct): {
  price: string | null
  oldPrice: string | null
} {
  const variants = product.variants ?? []
  let cheapest: any = null
  for (const v of variants) {
    const cp = (v as any).calculated_price
    if (!cp) continue
    if (!cheapest || cp.calculated_amount < cheapest.calculated_amount) {
      cheapest = cp
    }
  }
  if (!cheapest) return { price: null, oldPrice: null }

  const fmt = (amt: number, cur: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: (cur || "GBP").toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amt)

  const cur = cheapest.currency_code
  const price = fmt(cheapest.calculated_amount, cur)
  const oldPrice =
    cheapest.original_amount &&
    cheapest.original_amount > cheapest.calculated_amount
      ? fmt(cheapest.original_amount, cur)
      : null
  return { price, oldPrice }
}

// Decide badge (New / Sale / Tag)
function getBadge(product: HttpTypes.StoreProduct, hasSale: boolean): string | null {
  if (hasSale) return "Sale"
  const tagValues = (product.tags ?? []).map((t) => (t.value || "").toLowerCase())
  if (tagValues.includes("ss26")) return "SS26"
  if (tagValues.includes("tech") || tagValues.includes("tech-essentials")) return "Tech"
  // Created within last 14 days = "New"
  const created = product.created_at ? new Date(product.created_at).getTime() : 0
  const days = (Date.now() - created) / (1000 * 60 * 60 * 24)
  if (days <= 14) return "New"
  return null
}

export default function NewArrivalsClient({
  products,
  countryCode,
}: {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}) {
  const [activeTab, setActiveTab] = useState<string>("all")

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.key === activeTab)
    if (!tab || !tab.tagMatch) return products.slice(0, 4)
    const matches = products.filter((p) =>
      (p.tags ?? []).some((t) =>
        tab.tagMatch!.includes((t.value || "").toLowerCase())
      )
    )
    return matches.slice(0, 4)
  }, [activeTab, products])

  return (
    <section className="new-arrivals">
      <div className="container">
        <div className="arrivals-header">
          <div>
            <span className="section-label">Fresh In</span>
            <h2 className="section-heading">
              New
              <br />
              Arrivals
            </h2>
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
          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 0",
                color: "var(--warm-gray)",
                fontFamily: "'Space Mono', monospace",
                fontSize: ".8rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              No products in this category yet.
            </div>
          )}

          {filtered.map((product, i) => {
            const { price, oldPrice } = getPrices(product)
            const hasSale = !!oldPrice
            const badge = getBadge(product, hasSale)
            const colors = getColorSwatches(product)
            const category = getCategoryLabel(product)
            const emoji = getEmoji(product)
            const firstImage = product.thumbnail || product.images?.[0]?.url

            return (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                className={`product-card p${i + 1} fade-up fade-up-${i + 1}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-img">
                  <div className="product-img-bg"></div>
                  {firstImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={firstImage}
                      alt={product.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="product-img-icon">{emoji}</div>
                  )}
                  {badge && <span className="product-badge">{badge}</span>}
                  <div
                    className="product-wishlist"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    ♡
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-category">{category}</div>
                  <div className="product-name">{product.title}</div>
                  {colors.length > 0 && (
                    <div className="product-colors">
                      {colors.map((c, idx) => (
                        <div
                          key={idx}
                          className={`color-dot ${idx === 0 ? "active" : ""}`}
                          style={{ background: c }}
                        ></div>
                      ))}
                    </div>
                  )}
                  <div className="product-price-row">
                    <div className="product-price">
                      {price ?? "—"}
                      {oldPrice && <span className="old">{oldPrice}</span>}
                    </div>
                    <div className="product-rating">
                      <span className="stars">★★★★★</span> 4.9
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <LocalizedClientLink href="/store" className="btn btn-dark">
            View All Products →
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
