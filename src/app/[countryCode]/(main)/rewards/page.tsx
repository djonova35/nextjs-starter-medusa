"use client"

import LiveRewardsPanel from "@modules/rewards/components/live-rewards-panel"
import { useMemo, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Currency = "GBP" | "USD" | "EUR" | "CAD"
type TierKey = "bronze" | "silver" | "gold"

type TierData = {
  key: TierKey
  name: string
  icon: string
  min: number
  max: number | null
  shipping: string
  subcopy: string
  gradient: string
  border: string
  glow: string
}

const CURRENCY_CONFIG: Record<
  Currency,
  { symbol: string; multiplierFromGBP: number; label: string }
> = {
  GBP: { symbol: "£", multiplierFromGBP: 1, label: "United Kingdom" },
  USD: { symbol: "$", multiplierFromGBP: 1.28, label: "United States" },
  EUR: { symbol: "€", multiplierFromGBP: 1.17, label: "Europe" },
  CAD: { symbol: "C$", multiplierFromGBP: 1.73, label: "Canada" },
}

const roundEquivalent = (value: number, currency: Currency) => {
  if (currency === "GBP") return value
  return Math.ceil(value / 5) * 5
}

const thresholdInCurrency = (gbpValue: number, currency: Currency) => {
  return roundEquivalent(
    gbpValue * CURRENCY_CONFIG[currency].multiplierFromGBP,
    currency
  )
}

const formatMoney = (value: number, currency: Currency) => {
  const { symbol } = CURRENCY_CONFIG[currency]
  return `${symbol}${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(value)}`
}

const formatMoneyWithDecimals = (value: number, currency: Currency) => {
  const { symbol } = CURRENCY_CONFIG[currency]
  return `${symbol}${new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

const convertRewardValue = (gbpValue: number, currency: Currency) => {
  if (currency === "GBP") return gbpValue
  return Math.round(gbpValue * CURRENCY_CONFIG[currency].multiplierFromGBP)
}

const getCashbackRate = (tier: TierKey) => {
  if (tier === "gold") return 0.1
  if (tier === "silver") return 0.07
  return 0.05
}

const getPointsRate = (tier: TierKey) => {
  if (tier === "gold") return 2
  if (tier === "silver") return 1.5
  return 1
}

const getCashbackLabel = (tier: TierKey) => {
  if (tier === "gold") return "10% cashback"
  if (tier === "silver") return "7% cashback"
  return "5% cashback"
}

const getPointsLabel = (tier: TierKey) => {
  if (tier === "gold") return "2 points per £1 spent"
  if (tier === "silver") return "1.5 points per £1 spent"
  return "1 point per £1 spent"
}

function getProgram(currency: Currency) {
  const bronzeFreeShipMin = thresholdInCurrency(40, currency)
  const silverMin = thresholdInCurrency(100, currency)
  const goldMin = thresholdInCurrency(300, currency)

  const tiers: TierData[] = [
    {
      key: "bronze",
      name: "Bronze",
      icon: "🥉",
      min: 0,
      max: silverMin - 1,
      shipping: `Free standard delivery from ${formatMoney(
        bronzeFreeShipMin,
        currency
      )}`,
      subcopy:
        "Bronze members unlock free standard delivery once the basket reaches the minimum spend.",
      gradient: "linear-gradient(160deg, #2a1c10, #4a2e18)",
      border: "rgba(205,127,50,.28)",
      glow: "rgba(205,127,50,.35)",
    },
    {
      key: "silver",
      name: "Silver",
      icon: "🥈",
      min: silverMin,
      max: goldMin - 1,
      shipping: "Free standard shipping, no minimum spend",
      subcopy:
        "Silver members never need to hit a basket threshold for standard shipping.",
      gradient: "linear-gradient(160deg, #1c1c2a, #303048)",
      border: "rgba(192,192,192,.28)",
      glow: "rgba(192,192,192,.30)",
    },
    {
      key: "gold",
      name: "Gold",
      icon: "🥇",
      min: goldMin,
      max: null,
      shipping: "Free express shipping on every order",
      subcopy:
        "Gold includes express shipping, but not same-day priority delivery.",
      gradient: "linear-gradient(160deg, #2a2010, #503a18)",
      border: "rgba(255,215,0,.28)",
      glow: "rgba(255,215,0,.30)",
    },
  ]

  return {
    bronzeFreeShipMin,
    silverMin,
    goldMin,
    tiers,
  }
}

function getCurrentTier(spend: number, program: ReturnType<typeof getProgram>) {
  if (spend >= program.goldMin) return "gold"
  if (spend >= program.silverMin) return "silver"
  return "bronze"
}

export default function RewardsPage() {
  const [currency, setCurrency] = useState<Currency>("GBP")
  const [spend, setSpend] = useState(85)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const program = useMemo(() => getProgram(currency), [currency])
  const currentTier = getCurrentTier(spend, program)
  const activeTier = program.tiers.find((tier) => tier.key === currentTier)!

  const sliderMax = Math.max(
    program.goldMin * 2,
    thresholdInCurrency(600, currency)
  )

  const cashbackRate = getCashbackRate(currentTier)
  const pointsRate = getPointsRate(currentTier)
  const cashbackValue = spend * cashbackRate
  const pointsEarned = Math.round(spend * pointsRate)

  const nextTarget =
    currentTier === "bronze"
      ? program.silverMin
      : currentTier === "silver"
        ? program.goldMin
        : null

  const amountToNext = nextTarget ? Math.max(nextTarget - spend, 0) : 0

  const progressPercentage =
    currentTier === "gold"
      ? 100
      : currentTier === "silver"
        ? Math.min(
            ((spend - program.silverMin) /
              (program.goldMin - program.silverMin)) *
              100,
            100
          )
        : Math.min((spend / program.silverMin) * 100, 100)

  const shippingStatus =
    currentTier === "gold"
      ? "Free express shipping unlocked. Same-day priority is not included."
      : currentTier === "silver"
        ? "Free standard shipping unlocked on every order."
        : spend >= program.bronzeFreeShipMin
          ? "Free standard delivery unlocked for your current basket."
          : `Spend ${formatMoney(
              program.bronzeFreeShipMin - spend,
              currency
            )} more to unlock free standard delivery.`

  const faqItems = [
    {
      q: "How does cashback change across Bronze, Silver, and Gold?",
      a: "Bronze members earn 5% back, Silver members earn 7% back, and Gold members earn 10% back through the rewards programme.",
    },
    {
      q: "How do points increase by tier?",
      a: "Bronze earns 1 point per £1 spent, Silver earns 1.5 points per £1 spent, and Gold earns 2 points per £1 spent.",
    },
    {
      q: "What shipping perk does each tier get?",
      a: `Bronze gets free standard delivery from ${formatMoney(
        program.bronzeFreeShipMin,
        currency
      )}. Silver gets free standard shipping with no minimum spend. Gold gets free express shipping, but not same-day priority.`,
    },
    {
      q: "Do international customers also get tiers?",
      a: "Yes. Rewards are shown in GBP, USD, EUR, and CAD using store currency equivalents, so customers can see their tier targets in the currency they shop in.",
    },
  ]

  const spendPresets = [
    thresholdInCurrency(40, currency),
    thresholdInCurrency(100, currency),
    thresholdInCurrency(300, currency),
  ]

  const voucherLevels = [
    {
      level: "Level 1",
      points: 100,
      value: convertRewardValue(5, currency),
      minSpend: convertRewardValue(20, currency),
      glow: "rgba(155,127,232,.16)",
    },
    {
      level: "Level 2",
      points: 200,
      value: convertRewardValue(10, currency),
      minSpend: convertRewardValue(40, currency),
      glow: "rgba(107,78,230,.18)",
    },
    {
      level: "Level 3",
      points: 300,
      value: convertRewardValue(15, currency),
      minSpend: convertRewardValue(60, currency),
      glow: "rgba(74,56,128,.18)",
    },
  ]

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)" }}>
      <section
        style={{
          background:
            "radial-gradient(circle at top left, rgba(155,127,232,.28), transparent 34%), linear-gradient(135deg, #2a2050, #3d2d76 55%, #241842)",
        }}
      >
        <div className="container py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="fade-up fade-up-1">
              <div className="hero-eyebrow !mb-6">Rewards programme</div>
              <h1 className="hero-heading !mb-5">
                Earn <em>up to 10% back</em>, unlock better shipping, and climb every
                tier.
              </h1>
              <p className="hero-desc !max-w-[640px] !text-[rgba(255,255,255,.68)]">
                A luxury-feel rewards page built around Bronze, Silver, and Gold.
                Members earn increasing cashback and points by tier, enjoy
                shipping upgrades, and can preview their perks in GBP, USD, EUR,
                or CAD.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <LocalizedClientLink href="/store" className="btn btn-primary">
                  Shop to earn
                </LocalizedClientLink>
                <a href="#rewards-calculator" className="btn btn-outline">
                  Explore tiers
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div
                  className="rounded-[18px] border px-4 py-4"
                  style={{
                    borderColor: "rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.06)",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[rgba(255,255,255,.55)]">
                    Bronze
                  </div>
                  <div className="mt-2 font-serif text-3xl text-white">
                    {formatMoney(0, currency)}–
                    {formatMoney(program.silverMin - 1, currency)}
                  </div>
                  <div className="mt-2 text-xs text-[rgba(255,255,255,.6)]">
                    5% cashback · 1 point per £1 spent
                  </div>
                </div>

                <div
                  className="rounded-[18px] border px-4 py-4"
                  style={{
                    borderColor: "rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.06)",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[rgba(255,255,255,.55)]">
                    Silver
                  </div>
                  <div className="mt-2 font-serif text-3xl text-white">
                    {formatMoney(program.silverMin, currency)}–
                    {formatMoney(program.goldMin - 1, currency)}
                  </div>
                  <div className="mt-2 text-xs text-[rgba(255,255,255,.6)]">
                    7% cashback · 1.5 points per £1 spent
                  </div>
                </div>

                <div
                  className="rounded-[18px] border px-4 py-4"
                  style={{
                    borderColor: "rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.06)",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[rgba(255,255,255,.55)]">
                    Gold
                  </div>
                  <div className="mt-2 font-serif text-3xl text-white">
                    {formatMoney(program.goldMin, currency)}+
                  </div>
                  <div className="mt-2 text-xs text-[rgba(255,255,255,.6)]">
                    10% cashback · 2 points per £1 spent
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-up fade-up-2">
              <div
                className="relative overflow-hidden rounded-[28px] border p-6 md:p-7"
                style={{
                  borderColor: "rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.06)",
                  boxShadow: "0 20px 60px rgba(0,0,0,.18)",
                }}
              >
                <div
                  className="absolute -right-14 -top-14 h-40 w-40 rounded-full"
                  style={{
                    background: "rgba(155,127,232,.22)",
                    filter: "blur(18px)",
                  }}
                />
                <div className="relative z-[1]">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    Live tier snapshot
                  </div>
                  <div className="font-serif text-4xl text-white md:text-5xl">
                    {activeTier.icon} {activeTier.name}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,.65)]">
                    Based on a current yearly spend of {formatMoney(spend, currency)},
                    this member receives {activeTier.shipping.toLowerCase()}, earns{" "}
                    {getCashbackLabel(currentTier).toLowerCase()}, and currently gets{" "}
                    {formatMoneyWithDecimals(cashbackValue, currency)} back in value.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <SnapshotBox
                      label="Cashback value"
                      value={formatMoneyWithDecimals(cashbackValue, currency)}
                    />
                    <SnapshotBox
                      label="Points earned"
                      value={`${pointsEarned.toLocaleString()} pts`}
                    />
                    <SnapshotBox
                      label="Cashback rate"
                      value={getCashbackLabel(currentTier)}
                    />
                    <SnapshotBox label="Store currency" value={currency} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, trackIndex) => (
            <div key={trackIndex} className="flex">
              {[
                "Bronze 5% cashback",
                "Silver 7% cashback",
                "Gold 10% cashback",
                "Free shipping perks by tier",
                "GBP · USD · EUR · CAD supported",
              ].map((item) => (
                <div key={`${trackIndex}-${item}`} className="ticker-item">
                  <span>{item}</span>
                  <span className="dot" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <LiveRewardsPanel currency={currency} />

      <section id="rewards-calculator" className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="section-label justify-center">
              Interactive calculator
            </div>
            <h2 className="section-heading">
              Preview membership, shipping, and cashback instantly
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--warm-gray)]">
              Use the currency switcher and spend slider to show customers
              exactly what they unlock at each reward level.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div
              className="rounded-[28px] border p-6 md:p-8"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--light-line)",
              }}
            >
              <div className="mb-5 flex flex-wrap gap-2">
                {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCurrency(item)
                      setSpend((current) => {
                        const nextDefault = thresholdInCurrency(85, item)
                        return current > sliderMax
                          ? nextDefault
                          : Math.min(
                              current,
                              Math.max(
                                thresholdInCurrency(600, item),
                                thresholdInCurrency(300, item) * 2
                              )
                            )
                      })
                    }}
                    className="rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all"
                    style={{
                      background:
                        currency === item ? "var(--accent)" : "transparent",
                      color: currency === item ? "white" : "var(--ink)",
                      borderColor:
                        currency === item
                          ? "var(--accent)"
                          : "var(--light-line)",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warm-gray)]">
                    Selected spend
                  </div>
                  <div className="mt-1 font-serif text-5xl leading-none text-[var(--ink)]">
                    {formatMoney(spend, currency)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {spendPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSpend(preset)}
                      className="rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-all"
                      style={{
                        borderColor: "var(--light-line)",
                        color: "var(--warm-gray)",
                      }}
                    >
                      Jump to {formatMoney(preset, currency)}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={sliderMax}
                step={1}
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-[var(--warm-gray)]">
                    Edit spend manually
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={spend}
                    onChange={(e) =>
                      setSpend(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full rounded-2xl border px-4 py-3 text-base outline-none"
                    style={{
                      borderColor: "var(--light-line)",
                      background: "white",
                    }}
                  />
                </label>

                <div
                  className="rounded-2xl border px-4 py-4"
                  style={{
                    borderColor: "var(--light-line)",
                    background: "white",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--warm-gray)]">
                    Current tier
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-3xl">{activeTier.icon}</span>
                    <div>
                      <div className="font-serif text-3xl text-[var(--ink)]">
                        {activeTier.name}
                      </div>
                      <div className="text-sm text-[var(--warm-gray)]">
                        {activeTier.shipping}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-7 rounded-[22px] border p-5"
                style={{
                  borderColor: "var(--light-line)",
                  background: "white",
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warm-gray)]">
                      Progress to next tier
                    </div>
                    <div className="mt-1 text-sm text-[var(--warm-gray)]">
                      {nextTarget
                        ? `${formatMoney(amountToNext, currency)} away from ${
                            currentTier === "bronze" ? "Silver" : "Gold"
                          }`
                        : "Top tier reached"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warm-gray)]">
                      Cashback value
                    </div>
                    <div className="mt-1 text-lg font-semibold text-[var(--accent)]">
                      {formatMoneyWithDecimals(cashbackValue, currency)}
                    </div>
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[rgba(155,127,232,.12)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercentage}%`,
                      background: "linear-gradient(90deg, #9B7FE8, #6B4EE6)",
                    }}
                  />
                </div>

                {currentTier !== "gold" && (
                  <div
                    className="mt-5 rounded-[22px] border p-5"
                    style={{
                      borderColor: "rgba(155,127,232,.22)",
                      background:
                        "linear-gradient(135deg, rgba(155,127,232,.08), rgba(155,127,232,.03))",
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-[540px]">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                          {currentTier === "bronze"
                            ? "👑 Want Silver perks today?"
                            : "👑 Want Gold perks today?"}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">
                          {currentTier === "bronze"
                            ? "Skip the spend tracking and unlock all Silver benefits instantly with our Djonova Member Lounge subscription."
                            : "Fast-track to Gold and unlock premium Gold benefits instantly with our Djonova Member Lounge subscription."}
                        </p>
                      </div>

                      <LocalizedClientLink
                        href="/member-lounge"
                        className="btn btn-dark !px-6 !py-3 !text-[10px]"
                      >
                        Explore Member Lounge
                      </LocalizedClientLink>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <MetricCard
                    label="Points"
                    value={`${pointsEarned.toLocaleString()} pts`}
                  />
                  <MetricCard
                    label="Cashback"
                    value={getCashbackLabel(currentTier)}
                  />
                  <MetricCard
                    label="Shipping"
                    value={currentTier === "gold" ? "Express" : "Standard"}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <InfoPanel title="Live benefits summary" text={shippingStatus} />
              <InfoPanel
                title="Points model"
                text={`${activeTier.name} currently earns ${pointsRate} points per £1 spent and returns ${getCashbackLabel(
                  currentTier
                ).toLowerCase()} in value. On ${formatMoney(
                  spend,
                  currency
                )}, that preview equals ${pointsEarned.toLocaleString()} points and ${formatMoneyWithDecimals(
                  cashbackValue,
                  currency
                )} back.`}
              />
              <InfoPanel
                title="International view"
                text={`This preview currently supports ${currency} for ${CURRENCY_CONFIG[currency].label}, and also works for GBP, USD, EUR, and CAD shoppers.`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label">Redeem points for vouchers</div>
            <h2 className="section-heading">
              Turn earned points into instant voucher value
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--warm-gray)]">
              Customers can exchange their points for vouchers once they unlock
              the required level. Voucher values and minimum order thresholds
              update to the selected store currency.
            </p>
          </div>

          <div
            className="mb-6 rounded-[24px] border p-5 md:p-6"
            style={{ background: "white", borderColor: "var(--light-line)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warm-gray)]">
                  Current redemption preview
                </div>
                <div className="mt-2 font-serif text-4xl text-[var(--ink)]">
                  {pointsEarned.toLocaleString()} points available
                </div>
              </div>

              <div
                className="rounded-full px-4 py-3 text-[12px] uppercase tracking-[0.18em]"
                style={{
                  background: "rgba(155,127,232,.12)",
                  color: "var(--accent)",
                }}
              >
                Cashback earned: {formatMoneyWithDecimals(cashbackValue, currency)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {voucherLevels.map((voucher) => {
              const unlocked = pointsEarned >= voucher.points
              const pointsNeeded = Math.max(voucher.points - pointsEarned, 0)

              return (
                <div
                  key={voucher.level}
                  className="relative overflow-hidden rounded-[26px] border p-6"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: unlocked
                      ? "rgba(155,127,232,.35)"
                      : "var(--light-line)",
                    boxShadow: unlocked ? `0 18px 50px ${voucher.glow}` : "none",
                  }}
                >
                  <div
                    className="absolute right-0 top-0 h-28 w-28 rounded-full"
                    style={{
                      background: voucher.glow,
                      filter: "blur(22px)",
                      transform: "translate(30%, -30%)",
                    }}
                  />

                  <div className="relative z-[1]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                          {voucher.level} voucher
                        </div>
                        <div className="mt-2 font-serif text-4xl text-[var(--ink)]">
                          {formatMoney(voucher.value, currency)}
                        </div>
                      </div>

                      <div
                        className="rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.16em]"
                        style={{
                          background: unlocked
                            ? "var(--accent)"
                            : "rgba(155,127,232,.10)",
                          color: unlocked ? "white" : "var(--accent)",
                        }}
                      >
                        {unlocked ? "Unlocked" : `${pointsNeeded} pts to go`}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--warm-gray)]">
                      <p>
                        <strong className="text-[var(--ink)]">Exchange cost:</strong>{" "}
                        {voucher.points} points
                      </p>
                      <p>
                        <strong className="text-[var(--ink)]">Voucher value:</strong>{" "}
                        {formatMoney(voucher.value, currency)} off
                      </p>
                      <p>
                        <strong className="text-[var(--ink)]">Minimum order:</strong>{" "}
                        valid on orders over {formatMoney(voucher.minSpend, currency)}
                      </p>
                    </div>

                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-[rgba(155,127,232,.12)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (pointsEarned / voucher.points) * 100,
                            100
                          )}%`,
                          background: "linear-gradient(90deg, #9B7FE8, #6B4EE6)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="loyalty">
        <div className="container">
          <div className="loyalty-header">
            <div className="section-label justify-center !text-[rgba(255,255,255,.55)] before:!bg-[var(--accent)]">
              Tiers at a glance
            </div>
            <h2 className="section-heading light">
              Luxury rewards, clearly structured
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[rgba(255,255,255,.58)]">
              Each card below matches the rules you set: Bronze starts the
              journey, Silver removes the shipping minimum, and Gold upgrades
              members to free express delivery.
            </p>
          </div>

          <div className="tiers-grid">
            {program.tiers.map((tier) => {
              const isActive = tier.key === currentTier
              const rangeLabel =
                tier.max === null
                  ? `${formatMoney(tier.min, currency)}+`
                  : `${formatMoney(tier.min, currency)} – ${formatMoney(
                      tier.max,
                      currency
                    )}`

              return (
                <div
                  key={tier.key}
                  className="tier-card"
                  style={{
                    background: tier.gradient,
                    border: `1px solid ${tier.border}`,
                    boxShadow: isActive ? `0 18px 60px ${tier.glow}` : "none",
                    transform: isActive ? "translateY(-6px)" : undefined,
                  }}
                >
                  <div className="tier-glow" style={{ background: tier.glow }} />
                  <div className="tier-medal">{tier.icon}</div>
                  <div className="tier-name">{tier.name}</div>
                  <div className="tier-threshold">{rangeLabel}</div>
                  <ul className="tier-perks">
                    <li>
                      <span className="perk-check">✓</span>
                      {getCashbackLabel(tier.key)} back in value
                    </li>
                    <li>
                      <span className="perk-check">✓</span>
                      {getPointsLabel(tier.key)}
                    </li>
                    <li>
                      <span className="perk-check">✓</span>
                      {tier.shipping}
                    </li>
                    {tier.key === "gold" ? (
                      <li>
                        <span className="perk-check">✓</span>
                        No same-day priority included
                      </li>
                    ) : (
                      <li>
                        <span className="perk-check">✓</span>
                        {tier.subcopy}
                      </li>
                    )}
                  </ul>
                  <button className="tier-cta">
                    {isActive ? "Current tier preview" : `See ${tier.name} perks`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--card-bg)" }}>
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label">How rewards work</div>
            <h2 className="section-heading">
              Simple logic your customers can understand in seconds
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <HowCard
              step="01"
              title="Spend and earn"
              text="Bronze earns 5% back with 1 point per £1 spent, Silver earns 7% back with 1.5 points per £1 spent, and Gold earns 10% back with 2 points per £1 spent."
            />
            <HowCard
              step="02"
              title="Move through tiers"
              text={`Bronze covers ${formatMoney(0, currency)} to ${formatMoney(
                program.silverMin - 1,
                currency
              )}, Silver starts at ${formatMoney(
                program.silverMin,
                currency
              )}, and Gold starts at ${formatMoney(program.goldMin, currency)}.`}
            />
            <HowCard
              step="03"
              title="Unlock better delivery"
              text={`Bronze needs ${formatMoney(
                program.bronzeFreeShipMin,
                currency
              )} for free standard delivery, Silver removes the minimum, and Gold gets express shipping.`}
            />
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <div className="faq-header">
            <div className="section-label justify-center">Rewards FAQ</div>
            <h2 className="section-heading">Questions customers will ask</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item, index) => {
              const open = openFaq === index
              return (
                <button
                  key={item.q}
                  onClick={() => setOpenFaq(open ? null : index)}
                  className="faq-item text-left"
                  type="button"
                >
                  <div className="faq-q !mb-0 items-center justify-between">
                    <div className="flex items-start gap-3">
                      <span className="faq-num">0{index + 1}</span>
                      <span>{item.q}</span>
                    </div>
                    <span className="text-xl text-[var(--accent)]">
                      {open ? "−" : "+"}
                    </span>
                  </div>
                  {open && <div className="faq-a pt-4">{item.a}</div>}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="promo-banner">
        <div className="container promo-content">
          <div className="promo-label">Members get more</div>
          <h2 className="promo-heading">Style loyalty with up to 10% back</h2>
          <p className="promo-sub">
            Use this page as your storefront-facing rewards destination and swap
            in your own copy or visuals later if you want it even closer to the
            picture references.
          </p>
          <div className="promo-code-box">
            <span className="promo-code-label">Current preview</span>
            <span className="promo-code">UP TO 10% BACK</span>
          </div>
          <div>
            <LocalizedClientLink href="/store" className="btn btn-light">
              Start earning now
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}

function SnapshotBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[18px] border px-4 py-4"
      style={{
        borderColor: "rgba(255,255,255,.12)",
        background: "rgba(255,255,255,.05)",
      }}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-[rgba(255,255,255,.5)]">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl border px-4 py-4"
      style={{ borderColor: "var(--light-line)", background: "var(--cream)" }}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--warm-gray)]">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-[var(--ink)]">
        {value}
      </div>
    </div>
  )
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <div
      className="rounded-[24px] border p-6"
      style={{ background: "white", borderColor: "var(--light-line)" }}
    >
      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">{text}</p>
    </div>
  )
}

function HowCard({
  step,
  title,
  text,
}: {
  step: string
  title: string
  text: string
}) {
  return (
    <div
      className="rounded-[24px] border p-6"
      style={{ background: "var(--cream)", borderColor: "var(--light-line)" }}
    >
      <div
        className="mb-4 inline-flex rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em]"
        style={{ background: "rgba(155,127,232,.12)", color: "var(--accent)" }}
      >
        Step {step}
      </div>
      <h3 className="font-serif text-3xl text-[var(--ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">{text}</p>
    </div>
  )
}
