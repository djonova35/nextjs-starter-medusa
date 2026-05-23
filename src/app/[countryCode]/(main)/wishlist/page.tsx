"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type Variant = {
  id: string
  title: string
  inventory_quantity?: number
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code?: string
  }
  prices?: {
    amount: number
    currency_code: string
    region_id?: string
  }[]
}

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants?: Variant[]
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [regionId, setRegionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "gb"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || wishlist.length === 0) {
      setProducts([])
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const urlParams = new URLSearchParams()
        wishlist.forEach((id) => urlParams.append("id", id))
        urlParams.append("country_code", countryCode)

        const res = await fetch(
          `/api/wishlist-products?${urlParams.toString()}`
        )
        const data = await res.json()

        if (!res.ok) {
          setError(
            `Error ${res.status}: ${data.detail || data.error || "Unknown"}`
          )
          return
        }

        // Debug: log full variant data in browser console
        console.log("=== WISHLIST PRODUCTS ===")
        data.products?.forEach((p: any) => {
          console.log("Product:", p.title)
          p.variants?.forEach((v: any) => {
            console.log("  Variant:", v.title, {
              calculated_price: v.calculated_price,
              prices: v.prices,
            })
          })
        })

        setProducts(data.products || [])
        setRegionId(data.region_id || null)
      } catch (err) {
        setError("Could not load saved products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mounted, wishlist, countryCode])

  if (!mounted) return null

  return (
    <div style={{ minHeight: "100vh", background: "#FEFCFF" }}>

      {/* HEADER */}
      <div style={{
        textAlign: "center",
        padding: "60px 20px 40px",
        borderBottom: "1px solid #EDE8FA",
      }}>
        <p style={{
          fontSize: "10px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#9B7FE8",
          marginBottom: "12px",
          fontWeight: "300",
        }}>
          My Collection
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: "300",
          color: "#2A1F4A",
          marginBottom: "8px",
        }}>
          My Wishlist
        </h1>
        <p style={{ fontSize: "12px", color: "#9B95B8" }}>
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          maxWidth: "480px",
          margin: "0 auto",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🤍</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "28px",
            fontWeight: "400",
            color: "#2A1F4A",
            marginBottom: "12px",
          }}>
            Your wishlist is empty
          </h2>
          <p style={{
            fontSize: "13px",
            color: "#9B95B8",
            lineHeight: "1.7",
            marginBottom: "32px",
          }}>
            Save items you love by clicking the heart icon on any product
            card or product page.
          </p>
          <LocalizedClientLink
            href="/store"
            style={{
              background: "#2A1F4A",
              color: "white",
              padding: "14px 36px",
              fontSize: "11px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Start Shopping
          </LocalizedClientLink>
        </div>
      )}

      {/* LOADING */}
      {loading && wishlist.length > 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#9B95B8",
          fontSize: "13px",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💜</div>
          Loading your saved items...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#C06080",
          fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      {/* PRODUCT GRID - 3 columns desktop, 2 mobile */}
      {!loading && !error && products.length > 0 && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}>
          {/* Using CSS classes for responsive grid */}
          <div className="wishlist-grid">
            {products.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                regionId={regionId}
                countryCode={countryCode}
                onRemove={() => removeFromWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* NO PRODUCTS FOUND */}
      {!loading && !error && wishlist.length > 0 && products.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#9B95B8",
          fontSize: "13px",
        }}>
          <p>Could not load saved products. Please try refreshing.</p>
        </div>
      )}

      {/* Responsive grid styles */}
      <style>{`
        .wishlist-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 768px) {
          .wishlist-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

    </div>
  )
}

function WishlistCard({
  product,
  regionId,
  countryCode,
  onRemove,
}: {
  product: Product
  regionId: string | null
  countryCode: string
  onRemove: () => void
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [adding, setAdding] = useState(false)
  const [addedMsg, setAddedMsg] = useState<string | null>(null)
  const [addError, setAddError] = useState<string | null>(null)

  const variants = product.variants || []
  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const displayVariant = selectedVariant || variants[0]

  // calculated_price comes in minor units (pence)
  // but sometimes Medusa returns it already divided - we need to check
  const calculatedAmount =
    displayVariant?.calculated_price?.calculated_amount
  const originalAmount =
    displayVariant?.calculated_price?.original_amount

  // Raw prices array as fallback
  const rawPrices = displayVariant?.prices || []
  const fallbackPrice = rawPrices[0]?.amount

  // Use calculated first, fallback to raw prices
  const priceToShow = calculatedAmount ?? fallbackPrice

  const hasDiscount =
    originalAmount &&
    calculatedAmount &&
    calculatedAmount < originalAmount

  // Smart format - if amount looks already divided (small number) don't divide again
  const formatPrice = (amount: number) => {
    // If amount is less than 100, it might already be in major units
    // Medusa v2 always returns minor units (pence) so divide by 100
    return `£${(amount / 100).toFixed(2)}`
  }

  const handleAddToBag = async () => {
    if (!selectedVariantId) {
      setAddError("Please select a size / variant first")
      return
    }

    setAdding(true)
    setAddError(null)
    setAddedMsg(null)

    try {
      await addToCart({
        variantId: selectedVariantId,
        quantity: 1,
        countryCode: countryCode,
      })

      setAddedMsg("Added to bag! 🛍️")
      setTimeout(() => setAddedMsg(null), 3000)
    } catch (err: any) {
      console.error("Add to bag error:", err)
      setAddError(err.message || "Something went wrong")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{
      position: "relative",
      background: "white",
      border: "1px solid #EDE8FA",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* HEART REMOVE */}
      <button
        onClick={onRemove}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 10,
          width: "32px",
          height: "32px",
          background: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24"
          fill="#9B7FE8" stroke="#9B7FE8" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* IMAGE */}
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <div style={{
          aspectRatio: "3/4",
          background: "#F8F4FC",
          position: "relative",
          overflow: "hidden",
        }}>
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="hover:scale-105"
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              fontSize: "40px", opacity: 0.3,
            }}>
              👗
            </div>
          )}
        </div>
      </LocalizedClientLink>

      {/* INFO */}
      <div style={{
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
      }}>

        {/* TITLE */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          style={{ textDecoration: "none" }}
        >
          <p style={{
            fontSize: "13px",
            color: "#2A1F4A",
            fontWeight: "500",
            lineHeight: "1.3",
            margin: 0,
          }}>
            {product.title}
          </p>
        </LocalizedClientLink>

        {/* PRICE */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}>
          {hasDiscount ? (
            <>
              <span style={{
                fontSize: "14px",
                color: "#C06080",
                fontWeight: "600",
              }}>
                {formatPrice(calculatedAmount!)}
              </span>
              <span style={{
                fontSize: "12px",
                color: "#9B95B8",
                textDecoration: "line-through",
              }}>
                {formatPrice(originalAmount!)}
              </span>
              <span style={{
                fontSize: "10px",
                background: "#C06080",
                color: "white",
                padding: "2px 6px",
                borderRadius: "2px",
                fontWeight: "600",
              }}>
                SALE
              </span>
            </>
          ) : priceToShow !== undefined ? (
            <span style={{
              fontSize: "14px",
              color: "#2A1F4A",
              fontWeight: "500",
            }}>
              {formatPrice(priceToShow)}
            </span>
          ) : (
            <span style={{ fontSize: "12px", color: "#9B95B8" }}>
              Price unavailable
            </span>
          )}
        </div>

        {/* VARIANT DROPDOWN */}
        {variants.length > 0 && (
          <div style={{ position: "relative" }}>
            <select
              value={selectedVariantId}
              onChange={(e) => {
                setSelectedVariantId(e.target.value)
                setAddError(null)
                setAddedMsg(null)
              }}
              style={{
                width: "100%",
                padding: "9px 28px 9px 10px",
                fontSize: "11px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                border: addError && !selectedVariantId
                  ? "1px solid #C06080"
                  : "1px solid #EDE8FA",
                background: "white",
                color: selectedVariantId ? "#2A1F4A" : "#9B95B8",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                outline: "none",
              }}
            >
              <option value="">Select size / variant</option>
              {variants.map((variant) => {
                const outOfStock =
                  variant.inventory_quantity !== undefined &&
                  variant.inventory_quantity <= 0
                return (
                  <option
                    key={variant.id}
                    value={variant.id}
                    disabled={outOfStock}
                  >
                    {variant.title}
                    {outOfStock ? " – Out of stock" : ""}
                  </option>
                )
              })}
            </select>
            <div style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#9B95B8",
              fontSize: "9px",
            }}>
              ▼
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {addError && (
          <p style={{
            fontSize: "11px",
            color: "#C06080",
            margin: 0,
            textAlign: "center",
          }}>
            {addError}
          </p>
        )}
        {addedMsg && (
          <p style={{
            fontSize: "11px",
            color: "#6B9E6B",
            margin: 0,
            textAlign: "center",
            fontWeight: "500",
          }}>
            {addedMsg}
          </p>
        )}

        {/* ADD TO BAG */}
        <button
          onClick={handleAddToBag}
          disabled={adding}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            background: adding ? "#9B95B8" : "#2A1F4A",
            color: "white",
            border: "none",
            cursor: adding ? "not-allowed" : "pointer",
            transition: "background 0.3s",
            fontWeight: "500",
            marginTop: "auto",
          }}
        >
          {adding ? "Adding..." : "Add to Bag"}
        </button>

      </div>
    </div>
  )
}
