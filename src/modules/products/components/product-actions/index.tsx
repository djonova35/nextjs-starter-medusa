"use client"

import DeliveryInfo from "../../../../components/DeliveryInfo"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)

  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length >= 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Payment price calculation
  const paymentVariant = selectedVariant || product.variants?.[0]

  const sellingPrice =
    Number(paymentVariant?.calculated_price?.calculated_amount) || 0

  const currencyCode =
    paymentVariant?.calculated_price?.currency_code?.toUpperCase() ||
    region?.currency_code?.toUpperCase() ||
    "GBP"

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
    }).format(amount / 100)
  }

  const klarnaInstallment = sellingPrice ? formatMoney(sellingPrice / 3) : null
  const clearpayInstallment = sellingPrice ? formatMoney(sellingPrice / 4) : null

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}

              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {/* KLARNA + CLEARPAY MESSAGE */}
        {sellingPrice > 0 && (
          <div className="dj-payment-options">
            <p className="dj-payment-line">
              Pay now, or in 3 interest-free installments of{" "}
              <strong>{klarnaInstallment}</strong>, with{" "}
              <span className="dj-klarna-logo">Klarna</span>
            </p>

            <ul className="dj-payment-list">
              <li>
                4 interest-free installments of{" "}
                <strong>{clearpayInstallment}</strong> with{" "}
                <span className="dj-clearpay-logo">clearpay</span>
              </li>
              <li>18+, T&amp;C apply, Credit subject to status</li>
            </ul>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>

        {/* DELIVERY INFO */}
        <DeliveryInfo />

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>

      <style>{`
        .dj-payment-options {
          margin: 8px 0 14px;
          padding: 12px 14px;
          background: #FAF8FF;
          border: 1px solid #EDE8FA;
          border-radius: 10px;
        }

        .dj-payment-line {
          margin: 0 0 8px;
          font-size: 12px;
          line-height: 1.5;
          color: #2A1F4A;
        }

        .dj-payment-line strong,
        .dj-payment-list strong {
          font-weight: 700;
          color: #2A1F4A;
        }

        .dj-payment-list {
          margin: 0;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dj-payment-list li {
          font-size: 11px;
          line-height: 1.5;
          color: #6C6285;
        }

        .dj-klarna-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 8px;
          border-radius: 5px;
          background: #ffb3c7;
          color: #111;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          vertical-align: middle;
        }

        .dj-clearpay-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 8px;
          border-radius: 999px;
          background: #111;
          color: #b2fce4;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          vertical-align: middle;
        }
      `}</style>
    </>
  )
}
