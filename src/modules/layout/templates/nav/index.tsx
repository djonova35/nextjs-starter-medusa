import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchOverlay from "@modules/layout/components/search-overlay"
import WishlistButton from "@modules/layout/components/wishlist-button"      // 👈 NEW
import CountryFlag from "@modules/layout/components/country-flag"            // 👈 NEW


export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">

        {/* ── TOP ROW ── */}
        <nav className="content-container flex items-center justify-between w-full h-14 px-4">

          {/* LEFT — hamburger + logo side by side like Boohooman */}
          <div className="flex items-center gap-x-2 small:gap-x-4">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
            <LocalizedClientLink
              href="/"
              data-testid="nav-store-link"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "20px",
                fontWeight: "300",
                letterSpacing: "8px",
                textTransform: "uppercase",
                color: "#2A1F4A",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              DJONOVA
            </LocalizedClientLink>
          </div>

          {/* RIGHT — icons */}
          <div className="flex items-center gap-x-2 small:gap-x-4">

             {/* COUNTRY FLAG PILL — 👈 NEW */}
            <CountryFlag />

            {/* SEARCH */}
            <SearchOverlay />

            {/* ACCOUNT */}
            <LocalizedClientLink
              href="/account"
              className="hover:text-purple-500 transition-colors"
              title="Account"
              data-testid="nav-account-link"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </LocalizedClientLink>

            {/* WISHLIST with badge — 👈 REPLACED */}
            <WishlistButton />

            {/* CART */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-purple-500 transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>

          </div>
        </nav>

        {/* ── CATEGORY ROW — desktop only ── */}
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
                 <LocalizedClientLink href="/categories/shoes/kidshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Kid's Shoes
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

            {/* ACCESSORIES */}
            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/accessories"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Accessories
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/accesories/tech" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Tech Essentials
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/accessories/jewelry" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Jewelry
                </LocalizedClientLink>
                <LocalizedClientLink href="/categories/accesories/bags" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">
                  Bags
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
