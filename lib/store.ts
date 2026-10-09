import { configureStore, createListenerMiddleware, createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CartItem = { productId: string; slug: string; name: string; price: number; volumeLabel: string; qty: number; image: string }

type CartState = { items: CartItem[] }
const cartSlice = createSlice({ name: 'cart', initialState: { items: [] } as CartState, reducers: {
  addItem: (state, action: PayloadAction<CartItem>) => { const existing = state.items.find((item) => item.productId === action.payload.productId && item.volumeLabel === action.payload.volumeLabel); if (existing) existing.qty += action.payload.qty; else state.items.push(action.payload) },
  removeItem: (state, action: PayloadAction<{ productId: string; volumeLabel: string }>) => { state.items = state.items.filter((item) => !(item.productId === action.payload.productId && item.volumeLabel === action.payload.volumeLabel)) },
  setQty: (state, action: PayloadAction<{ productId: string; volumeLabel: string; qty: number }>) => { const item = state.items.find((item) => item.productId === action.payload.productId && item.volumeLabel === action.payload.volumeLabel); if (!item) return; if (action.payload.qty <= 0) state.items = state.items.filter((entry) => entry !== item); else item.qty = action.payload.qty },
  clear: (state) => { state.items = [] },
  hydrate: (state, action: PayloadAction<CartState>) => { state.items = action.payload.items },
} })
const wishlistSlice = createSlice({ name: 'wishlist', initialState: { ids: [] as string[] }, reducers: { toggle: (state, action: PayloadAction<string>) => { state.ids = state.ids.includes(action.payload) ? state.ids.filter((id) => id !== action.payload) : [...state.ids, action.payload] }, hydrate: (state, action: PayloadAction<{ ids: string[] }>) => { state.ids = action.payload.ids } } })
const persistence = createListenerMiddleware()
const persist = () => { if (typeof window !== 'undefined') { localStorage.setItem('dastaan-cart', JSON.stringify(store.getState().cart)); localStorage.setItem('dastaan-wishlist', JSON.stringify(store.getState().wishlist)) } }
persistence.startListening({ predicate: () => true, effect: async (_action, listenerApi) => { await listenerApi.delay(0); const state = listenerApi.getState() as RootState; if (typeof window !== 'undefined' && state.ui.hydrated) persist() } })
const uiSlice = createSlice({ name: 'ui', initialState: { hydrated: false }, reducers: { hydrated: (state) => { state.hydrated = true } } })
export const store = configureStore({ reducer: { cart: cartSlice.reducer, wishlist: wishlistSlice.reducer, ui: uiSlice.reducer }, middleware: (getDefault) => getDefault().prepend(persistence.middleware) })
export const { addItem, removeItem, setQty, clear, hydrate: hydrateCart } = cartSlice.actions
export const { toggle, hydrate: hydrateWishlist } = wishlistSlice.actions
export const { hydrated } = uiSlice.actions
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const selectCartCount = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.qty, 0)
export const selectSubtotal = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
