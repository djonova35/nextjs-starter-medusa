"use client"

export default function SearchOverlay() {
  const closeOverlay = () => {
    document.getElementById("dj-search-overlay")?.classList.add("hidden")
  }

  const openOverlay = () => {
    document.getElementById("dj-search-overlay")?.classList.remove("hidden")
    setTimeout(() => {
      document.getElementById("dj-search-input")?.focus()
    }, 50)
  }

  return (
    <>
      {/* SEARCH BUTTON */}
      <button
        onClick={openOverlay}
        className="hover:text-purple-500 transition-colors p-1"
        title="Search"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* SEARCH OVERLAY */}
      <div
        id="dj-search-overlay"
        className="hidden fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      >
        <div className="bg-white w-full max-w-2xl shadow-2xl">
          <div className="flex items-center border-b border-gray-100 px-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9B7FE8"
              strokeWidth="1.5"
              className="flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              id="dj-search-input"
              type="text"
              placeholder="Search products, categories..."
              autoComplete="off"
              style={{
                flex: 1,
                padding: "16px 12px",
                fontSize: "14px",
                border: "none",
                outline: "none",
                color: "#2A1F4A",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) {
                    window.location.href = `/store?q=${encodeURIComponent(val)}`
                  }
                }
                if (e.key === "Escape") {
                  closeOverlay()
                }
              }}
            />

            <button
              onClick={closeOverlay}
              style={{
                padding: "8px",
                color: "#9B95B8",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: "16px 20px" }}>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#9B95B8",
                marginBottom: "12px",
              }}
            >
              Popular
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Dresses", "Shoes", "Jackets", "Tech", "Accessories"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() =>
                      (window.location.href = `/store?q=${term}`)
                    }
                    style={{
                      padding: "6px 14px",
                      fontSize: "11px",
                      border: "1px solid #EDE8FA",
                      background: "transparent",
                      color: "#2A1F4A",
                      cursor: "pointer",
                      borderRadius: "20px",
                    }}
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
