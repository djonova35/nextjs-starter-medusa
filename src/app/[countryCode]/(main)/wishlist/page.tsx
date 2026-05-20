"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useEffect, useState } from "react"

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants?: {
    calculated_price?: {
      calculated_amount: number
    }
  }[]
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        if (!backendUrl || !publishableKey) {
          setError("Store configuration missing")
          return
        }

       console.log("wishlist:", wishlist)
        const params = new URLSearchParams()
        wishlist.forEach((id) => params.append("id", id))

        const url = `${backendUrl}/store/products?${params.toString()}`

        const res = await fetch(url, {
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        })

        if (!res.ok) {
          setError(`Failed to load products (${res.status})`)
          return
        }

        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        setError("Could not load saved products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mounted, wishlist])

  if (!mounted) return null

  return (
    <div style={{ minHeight: "100vh", background: "#FEFCFF" }}>

      {/* ── HEADER ── */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px 40px",
          borderBottom: "1px solid #EDE8FA",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#9B7FE8",
            marginBottom: "12px",
            fontWeight: "300",
          }}
        >
          My Collection
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: "300",
            color: "#2A1F4A",
            marginBottom: "8px",
          }}
        >
          My Wishlist
        </h1>
        <p style={{ fontSize: "12px", color: "#9B95B8" }}>
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* ── EMPTY STATE ── */}
      {wishlist.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🤍</div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: "400",
              color: "#2A1F4A",
              marginBottom: "12px",
            }}
          >
            Your wishlist is empty
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#9B95B8",
              lineHeight: "1.7",
              marginBottom: "32px",
            }}
          >
            Save items you love by clicking the heart icon on any product card
            or product page.
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

      {/* ── LOADING ── */}
      {loading && wishlist.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#9B95B8",
            fontSize: "13px",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💜</div>
          Loading your saved items...
        </div>
      )}

      {/* ── ERROR ── */}
      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#C06080",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      {!loading && !error && products.length > 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "24px",
            }}
          >
            {products.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={() => removeFromWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── NO PRODUCTS FOUND (IDs saved but fetch returned nothing) ── */}
      {!loading && !error && wishlist.length > 0 && products.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#9B95B8",
            fontSize: "13px",
          }}
        >
          <p>Could not load saved products. Please try refreshing the page.</p>
        </div>
      )}

    </div>
  )
}

function WishlistCard({
  product,
  onRemove,
}: {
  product: Product
  onRemove: () => void
}) {
  const price = product.variants?.[0]?.calculated_price?.calculated_amount

  return (
    <div
      style={{
        position: "relative",
        background: "white",
        border: "1px solid #EDE8FA",
        overflow: "hidden",
        transition: "box-shadow 0.3s",
      }}
    >
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
        title="Remove from wishlist"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#9B7FE8"
          stroke="#9B7FE8"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* IMAGE */}
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <div
          style={{
            aspectRatio: "3/4",
            background: "#F8F4FC",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              className="hover:scale-105"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                opacity: 0.3,
              }}
            >
              👗
            </div>
          )}
        </div>
      </LocalizedClientLink>

      {/* INFO */}
      <div style={{ padding: "12px" }}>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          style={{ textDecoration: "none" }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#2A1F4A",
              fontWeight: "500",
              marginBottom: "4px",
              lineHeight: "1.3",
            }}
          >
            {product.title}
          </p>
        </LocalizedClientLink>

        {price && (
          <p
            style={{
              fontSize: "13px",
              color: "#9B7FE8",
              fontWeight: "400",
              marginBottom: "10px",
            }}
          >
            £{(price / 100).toFixed(2)}
          </p>
        )}

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "9px",
            background: "#2A1F4A",
            color: "white",
            fontSize: "10px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            textDecoration: "none",
            marginBottom: "6px",
            transition: "background 0.3s",
          }}
        >
          View Product
        </LocalizedClientLink>

        <button
          onClick={onRemove}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "10px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            background: "transparent",
            border: "1px solid #EDE8FA",
            color: "#9B95B8",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
