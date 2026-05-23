import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.getAll("id")

  if (!ids.length) {
    return NextResponse.json({ products: [] })
  }

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backendUrl || !publishableKey) {
    return NextResponse.json(
      { error: "Store configuration missing" },
      { status: 500 }
    )
  }

  // Simple params - no extra fields that might break
  const params = new URLSearchParams()
  ids.forEach((id) => params.append("id", id))

  const fullUrl = `${backendUrl}/store/products?${params.toString()}`

  console.log("Fetching:", fullUrl)

  try {
    const res = await fetch(fullUrl, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    })

    // Log the raw error from Medusa
    if (!res.ok) {
      const errorText = await res.text()
      console.error("Medusa error:", res.status, errorText)
      return NextResponse.json(
        { error: `Backend error: ${res.status}`, detail: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()

    // Now try to get variants with pricing separately
    const productIds = (data.products || []).map((p: any) => p.id)

    if (productIds.length === 0) {
      return NextResponse.json({ products: [] })
    }

    // Try fetching with pricing fields
    const pricedParams = new URLSearchParams()
    productIds.forEach((id: string) => pricedParams.append("id", id))
    pricedParams.append(
      "fields",
      "id,title,handle,thumbnail,variants.id,variants.title,variants.inventory_quantity,variants.calculated_price"
    )

    const pricedRes = await fetch(
      `${backendUrl}/store/products?${pricedParams.toString()}`,
      {
        headers: {
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!pricedRes.ok) {
      // If priced fetch fails, just return basic product data
      console.warn("Priced fetch failed, returning basic data")
      return NextResponse.json(data)
    }

    const pricedData = await pricedRes.json()
    return NextResponse.json(pricedData)
  } catch (err) {
    console.error("Fetch error:", err)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
