import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backendUrl || !publishableKey) {
    return NextResponse.json(
      { error: "Store configuration missing" },
      { status: 500 }
    )
  }

  try {
    const { cartId, variantId, quantity } = await req.json()

    if (!cartId || !variantId) {
      return NextResponse.json(
        { error: "Missing cartId or variantId" },
        { status: 400 }
      )
    }

    console.log("Adding to cart:", { cartId, variantId, quantity })

    const res = await fetch(
      `${backendUrl}/store/carts/${cartId}/line-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
        body: JSON.stringify({
          variant_id: variantId,
          quantity: quantity || 1,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("Add to cart error:", data)
      return NextResponse.json(
        { error: data.message || "Failed to add to cart" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Add to cart error:", err)
    return NextResponse.json(
      { error: "Failed to add to cart", detail: err.message },
      { status: 500 }
    )
  }
}
