"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { XMark, ArrowRightMini } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggleCategory = (cat: string) => {
    setOpenCategory(openCategory === cat ? null : cat)
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  <span className="flex flex-col gap-1">
                    <span style={{display:"block",width:"20px",height:"1.5px",background:"currentColor"}}/>
                    <span style={{display:"block",width:"14px",height:"1.5px",background:"currentColor"}}/>
                    <span style={{display:"block",width:"20px",height:"1.5px",background:"currentColor"}}/>
                  </span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/20 pointer-events-auto"
                  onClick={close}
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="flex flex-col absolute w-full sm:w-80 h-screen z-[51] inset-x-0 top-0">
                  <div className="flex flex-col h-full bg-white shadow-2xl justify-between overflow-y-auto">

                    {/* HEADER */}
                    <div>
                      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:"300", letterSpacing:"6px", color:"#2A1F4A"}}>DJONOVA</span>
                        <button onClick={close} className="text-gray-400 hover:text-gray-600">
                          <XMark />
                        </button>
                      </div>

                      {/* MAIN LINKS */}
                      <ul className="px-6 py-4 flex flex-col gap-1">
                        <li>
                          <LocalizedClientLink href="/" onClick={close} className="block py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium">
                            Home
                          </LocalizedClientLink>
                        </li>
                        <li>
                          <LocalizedClientLink href="/store" onClick={close} className="block py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium">
                            All Products
                          </LocalizedClientLink>
                        </li>
                      </ul>

                      <div className="border-t border-gray-100 mx-6" />

                      {/* CATEGORIES */}
                      <ul className="px-6 py-4 flex flex-col gap-1">

                        {/* Fashion */}
                        <li>
                          <button
                            onClick={() => toggleCategory("fashion")}
                            className="flex items-center justify-between w-full py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium"
                          >
                            Fashion
                            <span style={{transition:"transform 0.2s", transform: openCategory === "fashion" ? "rotate(90deg)" : "rotate(0deg)", fontSize:"16px", color:"#9B7FE8"}}>›</span>
                          </button>
                          {openCategory === "fashion" && (
                            <ul className="pl-4 flex flex-col gap-1 pb-2">
                               <li><LocalizedClientLink href="/categories/fashion" onClick={close} className="block py-1.5 text-xs text-purple-500 hover:text-purple-700 transition-colors font-medium">All Fashion</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/fashion/womenwear" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Women & Teens</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/fashion/menswear" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Men & Teens</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/fashion/kidswear" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Kids & Toddler</LocalizedClientLink></li>
                            </ul>
                          )}
                        </li>

                        {/* Shoes */}
                        <li>
                          <button
                            onClick={() => toggleCategory("shoes")}
                            className="flex items-center justify-between w-full py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium"
                          >
                            Shoes
                            <span style={{transition:"transform 0.2s", transform: openCategory === "shoes" ? "rotate(90deg)" : "rotate(0deg)", fontSize:"16px", color:"#9B7FE8"}}>›</span>
                          </button>
                          {openCategory === "shoes" && (
                            <ul className="pl-4 flex flex-col gap-1 pb-2">
                              <li><LocalizedClientLink href="/categories/shoes" onClick={close} className="block py-1.5 text-xs text-purple-500 hover:text-purple-700 transition-colors font-medium">All Shoes</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/shoes/womenshoes" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Women Shoes</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/shoes/menshoes" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Men Shoes</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/shoes/kidshoes" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Kid's Shoes</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/shoes/casualshoes" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Casual</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/shoes/formalshoes" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Formal</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/shoes/sportshoes" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Sports</LocalizedClientLink></li>
                            </ul>
                          )}
                        </li>

                        {/* Accessories */}
                        <li>
                          <button
                            onClick={() => toggleCategory("tech")}
                            className="flex items-center justify-between w-full py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium"
                          >
                            Accessories
                            <span style={{transition:"transform 0.2s", transform: openCategory === "tech" ? "rotate(90deg)" : "rotate(0deg)", fontSize:"16px", color:"#9B7FE8"}}>›</span>
                          </button>
                          {openCategory === "tech" && (
                            <ul className="pl-4 flex flex-col gap-1 pb-2">
                               <li><LocalizedClientLink href="/categories/accessories" onClick={close} className="block py-1.5 text-xs text-purple-500 hover:text-purple-700 transition-colors font-medium">All Accessories</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/accessories/tech" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Tech Essentials</LocalizedClientLink></li>
                              <li><LocalizedClientLink href="/categories/accessories/jewelry" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Jewelry</LocalizedClientLink></li>
                             <li><LocalizedClientLink href="/categories/accessories/bags" onClick={close} className="block py-1.5 text-xs text-gray-500 hover:text-purple-500 transition-colors">Bags</LocalizedClientLink></li>
                            </ul>
                          )}
                        </li>

                      </ul>

                      <div className="border-t border-gray-100 mx-6" />

                      {/* ACCOUNT LINKS */}
                      <ul className="px-6 py-4 flex flex-col gap-1">
                        <li>
                          <LocalizedClientLink href="/account" onClick={close} className="block py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium">
                            My Account
                          </LocalizedClientLink>
                        </li>
                        <li>
                          <LocalizedClientLink href="/wishlist" onClick={close} className="block py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium">
                            Wishlist
                          </LocalizedClientLink>
                        </li>
                        <li>
                          <LocalizedClientLink href="/cart" onClick={close} className="block py-2 text-xs uppercase tracking-widest text-gray-800 hover:text-purple-500 transition-colors font-medium">
                            My Bag
                          </LocalizedClientLink>
                        </li>
                      </ul>
                    </div>

                    {/* FOOTER */}
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-col gap-4">
                      {!!locales?.length && (
                        <div className="flex justify-between items-center" onMouseEnter={languageToggleState.open} onMouseLeave={languageToggleState.close}>
                          <LanguageSelect toggleState={languageToggleState} locales={locales} currentLocale={currentLocale} />
                          <ArrowRightMini className={clx("transition-transform duration-150", languageToggleState.state ? "-rotate-90" : "")} />
                        </div>
                      )}
                      <div className="flex justify-between items-center" onMouseEnter={countryToggleState.open} onMouseLeave={countryToggleState.close}>
                        {regions && <CountrySelect toggleState={countryToggleState} regions={regions} />}
                        <ArrowRightMini className={clx("transition-transform duration-150", countryToggleState.state ? "-rotate-90" : "")} />
                      </div>
                      <Text className="txt-compact-small text-gray-400">
                        © {new Date().getFullYear()} DJONOVA. All rights reserved.
                      </Text>
                    </div>

                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
