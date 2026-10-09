import {
  configureStore,
  createListenerMiddleware,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

export type CartItem = {
  productId: string
  slug: string
  name: string
  price: number
  volumeLabel: string
  qty: number
  image: string
}

export type CartState = {
  items: CartItem[]
  promoCode: string | null
  sample: string | null
}

const initialCartState: CartState = {
  items: [],
  promoCode: null,
  sample: null,
}

const MAX_ITEM_QTY = 10

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.volumeLabel === action.payload.volumeLabel
      )
      if (existing) {
        existing.qty = Math.min(MAX_ITEM_QTY, existing.qty + action.payload.qty)
      } else {
        state.items.push({
          ...action.payload,
          qty: Math.min(MAX_ITEM_QTY, Math.max(1, action.payload.qty)),
        })
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; volumeLabel: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.volumeLabel === action.payload.volumeLabel
          )
      )
    },
    setQty: (
      state,
      action: PayloadAction<{ productId: string; volumeLabel: string; qty: number }>
    ) => {
      const item = state.items.find(
        (entry) =>
          entry.productId === action.payload.productId &&
          entry.volumeLabel === action.payload.volumeLabel
      )
      if (!item) return
      if (action.payload.qty <= 0) {
        state.items = state.items.filter((entry) => entry !== item)
      } else {
        item.qty = Math.min(MAX_ITEM_QTY, action.payload.qty)
      }
    },
    changeVolume: (
      state,
      action: PayloadAction<{
        productId: string
        oldVolumeLabel: string
        newVolumeLabel: string
        newPrice: number
      }>
    ) => {
      const { productId, oldVolumeLabel, newVolumeLabel, newPrice } = action.payload
      if (oldVolumeLabel === newVolumeLabel) return

      const sourceIndex = state.items.findIndex(
        (item) => item.productId === productId && item.volumeLabel === oldVolumeLabel
      )
      if (sourceIndex === -1) return

      const sourceItem = state.items[sourceIndex]
      const targetItem = state.items.find(
        (item) => item.productId === productId && item.volumeLabel === newVolumeLabel
      )

      if (targetItem) {
        targetItem.qty = Math.min(MAX_ITEM_QTY, targetItem.qty + sourceItem.qty)
        targetItem.price = newPrice
        state.items.splice(sourceIndex, 1)
      } else {
        sourceItem.volumeLabel = newVolumeLabel
        sourceItem.price = newPrice
      }
    },
    setPromoCode: (state, action: PayloadAction<string | null>) => {
      state.promoCode = action.payload ? action.payload.trim().toUpperCase() : null
    },
    setSample: (state, action: PayloadAction<string | null>) => {
      state.sample = action.payload
    },
    clear: (state) => {
      state.items = []
      state.promoCode = null
      state.sample = null
    },
    hydrate: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items
      state.promoCode = action.payload.promoCode
      state.sample = action.payload.sample
    },
  },
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: [] as string[] },
  reducers: {
    toggle: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.includes(action.payload)
        ? state.ids.filter((id) => id !== action.payload)
        : [...state.ids, action.payload]
    },
    hydrate: (state, action: PayloadAction<{ ids: string[] }>) => {
      state.ids = action.payload.ids
    },
  },
})

const persistence = createListenerMiddleware()

const persist = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('dastaan-cart', JSON.stringify(store.getState().cart))
      localStorage.setItem('dastaan-wishlist', JSON.stringify(store.getState().wishlist))
    } catch {
      // ignore storage errors
    }
  }
}

persistence.startListening({
  predicate: () => true,
  effect: async (_action, listenerApi) => {
    await listenerApi.delay(0)
    const state = listenerApi.getState() as RootState
    if (typeof window !== 'undefined' && state.ui.hydrated) {
      persist()
    }
  },
})

const uiSlice = createSlice({
  name: 'ui',
  initialState: { hydrated: false },
  reducers: {
    hydrated: (state) => {
      state.hydrated = true
    },
  },
})

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefault) => getDefault().prepend(persistence.middleware),
})

export const {
  addItem,
  removeItem,
  setQty,
  changeVolume,
  setPromoCode,
  setSample,
  clear,
  hydrate: hydrateCart,
} = cartSlice.actions
export const { toggle, hydrate: hydrateWishlist } = wishlistSlice.actions
export const { hydrated } = uiSlice.actions

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0)
export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)

