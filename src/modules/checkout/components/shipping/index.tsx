"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

// ── DELIVERY DATE HELPERS ──
function getBusinessDays(startDate: Date, daysToAdd: number): Date {
  let count = 0
  const date = new Date(startDate)
  while (count < daysToAdd) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) count++
  }
  return date
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" })
}

function getUKNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }))
}

function getDeliveryDates(minDays: number, maxDays: number): string {
  const today = getUKNow()
  const earliest = getBusinessDays(today, minDays)
  const latest = getBusinessDays(today, maxDays)
  return `${formatDate(earliest)} – ${formatDate(latest)}`
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) return ""
  let ret = ""
  if (address.address_1) ret += ` ${address.address_1}`
  if (address.address_2) ret += `, ${address.address_2}`
  if (address.postal_code) ret += `, ${address.postal_code} ${address.city}`
  if (address.country_code) ret += `, ${address.country_code.toUpperCase()}`
  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] = useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "gb"
  const isUK = countryCode === "gb"

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )
  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )
  const hasPickupOptions = !!_pickupMethods?.length

  // ── FREE SHIPPING THRESHOLD (£40 for UK) ──
  const subtotal = cart.item_subtotal || 0
  const qualifiesForFreeUK = isUK && subtotal >= 4000

  useEffect(() => {
    setIsLoadingPrices(true)
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))
          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (id: string, variant: "shipping" | "pickup") => {
    setError(null)
    if (variant === "pickup") setShowPickupOptions(PICKUP_OPTION_ON)
    else setShowPickupOptions(PICKUP_OPTION_OFF)

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { setError(null) }, [isOpen])

  // ── HELPER: GET METADATA FOR EACH SHIPPING METHOD ──
  const getShippingMeta = (name: string) => {
    const lower = name.toLowerCase()
    const isExpress = lower.includes("express") || lower.includes("next") || lower.includes("priority")

    if (isUK) {
      return {
        icon: isExpress ? "⚡" : "🇬🇧",
        dates: getDeliveryDates(isExpress ? 4 : 5, isExpress ? 8 : 9),
        isExpress,
        sub: isExpress
          ? "Free for Gold Members · Others pay standard rate"
          : qualifiesForFreeUK ? "FREE — you qualify!" : "Free on orders over £40",
      }
    }
    return {
      icon: isExpress ? "📦" : "✈️",
      dates: getDeliveryDates(isExpress ? 5 : 7, isExpress ? 12 : 15),
      isExpress,
      sub: isExpress ? "Faster international delivery" : "Standard international shipping",
    }
  }

  return (
    <>
      <style>{`
        .dj-ship-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border: 1.5px solid #E5E7EB;
          border-radius: 14px;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-bottom: 10px;
        }
        .dj-ship-card:hover {
          border-color: #7C3AED;
          background: #FBFAFF;
        }
        .dj-ship-card.active {
          border-color: #7C3AED;
          background: #F4F2FA;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08);
        }
        .dj-ship-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .dj-ship-icon {
          font-size: 22px;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
        }
        .dj-ship-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .dj-ship-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .dj-ship-title {
          font-weight: 600;
          font-size: 14px;
          color: #18162B;
        }
        .dj-ship-dates {
          font-size: 12px;
          color: #6B7280;
        }
        .dj-ship-sub {
          font-size: 11px;
          font-weight: 500;
        }
        .dj-ship-sub.free { color: #16A34A; font-weight: 600; }
        .dj-ship-sub.gold { color: #D97706; }
        .dj-ship-sub.muted { color: #9CA3AF; }
        .dj-ship-price {
          font-weight: 700;
          font-size: 15px;
          color: #18162B;
          text-align: right;
          flex-shrink: 0;
        }
        .dj-ship-price.free { color: #16A34A; }
        .dj-ship-strike {
          text-decoration: line-through;
          color: #9CA3AF;
          font-weight: 500;
          margin-right: 6px;
          font-size: 13px;
        }
        .dj-gold-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: #fff;
        }
        .dj-section-label {
          font-size: 13px;
          font-weight: 600;
          color: #18162B;
          margin-bottom: 4px;
        }
        .dj-section-sub {
          font-size: 12px;
          color: #6B7280;
          margin-bottom: 16px;
        }
        .dj-continue-btn {
          margin-top: 8px !important;
          width: 100%;
          background: #18162B !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          padding: 14px !important;
          font-size: 14px !important;
        }
        .dj-continue-btn:hover { background: #2D2A4A !important; }
      `}</style>

      <div className="bg-white">
        <div className="flex flex-row items-center justify-between mb-6">
          <Heading
            level="h2"
            className={clx("flex flex-row text-3xl-regular gap-x-2 items-baseline", {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            })}
          >
            Delivery
            {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && <CheckCircleSolid />}
          </Heading>
          {!isOpen && cart?.shipping_address && cart?.billing_address && cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </Text>
          )}
        </div>

        {isOpen ? (
          <>
            <div className="grid">
              <div className="flex flex-col">
                <span className="dj-section-label">Shipping method</span>
                <span className="dj-section-sub">Choose how you'd like your order delivered</span>
              </div>

              <div data-testid="delivery-options-container">
                <div className="pb-6 md:pt-0 pt-2">
                  {/* ── PICKUP TOGGLE ── */}
                  {hasPickupOptions && (
                    <RadioGroup
                      value={showPickupOptions}
                      onChange={() => {
                        const id = _pickupMethods.find((o) => !o.insufficient_inventory)?.id
                        if (id) handleSetShippingMethod(id, "pickup")
                      }}
                    >
                      <Radio
                        value={PICKUP_OPTION_ON}
                        data-testid="delivery-option-radio"
                        className={clx("dj-ship-card", {
                          active: showPickupOptions === PICKUP_OPTION_ON,
                        })}
                      >
                        <MedusaRadio checked={showPickupOptions === PICKUP_OPTION_ON} />
                        <div className="dj-ship-icon">🏬</div>
                        <div className="dj-ship-body">
                          <div className="dj-ship-title">Pick up in store</div>
                          <div className="dj-ship-dates">Collect from a nearby location</div>
                        </div>
                        <div className="dj-ship-price free">FREE</div>
                      </Radio>
                    </RadioGroup>
                  )}

                  {/* ── SHIPPING METHODS ── */}
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => v && handleSetShippingMethod(v, "shipping")}
                  >
                    {_shippingMethods?.map((option) => {
                      const isDisabled =
                        option.price_type === "calculated" &&
                        !isLoadingPrices &&
                        typeof calculatedPricesMap[option.id] !== "number"

                      const meta = getShippingMeta(option.name)
                      const isActive = option.id === shippingMethodId
                      const showAsFree = isUK && qualifiesForFreeUK && !meta.isExpress
                      const rawAmount =
                        option.price_type === "flat"
                          ? option.amount!
                          : calculatedPricesMap[option.id]

                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          data-testid="delivery-option-radio"
                          disabled={isDisabled}
                          className={clx("dj-ship-card", {
                            active: isActive,
                            disabled: isDisabled,
                          })}
                        >
                          <MedusaRadio checked={isActive} />
                          <div className="dj-ship-icon">{meta.icon}</div>
                          <div className="dj-ship-body">
                            <div className="dj-ship-title-row">
                              <span className="dj-ship-title">{option.name}</span>
                              {meta.isExpress && isUK && (
                                <span className="dj-gold-badge">👑 Gold</span>
                              )}
                            </div>
                            <div className="dj-ship-dates">Est. delivery: {meta.dates}</div>
                            <div
                              className={clx("dj-ship-sub", {
                                free: showAsFree || meta.sub.includes("FREE"),
                                gold: meta.isExpress && isUK,
                                muted: !showAsFree && !meta.isExpress,
                              })}
                            >
                              {meta.sub}
                            </div>
                          </div>
                          <div className={clx("dj-ship-price", { free: showAsFree })}>
                            {isLoadingPrices && option.price_type === "calculated" ? (
                              <Loader />
                            ) : showAsFree ? (
                              <>
                                <span className="dj-ship-strike">
                                  {convertToLocale({
                                    amount: rawAmount,
                                    currency_code: cart?.currency_code,
                                  })}
                                </span>
                                FREE
                              </>
                            ) : rawAmount !== undefined ? (
                              convertToLocale({
                                amount: rawAmount,
                                currency_code: cart?.currency_code,
                              })
                            ) : (
                              "-"
                            )}
                          </div>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* ── PICKUP LOCATIONS ── */}
            {showPickupOptions === PICKUP_OPTION_ON && (
              <div className="grid">
                <div className="flex flex-col">
                  <span className="dj-section-label">Store location</span>
                  <span className="dj-section-sub">Choose a store near you</span>
                </div>
                <div data-testid="delivery-options-container">
                  <div className="pb-6 md:pt-0 pt-2">
                    <RadioGroup
                      value={shippingMethodId}
                      onChange={(v) => v && handleSetShippingMethod(v, "pickup")}
                    >
                      {_pickupMethods?.map((option) => (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx("dj-ship-card", {
                            active: option.id === shippingMethodId,
                            disabled: option.insufficient_inventory,
                          })}
                        >
                          <MedusaRadio checked={option.id === shippingMethodId} />
                          <div className="dj-ship-icon">📍</div>
                          <div className="dj-ship-body">
                            <div className="dj-ship-title">{option.name}</div>
                            <div className="dj-ship-dates">
                              {formatAddress(
                                option.service_zone?.fulfillment_set?.location?.address
                              )}
                            </div>
                          </div>
                          <div className="dj-ship-price">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </div>
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            <div>
              <ErrorMessage error={error} data-testid="delivery-option-error-message" />
              <Button
                size="large"
                className="dj-continue-btn"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!cart.shipping_methods?.[0]}
                data-testid="submit-delivery-option-button"
              >
                Continue to payment →
              </Button>
            </div>
          </>
        ) : (
          <div>
            <div className="text-small-regular">
              {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                <div className="flex flex-col w-1/3">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
                  <Text className="txt-medium text-ui-fg-subtle">
                    {cart.shipping_methods!.at(-1)!.name}{" "}
                    {convertToLocale({
                      amount: cart.shipping_methods!.at(-1)!.amount!,
                      currency_code: cart?.currency_code,
                    })}
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
        <Divider className="mt-8" />
      </div>
    </>
  )
}

export default Shipping
