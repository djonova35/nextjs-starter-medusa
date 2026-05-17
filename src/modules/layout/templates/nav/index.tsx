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

        {/* ── TOP ROW ── */}
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-16 text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase tracking-widest"
              data-testid="nav-store-link"
            >
              DJONOVA
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* ── CATEGORY NAV ROW ── */}
        <div className="hidden small:block border-t border-ui-border-base">
          <div className="content-container flex items-center justify-center gap-x-8 h-10">

            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/fashion"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Fashion
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/fashion/womenwear" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Women & Teens</LocalizedClientLink>
                <LocalizedClientLink href="/categories/fashion/menswear" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Men & Teens</LocalizedClientLink>
                <LocalizedClientLink href="/categories/fashion/kidswear" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Kids & Toddler</LocalizedClientLink>
                <LocalizedClientLink href="/categories/fashion/accessories" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Accessories</LocalizedClientLink>
              </div>
            </div>

            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/shoes"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Shoes
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/shoes/womenshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Women Shoes</LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/menshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Men Shoes</LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/casualshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Casual</LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/formalshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Formal</LocalizedClientLink>
                <LocalizedClientLink href="/categories/shoes/sportshoes" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Sports</LocalizedClientLink>
              </div>
            </div>

            <div className="relative group/cat">
              <LocalizedClientLink
                href="/categories/tech"
                className="text-xs uppercase tracking-widest text-ui-fg-subtle hover:text-ui-fg-base transition-colors py-2 inline-block"
              >
                Tech
              </LocalizedClientLink>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-ui-border-base shadow-lg opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50 min-w-[160px]">
                <LocalizedClientLink href="/categories/tech/phones" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Phones</LocalizedClientLink>
                <LocalizedClientLink href="/categories/tech/gadget" className="block px-4 py-2 text-xs text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors">Gadgets</LocalizedClientLink>
              </div>
            </div>

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
