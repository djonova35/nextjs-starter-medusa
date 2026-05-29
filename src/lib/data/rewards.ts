export type RewardsTier = "bronze" | "silver" | "gold"
export type LoungePlan = "silver_access" | "gold_access" | null
export type LoungeStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "cancelled"
  | null

export type RewardsCurrency = "GBP" | "USD" | "EUR" | "CAD"
export type RewardsCurrencyCode = "gbp" | "usd" | "eur" | "cad"

export type RewardsVoucher = {
  level: number
  points_required: number
  voucher_value_gbp: number
  minimum_order_gbp: number
  unlocked: boolean
  points_to_unlock: number
}

export type RewardsData = {
  customer: {
    id: string
    email: string
    first_name?: string | null
    last_name?: string | null
  }
  natural_tier: RewardsTier
  effective_tier: RewardsTier
  cashback_rate: number
  cashback_label: string
  points_rate: number
  points_label: string
  lifetime_spend_gbp: number
  points_balance: number
  points_earned_total: number
  points_redeemed_total: number
  member_lounge: {
    plan: LoungePlan
    status: LoungeStatus
  }
  vouchers: RewardsVoucher[]
}

export type RedeemVoucherResponse = {
  code: string
  promotion_id: string
  voucher_level: number
  currency_code: RewardsCurrencyCode
  voucher_value: number
  minimum_order_amount: number
  points_spent: number
  remaining_points: number
}

export async function getMyRewards(): Promise<RewardsData | null> {
  const res = await fetch("/api/rewards/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  })

  if (res.status === 401) {
    return null
  }

  if (!res.ok) {
    const body = await safeJson(res)
    throw new Error(body?.message || "Failed to load rewards")
  }

  const data = await res.json()
  return data.rewards as RewardsData
}

export async function redeemVoucherReward(input: {
  voucherLevel: 1 | 2 | 3
  currencyCode: RewardsCurrencyCode
}): Promise<RedeemVoucherResponse> {
  const res = await fetch("/api/rewards/redeem-voucher", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      voucher_level: input.voucherLevel,
      currency_code: input.currencyCode,
    }),
  })

  const body = await safeJson(res)

  if (!res.ok) {
    throw new Error(body?.message || "Failed to redeem voucher")
  }

  return body.voucher as RedeemVoucherResponse
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
