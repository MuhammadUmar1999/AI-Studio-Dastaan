'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { Provider, useDispatch } from 'react-redux'
import { store, hydrateCart, hydrateWishlist, hydrated } from '@/lib/store'
import type { AppDispatch, CartState } from '@/lib/store'

export const cartItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  volumeLabel: z.string(),
  qty: z.number().int().min(1).max(10),
  image: z.string(),
})

export const cartSchema = z.object({
  items: z.array(cartItemSchema).default([]),
  promoCode: z.string().nullable().optional().default(null),
  sample: z.string().nullable().optional().default(null),
})

export const wishlistSchema = z.object({
  ids: z.array(z.string()).default([]),
})

function Hydrator() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const parse = <T,>(key: string, schema: z.ZodType<T>, fallback: T): T => {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return fallback
        const parsed = schema.safeParse(JSON.parse(raw))
        return parsed.success ? parsed.data : fallback
      } catch {
        return fallback
      }
    }

    const defaultCart: CartState = { items: [], promoCode: null, sample: null }
    dispatch(hydrateCart(parse('dastaan-cart', cartSchema, defaultCart)))
    dispatch(hydrateWishlist(parse('dastaan-wishlist', wishlistSchema, { ids: [] })))
    dispatch(hydrated())
  }, [dispatch])

  return null
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Hydrator />
      {children}
    </Provider>
  )
}

