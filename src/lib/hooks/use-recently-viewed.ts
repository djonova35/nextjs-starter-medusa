"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "dj_recently_viewed"
const MAX_ITEMS = 12

export type RecentProduct = {
  id: string
  handle: string
  title: string
  thumbnail: string
  price: string
  currencyCode: string
}

export function trackRecentlyViewed(product: RecentProduct) {
  if (typeof window === "undefined") return
  try {
    const existing: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    const filtered = existing.filter((p) => p.id !== product.id)
    const updated = [product, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}

export function useRecentlyViewed(excludeIds: string[] = []) {
  const [items, setItems] = useState<RecentProduct[]>([])

  useEffect(() => {
    try {
      const stored: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      setItems(stored.filter((p) => !excludeIds.includes(p.id)).slice(0, 8))
    } catch {
      setItems([])
    }
  }, [excludeIds.join(",")])

  return items
}
