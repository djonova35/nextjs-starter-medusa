"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  getMyRewards,
  redeemVoucherReward,
  type RewardsCurrency,
  type RewardsCurrencyCode,
  type RewardsData,
} from "@lib/data/rewards"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CURRENCY_MULTIPLIERS: Record<RewardsCurrency, number> = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.17,
  CAD: 1.73,
}

const CURRENCY_SYMBOLS: Record<RewardsCurrency, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  CAD: "C$",
}

const convertFromGbp = (gbpValue: number, currency: RewardsCurrency) => {
  return gbpValue * CURRENCY_MULTIPLIERS[currency]
}

const formatMoney = (value: number, currency: RewardsCurrency) => {
  return `${CURRENCY_SYMBOLS[currency]}${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(value)}`
}

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function LiveRewardsPanel({
  currency,
}: {
  currency: RewardsCurrency
}) {
  const [rewards, setRewards] = useState<RewardsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeemingLevel, setRedeemingLevel] = useState<number | null>(null)
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null)

  const loadRewards = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getMyRewards()
      setRewards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rewards")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRewards()
  }, [loadRewards])

  const summary = useMemo(() => {
    if (!rewards) return null

    const spendInCurrency = convertFromGbp(rewards.lifetime_spend_gbp, currency)

    const nextTargetGbp =
      rewards.natural_tier === "bronze"
        ? 100
        : rewards.natural_tier === "silver"
          ? 300
          : null

    const nextTargetInCurrency =
      nextTargetGbp === null ? null : convertFromGbp(nextTargetGbp, currency)

    const amountToNext =
      nextTargetInCurrency === null
        ? 0
        : Math.max(nextTargetInCurrency - spendInCurrency, 0)

    return {
      spendInCurrency,
      nextTargetInCurrency,
      amountToNext,
    }
  }, [rewards, currency])

  const handleRedeem = async (level: 1 | 2 | 3) => {
    setRedeemMessage(null)
    setError(null)
    setRedeemingLevel(level)

    try {
      const result = await redeemVoucherReward({
        voucherLevel: level,
        currencyCode: currency.toLowerCase() as RewardsCurrencyCode,
      })

      setRedeemMessage(
        `Voucher created: ${result.code} · ${formatMoney(
          result.voucher_value,
          currency
        )} off`
      )

      await loadRewards()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to redeem voucher")
    } finally {
      setRedeemingLevel(null)
    }
  }

  return (
    <section className="py-12 md:py-16" style={{ background: "var(--card-bg)" }}>
      <div className="container">
        <div className="mb-8">
          <div className="section-label">Your live rewards</div>
          <h2 className="section-heading">Connected to your Medusa account</h2>
        </div>

        {loading && (
          <div
            className="rounded-[28px] border p-6 md:p-8"
            style={{ background: "white", borderColor: "var(--light-line)" }}
          >
            <p className="text-sm text-[var(--warm-gray)]">
              Loading your rewards account...
            </p>
          </div>
        )}

        {!loading && !rewards && !error && (
          <div
            className="rounded-[28px] border p-6 md:p-8"
            style={{ background: "white", borderColor: "var(--light-line)" }}
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
              Sign in required
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">
              Sign in to see your live points, tier status, and voucher unlocks.
              Until then, the rewards calculator below still works as a preview.
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-[28px] border p-6 md:p-8"
            style={{ background: "white", borderColor: "#f1c0d0" }}
          >
            <p className="text-sm text-[#b94b71]">{error}</p>
          </div>
        )}

        {!loading && rewards && summary && (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div
              className="rounded-[28px] border p-6 md:p-8"
              style={{ background: "white", borderColor: "var(--light-line)" }}
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warm-gray)]">
                    Effective tier
                  </div>
                  <div className="mt-2 font-serif text-5xl text-[var(--ink)]">
                    {capitalize(rewards.effective_tier)}
                  </div>
                  <div className="mt-2 text-sm text-[var(--warm-gray)]">
                    Natural tier: {capitalize(rewards.natural_tier)}
                  </div>
                </div>

                <div
                  className="rounded-full px-4 py-3 text-[11px] uppercase tracking-[0.18em]"
                  style={{
                    background: "rgba(155,127,232,.12)",
                    color: "var(--accent)",
                  }}
                >
                  {rewards.cashback_label}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard
                  label="Points balance"
                  value={rewards.points_balance.toLocaleString()}
                />
                <MetricCard label="Points rate" value={rewards.points_label} />
                <MetricCard
                  label="Spend tracked"
                  value={formatMoney(summary.spendInCurrency, currency)}
                />
                <MetricCard
                  label="Cashback rate"
                  value={rewards.cashback_label}
                />
              </div>

              <div
                className="mt-6 rounded-[22px] border p-5"
                style={{
                  borderColor: "var(--light-line)",
                  background: "var(--cream)",
                }}
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--warm-gray)]">
                  Natural progress
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">
                  {summary.nextTargetInCurrency
                    ? `Spend ${formatMoney(
                        summary.amountToNext,
                        currency
                      )} more to reach ${
                        rewards.natural_tier === "bronze" ? "Silver" : "Gold"
                      } naturally.`
                    : "You’ve already reached the top spend tier naturally."}
                </p>

                {rewards.effective_tier !== "gold" && (
                  <div
                    className="mt-5 rounded-[20px] border p-5"
                    style={{
                      borderColor: "rgba(155,127,232,.22)",
                      background:
                        "linear-gradient(135deg, rgba(155,127,232,.08), rgba(155,127,232,.03))",
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-[540px]">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                          {rewards.effective_tier === "bronze"
                            ? "👑 Want Silver perks today?"
                            : "👑 Want Gold perks today?"}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">
                          {rewards.effective_tier === "bronze"
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
              </div>
            </div>

            <div className="space-y-4">
              {rewards.vouchers.map((voucher) => {
                const voucherValue = formatMoney(
                  convertFromGbp(voucher.voucher_value_gbp, currency),
                  currency
                )
                const minimumOrder = formatMoney(
                  convertFromGbp(voucher.minimum_order_gbp, currency),
                  currency
                )

                return (
                  <div
                    key={voucher.level}
                    className="rounded-[24px] border p-6"
                    style={{
                      background: "white",
                      borderColor: voucher.unlocked
                        ? "rgba(155,127,232,.28)"
                        : "var(--light-line)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                          Level {voucher.level} voucher
                        </div>
                        <div className="mt-2 font-serif text-4xl text-[var(--ink)]">
                          {voucherValue}
                        </div>
                      </div>

                      <div
                        className="rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.16em]"
                        style={{
                          background: voucher.unlocked
                            ? "var(--accent)"
                            : "rgba(155,127,232,.10)",
                          color: voucher.unlocked ? "white" : "var(--accent)",
                        }}
                      >
                        {voucher.unlocked
                          ? "Unlocked"
                          : `${voucher.points_to_unlock} pts to go`}
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-sm leading-7 text-[var(--warm-gray)]">
                      <p>
                        <strong className="text-[var(--ink)]">Cost:</strong>{" "}
                        {voucher.points_required} points
                      </p>
                      <p>
                        <strong className="text-[var(--ink)]">Value:</strong>{" "}
                        {voucherValue} off
                      </p>
                      <p>
                        <strong className="text-[var(--ink)]">Minimum order:</strong>{" "}
                        {minimumOrder}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRedeem(voucher.level as 1 | 2 | 3)}
                      disabled={!voucher.unlocked || redeemingLevel === voucher.level}
                      className="mt-5 w-full rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition-all"
                      style={{
                        background:
                          voucher.unlocked && redeemingLevel !== voucher.level
                            ? "var(--ink)"
                            : "rgba(42,31,74,.12)",
                        color:
                          voucher.unlocked && redeemingLevel !== voucher.level
                            ? "white"
                            : "var(--warm-gray)",
                        border: "none",
                        cursor:
                          voucher.unlocked && redeemingLevel !== voucher.level
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      {redeemingLevel === voucher.level
                        ? "Redeeming..."
                        : voucher.unlocked
                          ? "Redeem voucher"
                          : "Locked"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {redeemMessage && (
          <div
            className="mt-6 rounded-[22px] border p-5"
            style={{
              background: "white",
              borderColor: "rgba(155,127,232,.28)",
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
              Voucher created
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--warm-gray)]">
              {redeemMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[18px] border px-4 py-4"
      style={{ borderColor: "var(--light-line)", background: "var(--card-bg)" }}
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
