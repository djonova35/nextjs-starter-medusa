import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit Card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit Card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDEAL",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  "pp_stripe-klarna_stripe": {
    title: "Klarna — Buy now, pay later",
    icon: (
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
        <path d="M38.5 0H1.5C0.67 0 0 0.67 0 1.5v13c0 .83.67 1.5 1.5 1.5h37c.83 0 1.5-.67 1.5-1.5V1.5C40 .67 39.33 0 38.5 0z" fill="#FFB3C7"/>
        <text x="20" y="11" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#000" fontFamily="sans-serif">klarna</text>
      </svg>
    ),
  },
  "pp_stripe-afterpay_clearpay_stripe": {
    title: "Clearpay — 4 interest-free payments",
    icon: (
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
        <path d="M38.5 0H1.5C0.67 0 0 0.67 0 1.5v13c0 .83.67 1.5 1.5 1.5h37c.83 0 1.5-.67 1.5-1.5V1.5C40 .67 39.33 0 38.5 0z" fill="#B2FCE4"/>
        <text x="20" y="11" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#000" fontFamily="sans-serif">Clearpay</text>
      </svg>
    ),
  },
  "pp_stripe-apple_pay_stripe": {
    title: "Apple Pay",
    icon: (
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
        <path d="M38.5 0H1.5C0.67 0 0 0.67 0 1.5v13c0 .83.67 1.5 1.5 1.5h37c.83 0 1.5-.67 1.5-1.5V1.5C40 .67 39.33 0 38.5 0z" fill="#000"/>
        <text x="20" y="11" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#fff" fontFamily="sans-serif"> Apple Pay</text>
      </svg>
    ),
  },
  "pp_stripe-google_pay_stripe": {
    title: "Google Pay",
    icon: (
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
        <path d="M38.5 0H1.5C0.67 0 0 0.67 0 1.5v13c0 .83.67 1.5 1.5 1.5h37c.83 0 1.5-.67 1.5-1.5V1.5C40 .67 39.33 0 38.5 0z" fill="#fff" stroke="#e0e0e0"/>
        <text x="20" y="11" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#000" fontFamily="sans-serif">Google Pay</text>
      </svg>
    ),
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
}

export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") ||
    providerId?.startsWith("pp_medusa-")
  )
}

export const isKlarna = (providerId?: string) => {
  return providerId?.includes("klarna")
}

export const isClearpay = (providerId?: string) => {
  return providerId?.includes("afterpay") || providerId?.includes("clearpay")
}

export const isApplePay = (providerId?: string) => {
  return providerId?.includes("apple_pay")
}

export const isGooglePay = (providerId?: string) => {
  return providerId?.includes("google_pay")
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

export const noDivisionCurrencies = [
  "krw", "jpy", "vnd", "clp", "pyg", "xaf", "xof", "bif",
  "djf", "gnf", "kmf", "mga", "rwf", "xpf", "htg", "vuv",
  "xag", "xdr", "xau",
]
