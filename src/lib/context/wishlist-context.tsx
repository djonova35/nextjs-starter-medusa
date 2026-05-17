"use client"

import { createContext, useContext, useEffect, useState } from "react"

type WishlistContextType = {
  wishlist: string[]
  addToWishlist: (id: string) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  toggleWishlist: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {},
})

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("djonova_wishlist")
    if (stored) setWishlist(JSON.parse(stored))
  }, [])

  const save = (items: string[]) => {
    setWishlist(items)
    localStorage.setItem("djonova_wishlist", JSON.stringify(items))
  }

  const addToWishlist = (id: string) => save([...wishlist, id])
  const removeFromWishlist = (id: string) => save(wishlist.filter(i => i !== id))
  const isInWishlist = (id: string) => wishlist.includes(id)
  const toggleWishlist = (id: string) => isInWishlist(id) ? removeFromWishlist(id) : addToWishlist(id)

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
