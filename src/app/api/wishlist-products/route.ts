import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.getAll("id")
  const regionId = searchParams.get("region_id") || "reg_01"

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

  const params = new URLSearchParams()
  ids.forEach((id) => params.append("id", id))
  params.append("region_id", regionId)
  params.append("fields", "*variants,*variants.calculated_price,*variants.options,*options")

  try {
    const res = await fetch(
      `${backendUrl}/store/products?${params.toString()}`,
      {
        headers: {
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
