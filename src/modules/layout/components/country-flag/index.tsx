"use client"

import { useParams, usePathname } from "next/navigation"
import { useState, useRef, useEffect, useTransition } from "react"
import { updateRegion } from "@lib/data/cart"

type Country = {
  code: string
  name: string
  flag: string
  currency: string
  symbol: string
}

const COUNTRIES: Country[] = [
  { code: "gb", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { code: "us", name: "United States",  flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "ca", name: "Canada",         flag: "🇨🇦", currency: "CAD", symbol: "$" },
  { code: "ie", name: "Ireland",        flag: "🇮🇪", currency: "EUR", symbol: "€" },
  { code: "fr", name: "France",         flag: "🇫🇷", currency: "EUR", symbol: "€" },
  { code: "de", name: "Germany",        flag: "🇩🇪", currency: "EUR", symbol: "€" },
  { code: "es", name: "Spain",          flag: "🇪🇸", currency: "EUR", symbol: "€" },
  { code: "it", name: "Italy",          flag: "🇮🇹", currency: "EUR", symbol: "€" },
  { code: "nl", name: "Netherlands",    flag: "🇳🇱", currency: "EUR", symbol: "€" },
  { code: "be", name: "Belgium",        flag: "🇧🇪", currency: "EUR", symbol: "€" },
  { code: "at", name: "Austria",        flag: "🇦🇹", currency: "EUR", symbol: "€" },
  { code: "pt", name: "Portugal",       flag: "🇵🇹", currency: "EUR", symbol: "€" },
  { code: "gr", name: "Greece",         flag: "🇬🇷", currency: "EUR", symbol: "€" },
  { code: "fi", name: "Finland",        flag: "🇫🇮", currency: "EUR", symbol: "€" },
  { code: "hr", name: "Croatia",        flag: "🇭🇷", currency: "EUR", symbol: "€" },
  { code: "cy", name: "Cyprus",         flag: "🇨🇾", currency: "EUR", symbol: "€" },
  { code: "ee", name: "Estonia",        flag: "🇪🇪", currency: "EUR", symbol: "€" },
  { code: "lv", name: "Latvia",         flag: "🇱🇻", currency: "EUR", symbol: "€" },
  { code: "lt", name: "Lithuania",      flag: "🇱🇹", currency: "EUR", symbol: "€" },
  { code: "lu", name: "Luxembourg",     flag: "🇱🇺", currency: "EUR", symbol: "€" },
  { code: "mt", name: "Malta",          flag: "🇲🇹", currency: "EUR", symbol: "€" },
  { code: "sk", name: "Slovakia",       flag: "🇸🇰", currency: "EUR", symbol: "€" },
  { code: "si", name: "Slovenia",       flag: "🇸🇮", currency: "EUR", symbol: "€" },
  { code: "bg", name: "Bulgaria",       flag: "🇧🇬", currency: "BGN", symbol: "лв" },
]

export default function CountryFlag() {
  const params = useParams()
  const pathname = usePathname()
  const code = ((params?.countryCode as string) || "gb").toLowerCase()
  const current = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0]

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (country: Country) => {
    setOpen(false)
    if (country.code === code) return

    // Strip the current country code from the path
    const segments = pathname.split("/")
    segments.splice(1, 1)
    const pathWithoutCountry = segments.join("/") || "/"

    startTransition(async () => {
      await updateRegion(country.code, pathWithoutCountry)
    })
  }

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        .dj-flag-wrap { position: relative; }

        .dj-flag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 999px;
          background: #F4F2FA;
          border: 1px solid #E2DCF5;
          font-size: 11px;
          font-weight: 700;
          color: #18162B;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.05em;
          line-height: 1;
          font-family: inherit;
        }
        .dj-flag-pill:hover {
          background: #EAE6F5;
          border-color: #7C3AED;
        }
        .dj-flag-pill.active {
          background: #EAE6F5;
          border-color: #7C3AED;
        }
        .dj-flag-pill-emoji { font-size: 13px; line-height: 1; }
        .dj-flag-pill-caret {
          font-size: 9px;
          opacity: 0.6;
          margin-left: 2px;
          transition: transform 0.15s ease;
        }
        .dj-flag-pill.active .dj-flag-pill-caret { transform: rotate(180deg); }

        .dj-flag-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          max-height: 380px;
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          z-index: 100;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dj-flag-search-wrap {
          padding: 10px 12px;
          border-bottom: 1px solid #F4F2FA;
        }
        .dj-flag-search {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 12px;
          outline: none;
          font-family: inherit;
          background: #F9F8FC;
        }
        .dj-flag-search:focus { border-color: #7C3AED; background: #fff; }

        .dj-flag-list {
          overflow-y: auto;
          flex: 1;
          padding: 4px;
        }
        .dj-flag-list::-webkit-scrollbar { width: 6px; }
        .dj-flag-list::-webkit-scrollbar-thumb {
          background: #E2DCF5;
          border-radius: 999px;
        }

        .dj-flag-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 8px;
          text-align: left;
          font-family: inherit;
          font-size: 12px;
          color: #18162B;
          transition: background 0.1s ease;
        }
        .dj-flag-item:hover { background: #F4F2FA; }
        .dj-flag-item.selected {
          background: #EAE6F5;
          font-weight: 600;
        }
        .dj-flag-item-flag { font-size: 18px; line-height: 1; flex-shrink: 0; }
        .dj-flag-item-name { flex: 1; }
        .dj-flag-item-currency {
          font-size: 10px;
          font-weight: 600;
          color: #6B7280;
          background: #F4F2FA;
          padding: 2px 7px;
          border-radius: 999px;
        }
        .dj-flag-item.selected .dj-flag-item-currency {
          background: #7C3AED;
          color: #fff;
        }
        .dj-flag-empty {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #9CA3AF;
        }
      `}</style>

      <div className="dj-flag-wrap" ref={wrapRef}>
        <button
          type="button"
          className={`dj-flag-pill ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          disabled={isPending}
          title={`Shipping to ${current.name}`}
        >
          <span className="dj-flag-pill-emoji">{current.flag}</span>
          <span>{current.code.toUpperCase()}</span>
          <span className="dj-flag-pill-caret">▼</span>
        </button>

        {open && (
          <div className="dj-flag-dropdown">
            <div className="dj-flag-search-wrap">
              <input
                type="text"
                className="dj-flag-search"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dj-flag-list">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`dj-flag-item ${c.code === code ? "selected" : ""}`}
                  >
                    <span className="dj-flag-item-flag">{c.flag}</span>
                    <span className="dj-flag-item-name">{c.name}</span>
                    <span className="dj-flag-item-currency">
                      {c.symbol} {c.currency}
                    </span>
                  </button>
                ))
              ) : (
                <div className="dj-flag-empty">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
