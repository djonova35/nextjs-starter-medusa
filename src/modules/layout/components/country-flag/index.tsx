"use client"

import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FLAGS: Record<string, { flag: string; label: string }> = {
  gb: { flag: "🇬🇧", label: "GB" },
  us: { flag: "🇺🇸", label: "US" },
  ca: { flag: "🇨🇦", label: "CA" },
  ie: { flag: "🇮🇪", label: "IE" },
  fr: { flag: "🇫🇷", label: "FR" },
  de: { flag: "🇩🇪", label: "DE" },
  es: { flag: "🇪🇸", label: "ES" },
  it: { flag: "🇮🇹", label: "IT" },
  nl: { flag: "🇳🇱", label: "NL" },
  be: { flag: "🇧🇪", label: "BE" },
  at: { flag: "🇦🇹", label: "AT" },
  pt: { flag: "🇵🇹", label: "PT" },
  gr: { flag: "🇬🇷", label: "GR" },
  fi: { flag: "🇫🇮", label: "FI" },
  hr: { flag: "🇭🇷", label: "HR" },
  cy: { flag: "🇨🇾", label: "CY" },
  ee: { flag: "🇪🇪", label: "EE" },
  lv: { flag: "🇱🇻", label: "LV" },
  lt: { flag: "🇱🇹", label: "LT" },
  lu: { flag: "🇱🇺", label: "LU" },
  mt: { flag: "🇲🇹", label: "MT" },
  sk: { flag: "🇸🇰", label: "SK" },
  si: { flag: "🇸🇮", label: "SI" },
  bg: { flag: "🇧🇬", label: "BG" },
}

export default function CountryFlag() {
  const params = useParams()
  const code = ((params?.countryCode as string) || "gb").toLowerCase()
  const country = FLAGS[code] || FLAGS.gb

  return (
    <>
      <style>{`
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
          text-decoration: none;
          transition: all 0.15s ease;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .dj-flag-pill:hover {
          background: #EAE6F5;
          border-color: #7C3AED;
        }
        .dj-flag-pill-emoji { font-size: 13px; line-height: 1; }
      `}</style>

      <LocalizedClientLink
        href="/"
        className="dj-flag-pill"
        title={`Shipping to ${country.label}`}
      >
        <span className="dj-flag-pill-emoji">{country.flag}</span>
        <span>{country.label}</span>
      </LocalizedClientLink>
    </>
  )
}
