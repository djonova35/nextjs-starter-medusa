import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">
  <nav className="content-container flex items-center justify-between w-full h-12 text-small-regular">
    
    {/* LEFT — hamburger */}
    <div className="flex items-center">
      <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
    </div>

    {/* CENTER — logo pushed left like boohoo */}
    <div className="absolute left-1/2 -translate-x-1/2 small:static small:translate-x-0 small:left-auto">
      <LocalizedClientLink
        href="/"
        data-testid="nav-store-link"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "18px",
          fontWeight: "300",
          letterSpacing: "8px",
          textTransform: "uppercase",
          color: "#2A1F4A",
          textDecoration: "none",
        }}
      >
        DJONOVA
      </LocalizedClientLink>
    </div>

    {/* RIGHT — icons tight together */}
    <div className="flex items-center gap-x-3 h-full">

      {/* SEARCH */}
      <button
        onClick={() => document.getElementById("dj-search-overlay")?.classList.remove("hidden")}
        className="hover:text-purple-500 transition-colors p-1"
        title="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>

      {/* ACCOUNT */}
      <LocalizedClientLink href="/account" className="hover:text-purple-500 transition-colors p-1" title="Account" data-testid="nav-account-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </LocalizedClientLink>

      {/* WISHLIST */}
      <LocalizedClientLink href="/wishlist" className="hover:text-purple-500 transition-colors p-1" title="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </LocalizedClientLink>

      {/* CART */}
      <Suspense
        fallback={
          <LocalizedClientLink className="hover:text-purple-500 transition-colors p-1" href="/cart" data-testid="nav-cart-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </LocalizedClientLink>
        }
      >
        <CartButton />
      </Suspense>

    </div>
  </nav>
</header>

{/* SEARCH OVERLAY */}
<div id="dj-search-overlay" className="hidden fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
  <div className="bg-white w-full max-w-2xl shadow-2xl">
    <div className="flex items-center border-b border-gray-100 px-4">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B7FE8" strokeWidth="1.5" className="flex-shrink-0">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        id="dj-search-input"
        type="text"
        placeholder="Search products, categories..."
        autoComplete="off"
        style={{ flex: 1, padding: "16px 12px", fontSize: "14px", border: "none", outline: "none", color: "#2A1F4A" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = (e.target as HTMLInputElement).value.trim()
            if (val) window.location.href = `/store?q=${encodeURIComponent(val)}`
          }
          if (e.key === "Escape") {
            document.getElementById("dj-search-overlay")?.classList.add("hidden")
          }
        }}
      />
      <button
        onClick={() => document.getElementById("dj-search-overlay")?.classList.add("hidden")}
        style={{ padding: "8px", color: "#9B95B8", background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}
      >
        ✕
      </button>
    </div>
    <div style={{ padding: "16px 20px" }}>
      <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#9B95B8", marginBottom: "12px" }}>Popular</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["Dresses", "Shoes", "Jackets", "Tech", "Accessories"].map(term => (
          <button
            key={term}
            onClick={() => window.location.href = `/store?q=${term}`}
            style={{ padding: "6px 14px", fontSize: "11px", border: "1px solid #EDE8FA", background: "transparent", color: "#2A1F4A", cursor: "pointer", borderRadius: "20px", transition: "all 0.2s" }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
        
        </nav>

        {/* ── CATEGORY NAV ROW ── */}
        <div className="hidden small:block border-t border-ui-border-base">
          <div className="content-container flex items-center justify-center gap-x-8 h-10">

            {/* FASHION */}
            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/fashion"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Fashion
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/fashion/womenwear" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Women &amp; Teens
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/fashion/menswear" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Men &amp; Teens
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/fashion/kidswear" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Kids &amp; Toddler
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/fashion/accessories" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Accessories
                </LocalizedClientLink>
              </div>
            </div>

            {/* SHOES */}
            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/shoes"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Shoes
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/shoes/womenshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Women Shoes
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/menshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Men Shoes
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/casualshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Casual
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/formalshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Formal
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/sportshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Sports
                </LocalizedClientLink>
              </div>
            </div>

            {/* TECH */}
            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/tech"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Tech
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/tech/phones" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Phones
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/tech/gadget" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Gadgets
                </LocalizedClientLink>
              </div>
            </div>

            {/* ALL PRODUCTS */}
            <LocalizedClientLink
              href="/store"
              className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
            >
              All Products
            </LocalizedClientLink>

          </div>
        </div>

      </header>
    </div>
  )
}
