"use client"

import { useRouter, useParams, usePathname } from "next/navigation"
import { useState } from "react"

// ── DELIVERY DATE CALCULATOR ──
function getBusinessDays(startDate: Date, daysToAdd: number): Date {
  let count = 0
  const date = new Date(startDate)
  while (count < daysToAdd) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      count++
    }
  }
  return date
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  })
}

function getUKNow(): Date {
  // Always calculated from UK timezone
  const ukTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/London" })
  )
  return ukTime
}

function getDeliveryDates(minDays: number, maxDays: number): string {
  const today = getUKNow()
  const earliest = getBusinessDays(today, minDays)
  const latest = getBusinessDays(today, maxDays)
  return `Est. Delivery: ${formatDate(earliest)} – ${formatDate(latest)}`
}

// ── YOUR EXACT COUNTRIES ──
const COUNTRIES = [
  { code: "gb", name: "United Kingdom", flag: "🇬🇧", isUK: true  },
  { code: "us", name: "United States",  flag: "🇺🇸", isUK: false },
  { code: "ca", name: "Canada",         flag: "🇨🇦", isUK: false },
  { code: "at", name: "Austria",        flag: "🇦🇹", isUK: false },
  { code: "be", name: "Belgium",        flag: "🇧🇪", isUK: false },
  { code: "bg", name: "Bulgaria",       flag: "🇧🇬", isUK: false },
  { code: "hr", name: "Croatia",        flag: "🇭🇷", isUK: false },
  { code: "cy", name: "Cyprus",         flag: "🇨🇾", isUK: false },
  { code: "ee", name: "Estonia",        flag: "🇪🇪", isUK: false },
  { code: "fi", name: "Finland",        flag: "🇫🇮", isUK: false },
  { code: "fr", name: "France",         flag: "🇫🇷", isUK: false },
  { code: "de", name: "Germany",        flag: "🇩🇪", isUK: false },
  { code: "gr", name: "Greece",         flag: "🇬🇷", isUK: false },
  { code: "ie", name: "Ireland",        flag: "🇮🇪", isUK: false },
  { code: "it", name: "Italy",          flag: "🇮🇹", isUK: false },
  { code: "lv", name: "Latvia",         flag: "🇱🇻", isUK: false },
  { code: "lt", name: "Lithuania",      flag: "🇱🇹", isUK: false },
  { code: "lu", name: "Luxembourg",     flag: "🇱🇺", isUK: false },
  { code: "mt", name: "Malta",          flag: "🇲🇹", isUK: false },
  { code: "nl", name: "Netherlands",    flag: "🇳🇱", isUK: false },
  { code: "pt", name: "Portugal",       flag: "🇵🇹", isUK: false },
  { code: "sk", name: "Slovakia",       flag: "🇸🇰", isUK: false },
  { code: "si", name: "Slovenia",       flag: "🇸🇮", isUK: false },
  { code: "es", name: "Spain",          flag: "🇪🇸", isUK: false },
]

export default function DeliveryInfo() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentCountryCode = (params?.countryCode as string) || "gb"

  const currentCountry =
    COUNTRIES.find((c) => c.code === currentCountryCode) || COUNTRIES[0]

  const [selected, setSelected] = useState(currentCountry)

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosen = COUNTRIES.find((c) => c.code === e.target.value)
    if (!chosen) return
    setSelected(chosen)

    // ── REDIRECT TO CORRECT COUNTRY URL ──
    // e.g. /gb/products/my-product → /lu/products/my-product
    const segments = pathname.split("/")
    segments[1] = chosen.code
    const newPath = segments.join("/")
    router.push(newPath)
  }

  const isUK = selected.isUK

  return (
    <>
      <style>{`
        .dj-delivery-wrap {
          margin-top: 12px;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── COUNTRY SELECTOR ── */
        .dj-country-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #F4F2FA;
          border: 1px solid #E2DCF5;
          border-radius: 10px;
          width: fit-content;
        }
        .dj-country-label {
          font-size: 12px;
          color: #8A82A8;
          white-space: nowrap;
          font-weight: 500;
        }
        .dj-country-flag {
          font-size: 18px;
          line-height: 1;
        }
        .dj-country-select {
          font-size: 13px;
          font-weight: 600;
          color: #18162B;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          padding-right: 20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A82A8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0px center;
          background-size: 10px;
        }
        .dj-country-select:focus { outline: none; }

        /* ── DELIVERY STRIP ── */
        .dj-delivery-strip {
          display: flex;
          align-items: stretch;
          gap: 0;
          background: #fff;
          border: 1px solid #E2DCF5;
          border-radius: 16px;
          overflow: hidden;
        }
        .dj-delivery-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 18px 20px;
          flex: 1;
        }
        .dj-delivery-item:first-child {
          border-right: 1px solid #E2DCF5;
        }
        .dj-delivery-icon {
          font-size: 22px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .dj-delivery-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dj-delivery-title {
          font-weight: 600;
          font-size: 13px;
          color: #18162B;
        }
        .dj-delivery-est {
          font-size: 11px;
          color: #8A82A8;
          letter-spacing: 0.02em;
        }
        .dj-delivery-free {
          font-size: 11px;
          color: #22c55e;
          font-weight: 500;
        }
        @media (max-width: 640px) {
          .dj-delivery-strip { flex-direction: column; }
          .dj-delivery-item:first-child {
            border-right: none;
            border-bottom: 1px solid #E2DCF5;
          }
          .dj-country-selector { width: 100%; box-sizing: border-box; }
        }
      `}</style>

      <div className="dj-delivery-wrap">

        {/* ── COUNTRY SELECTOR ── */}
        <div className="dj-country-selector">
          <span className="dj-country-label">Shipping to:</span>
          <span className="dj-country-flag">{selected.flag}</span>
          <select
            className="dj-country-select"
            value={selected.code}
            onChange={handleCountryChange}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── DELIVERY DATES ── */}
        <div className="dj-delivery-strip">
          {isUK ? (
            <>
              {/* UK Standard */}
              <div className="dj-delivery-item">
                <div className="dj-delivery-icon">🇬🇧</div>
                <div className="dj-delivery-text">
                  <span className="dj-delivery-title">UK Standard Delivery</span>
                  <span className="dj-delivery-est">
                    {getDeliveryDates(5, 9)}
                  </span>
                  <span className="dj-delivery-free">
                    Free on orders over £40
                  </span>
                </div>
              </div>
              {/* UK Express */}
              <div className="dj-delivery-item">
                <div className="dj-delivery-icon">⚡</div>
                <div className="dj-delivery-text">
                  <span className="dj-delivery-title">UK Express Delivery</span>
                  <span className="dj-delivery-est">
                    {getDeliveryDates(2, 3)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* International Standard */}
              <div className="dj-delivery-item">
                <div className="dj-delivery-icon">✈️</div>
                <div className="dj-delivery-text">
                  <span className="dj-delivery-title">
                    International Standard
                  </span>
                  <span className="dj-delivery-est">
                    {getDeliveryDates(7, 15)}
                  </span>
                </div>
              </div>
              {/* International Express */}
              <div className="dj-delivery-item">
                <div className="dj-delivery-icon">📦</div>
                <div className="dj-delivery-text">
                  <span className="dj-delivery-title">
                    International Express
                  </span>
                  <span className="dj-delivery-est">
                    {getDeliveryDates(3, 5)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </>
  )
}
