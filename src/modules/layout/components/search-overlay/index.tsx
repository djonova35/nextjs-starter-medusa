"use client"

import { useState, useEffect, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants?: { calculated_price?: { calculated_amount: number } }[]
}

export default function SearchOverlay() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const closeOverlay = () => {
    document.getElementById("dj-search-overlay")?.classList.add("hidden")
    setQuery("")
    setResults([])
  }

  const openOverlay = () => {
    document.getElementById("dj-search-overlay")?.classList.remove("hidden")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        const res = await fetch(
          `${backendUrl}/store/products?q=${encodeURIComponent(query)}&limit=6&fields=id,title,handle,thumbnail`,
          {
            headers: {
              "x-publishable-api-key": publishableKey || "",
            },
          }
        )
        const data = await res.json()
        setResults(data.products || [])
      } catch (err) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/store?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <>
      {/* SEARCH BUTTON */}
      <button
        onClick={openOverlay}
        className="hover:text-purple-500 transition-colors p-1"
        title="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>

      {/* OVERLAY */}
      <div
        id="dj-search-overlay"
        className="hidden fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
        onClick={(e) => { if (e.target === e.currentTarget) closeOverlay() }}
      >
        <div className="bg-white w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden">

          {/* INPUT ROW */}
          <div className="flex items-center border-b border-gray-100 px-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B7FE8" strokeWidth="1.5" className="flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              id="dj-search-input"
              type="text"
              value={query}
              placeholder="Search products..."
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, padding: "16px 12px", fontSize: "14px", border: "none", outline: "none", color: "#2A1F4A" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
                if (e.key === "Escape") closeOverlay()
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ padding: "4px 8px", color: "#9B95B8", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                ✕
              </button>
            )}
            <button
              onClick={closeOverlay}
              style={{ padding: "8px", color: "#9B95B8", background: "none", border: "none", cursor: "pointer", fontSize: "20px", marginLeft: "4px" }}
            >
              ✕
            </button>
          </div>

          {/* LIVE RESULTS */}
          {query.length >= 2 && (
            <div>
              {loading && (
                <div style={{ padding: "20px", textAlign: "center", color: "#9B95B8", fontSize: "12px" }}>
                  Searching...
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <p style={{ padding: "12px 20px 8px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9B95B8" }}>
                    Products
                  </p>
                  <ul>
                    {results.map((product) => (
                      <li key={product.id}>
                        <LocalizedClientLink
                          href={`/products/${product.handle}`}
                          onClick={closeOverlay}
                          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px", textDecoration: "none", transition: "background 0.15s" }}
                          className="hover:bg-purple-50"
                        >
                          {/* THUMBNAIL */}
                          <div style={{ width: "48px", height: "60px", flexShrink: 0, background: "#F8F4FC", position: "relative", overflow: "hidden" }}>
                            {product.thumbnail ? (
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                sizes="48px"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👗</div>
                            )}
                          </div>
                          {/* INFO */}
                          <div>
                            <p style={{ fontSize: "13px", color: "#2A1F4A", fontWeight: "500", marginBottom: "2px" }}>
                              {product.title}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9B7FE8" }}>
                              View product →
                            </p>
                          </div>
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                  {/* SEE ALL */}
                  <div style={{ borderTop: "1px solid #EDE8FA", padding: "12px 20px" }}>
                    <button
                      onClick={handleSearch}
                      style={{ width: "100%", padding: "10px", background: "#2A1F4A", color: "white", border: "none", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      See all results for &ldquo;{query}&rdquo;
                    </button>
                  </div>
                </div>
              )}

              {!loading && results.length === 0 && (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#9B95B8" }}>No products found for &ldquo;{query}&rdquo;</p>
                  <p style={{ fontSize: "11px", color: "#C4B8D8", marginTop: "4px" }}>Try different keywords</p>
                </div>
              )}
            </div>
          )}

          {/* DEFAULT STATE — popular searches */}
          {query.length < 2 && (
            <div style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9B95B8", marginBottom: "12px" }}>
                Popular
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Dresses", "Shoes", "Jackets", "Tech", "Accessories"].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    style={{ padding: "6px 14px", fontSize: "11px", border: "1px solid #EDE8FA", background: "transparent", color: "#2A1F4A", cursor: "pointer", borderRadius: "20px" }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
