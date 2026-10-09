'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { Provider, useDispatch } from 'react-redux'
import { store, hydrateCart, hydrateWishlist, hydrated } from '@/lib/store'
import type { AppDispatch } from '@/lib/store'

const cartSchema = z.object({ items: z.array(z.object({ productId: z.string(), slug: z.string(), name: z.string(), price: z.number().nonnegative(), volumeLabel: z.string(), qty: z.number().int().positive(), image: z.string() })) })
const wishlistSchema = z.object({ ids: z.array(z.string()) })

function Hydrator() { const dispatch = useDispatch<AppDispatch>(); useEffect(() => { const parse = <T,>(key: string, schema: z.ZodType<T>, fallback: T) => { try { const parsed = schema.safeParse(JSON.parse(localStorage.getItem(key) || 'null')); return parsed.success ? parsed.data : fallback } catch { return fallback } }; dispatch(hydrateCart(parse('dastaan-cart', cartSchema, { items: [] }))); dispatch(hydrateWishlist(parse('dastaan-wishlist', wishlistSchema, { ids: [] }))); dispatch(hydrated()) }, [dispatch]); return null }
export function StoreProvider({ children }: { children: React.ReactNode }) { return <Provider store={store}><Hydrator />{children}</Provider> }
