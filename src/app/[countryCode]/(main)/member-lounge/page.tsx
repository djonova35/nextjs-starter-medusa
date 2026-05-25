"use client"

import { useMemo, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Currency = "GBP" | "USD" | "EUR" | "CAD"
type PlanKey = "silver" | "gold"

type Plan = {
  key: PlanKey
  name: string
  icon: string
  monthlyGBP: number
  accent: string
  border: string
  background: string
  badge: string
  description: string
  benefits: string[]
  note: string
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

const PLANS: Plan[] = [
  {
    key: "silver",
    name: "Silver Access",
    icon: "🥈",
    monthlyGBP: 6.99,
    accent: "#D7D7DE",
    border: "rgba(215,215,222,.28)",
    background: "linear-gradient(160deg, #232335, #35354d)",
    badge: "Most flexible",
    description:
      "Designed for Bronze members who want the comfort of Silver perks without waiting to hit the spend threshold.",
    benefits: [
      "Instant Silver-level privileges while subscribed",
      "Free standard shipping with no minimum spend",
      "Early access to selected drops and launches",
      "Members-only lounge offers and private edits",
    ],
    note: "Best for customers who want lower commitment with premium convenience.",
  },
  {
    key: "gold",
    name: "Gold Access",
    icon: "🥇",
    monthlyGBP: 12.99,
    accent: "#F4D36D",
    border: "rgba(244,211,109,.28)",
    background: "linear-gradient(160deg, #31250f, #5b4318)",
    badge: "Top tier shortcut",
    description:
      "For Bronze members who want the highest tier experience now, including Gold delivery perks and elevated treatment.",
    benefits: [
      "Instant Gold-level privileges while subscribed",
      "Free express shipping on every order",
      "Priority access to launches and restocks",
      "Premium lounge rewards and elevated service touchpoints",
    ],
    note: "Gold includes express shipping, but not same-day priority delivery.",
  },
]

const formatMoney = (value: number, currency: Currency, decimals = 2) => {
  const { symbol } = CURRENCY_CONFIG[currency]

  return `${symbol}${new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)}`
}

const convertPrice = (gbpValue: number, currency: Currency) => {
  if (currency === "GBP") return gbpValue
  return gbpValue * CURRENCY_CONFIG[currency].multiplierFromGBP
}

export default function MemberLoungePage() {
  const [currency, setCurrency] = useState<Currency>("GBP")
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("silver")
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const activePlan = useMemo(
    () => PLANS.find((plan) => plan.key === selectedPlan)!,
    [selectedPlan]
  )

  const faqItems = [
    {
      q: "Who is Member Lounge for?",
      a: "Member Lounge is designed for Bronze customers who want to unlock Silver or Gold-style privileges right away through a monthly subscription.",
    },
    {
      q: "Does Silver Access change my spend tier forever?",
      a: "No. It gives you Silver-level privileges while your subscription is active. Your actual loyalty tier still depends on real spend unless you naturally move up through the rewards programme.",
    },
    {
      q: "What does Gold Access include?",
      a: "Gold Access gives subscribers Gold-style benefits during the subscription, including free express shipping. It does not include same-day priority delivery.",
    },
    {
      q: "Can this be wired to real backend subscriptions later?",
      a: "Yes. This page can stay exactly as your storefront experience while the backend is connected later through a safer staging setup using subscription billing and customer membership status.",
    },
  ]

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)" }}>
      <section
        style={{
          background:
            "radial-gradient(circle at top left, rgba(155,127,232,.24), transparent 34%), linear-gradient(135deg, #241a48, #332461 55%, #1d1438)",
        }}
      >
        <div className="container py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div className="fade-up fade-up-1">
              <div className="hero-eyebrow !mb-6">Djonova Member Lounge</div>
              <h1 className="hero-heading !mb-5">
                Skip the wait and unlock <em>premium tier access</em> instantly.
              </h1>
              <p className="hero-desc !max-w-[620px] !text-[rgba(255,255,255,.68)]">
                Member Lounge is your shortcut for Bronze customers who want
                Silver or Gold privileges on a monthly subscription. Elegant,
                premium, and ready to connect to real backend membership logic
                later without changing the customer-facing experience.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#plans" className="btn btn-primary">
                  View plans
                </a>
                <LocalizedClientLink href="/rewards" className="btn btn-outline">
                  Back to rewards
                </LocalizedClientLink>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setCurrency(item)}
                    className="rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all"
                    style={{
                      background: currency === item ? "var(--accent)" : "rgba(255,255,255,.04)",
                      color: "white",
                      borderColor:
                        currency === item ? "var(--accent)" : "rgba(255,255,255,.12)",
                    }}
                  >
                    {item}
                  </button>
                ))}
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
                  className="absolute -right-12 -top-12 h-36 w-36 rounded-full"
                  style={{ background: "rgba(155,127,232,.22)", filter: "blur(18px)" }}
                />

                <div className="relative z-[1]">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    Selected membership
                  </div>
                  <div className="font-serif text-4xl text-white md:text-5xl">
                    {activePlan.icon} {activePlan.name}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,.65)]">
                    {activePlan.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <PreviewCard
                      label="Monthly price"
                      value={formatMoney(convertPrice(activePlan.monthlyGBP, currency), currency)}
                    />
                    <PreviewCard label="Store currency" value={currency} />
                    <PreviewCard label="Ideal for" value="Bronze members" />
                    <PreviewCard
                      label="Delivery perk"
                      value={selectedPlan === "gold" ? "Express" : "Standard"}
                    />
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
                "Bronze members can jump into Silver perks",
                "Gold Access includes free express shipping",
                "Silver Access removes the standard shipping minimum",
                "Monthly subscriptions shown in GBP · USD · EUR · CAD",
                "Customer-facing now, backend-ready later",
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

      <section id="plans" className="py-16 md:py-24" style={{ background: "var(--card-bg)" }}>
        <div className="container">
          <div className="mb-10 max-w-3xl text-center mx-auto">
            <div className="section-label justify-center">Membership plans</div>
            <h2 className="section-heading">Choose the tier access that fits your customer</h2>
            <p className="mt-4 text-base leading-8 text-[var(--warm-gray)]">
              The Member Lounge gives Bronze customers a premium path into higher-tier benefits
              through a monthly subscription, without waiting for spend milestones.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {PLANS.map((plan) => {
              const isActive = selectedPlan === plan.key
              const convertedPrice = convertPrice(plan.monthlyGBP, currency)

              return (
                <div
                  key={plan.key}
                  className="relative overflow-hidden rounded-[28px] border p-7 md:p-8"
                  style={{
                    background: plan.background,
                    borderColor: plan.border,
                    boxShadow: isActive ? `0 18px 60px ${plan.border}` : "none",
                    transform: isActive ? "translateY(-4px)" : undefined,
                    transition: "all .35s ease",
                  }}
                >
                  <div
                    className="absolute right-0 top-0 h-32 w-32 rounded-full"
                    style={{
                      background: plan.border,
                      filter: "blur(24px)",
                      transform: "translate(30%, -30%)",
                    }}
                  />

                  <div className="relative z-[1]">
                    <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
                      <div className="rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: plan.accent, borderColor: plan.border }}
                      >
                        {plan.badge}
                      </div>

                      <button
                        onClick={() => setSelectedPlan(plan.key)}
                        className="rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-all"
                        style={{
                          color: isActive ? "#111" : "white",
                          background: isActive ? plan.accent : "transparent",
                          borderColor: isActive ? plan.accent : "rgba(255,255,255,.16)",
                        }}
                      >
                        {isActive ? "Selected" : "Preview plan"}
                      </button>
                    </div>

                    <div className="text-4xl">{plan.icon}</div>
                    <h3 className="mt-4 font-serif text-5xl text-white">{plan.name}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[rgba(255,255,255,.62)]">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-end gap-3 flex-wrap">
                      <div className="font-serif text-5xl leading-none text-white">
                        {formatMoney(convertedPrice, currency)}
                      </div>
                      <div className="pb-1 text-[11px] uppercase tracking-[0.18em] text-[rgba(255,255,255,.52)]">
                        per month
                      </div>
                    </div>

                    <ul className="mt-8 space-y-3">
                      {plan.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-3 border-b pb-3 text-sm leading-7 text-[rgba(255,255,255,.68)]"
                          style={{ borderColor: "rgba(255,255,255,.08)" }}
                        >
                          <span style={{ color: plan.accent }}>✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-6 text-sm leading-7 text-[rgba(255,255,255,.52)]">
                      {plan.note}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label">How Member Lounge works</div>
            <h2 className="section-heading">A clean customer journey now, real subscription logic later</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StepCard
              step="01"
              title="Join monthly"
              text="A Bronze customer chooses Silver Access or Gold Access and joins the lounge on a monthly plan."
            />
            <StepCard
              step="02"
              title="Unlock privileges"
              text="While subscribed, the customer receives the selected membership privileges immediately, without waiting to climb through spend thresholds."
            />
            <StepCard
              step="03"
              title="Connect backend later"
              text="When you're ready, we can wire this into real subscription billing, customer metadata, and automatic benefit handling in a staging backend first."
            />
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <div className="faq-header">
            <div className="section-label justify-center">Member Lounge FAQ</div>
            <h2 className="section-heading">Clear answers for your future subscribers</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item, index) => {
              const open = openFaq === index

              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpenFaq(open ? null : index)}
                  className="faq-item text-left"
                >
                  <div className="faq-q !mb-0 items-center justify-between">
                    <div className="flex items-start gap-3">
                      <span className="faq-num">0{index + 1}</span>
                      <span>{item.q}</span>
                    </div>
                    <span className="text-xl text-[var(--accent)]">{open ? "−" : "+"}</span>
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
          <div className="promo-label">Premium shortcut</div>
          <h2 className="promo-heading">Bronze today, elevated privileges tonight</h2>
          <p className="promo-sub">
            The Member Lounge keeps the brand experience polished now and gives us a clean path
            to connect real subscription billing safely when you’re ready.
          </p>
          <div className="promo-code-box">
            <span className="promo-code-label">Starting from</span>
            <span className="promo-code">
              {formatMoney(convertPrice(PLANS[0].monthlyGBP, currency), currency)}/MO
            </span>
          </div>
          <div className="flex justify-center">
            <a href="#plans" className="btn btn-light">
              Compare memberships
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function PreviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[18px] border px-4 py-4"
      style={{ borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)" }}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-[rgba(255,255,255,.5)]">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

function StepCard({
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
      style={{ background: "white", borderColor: "var(--light-line)" }}
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
