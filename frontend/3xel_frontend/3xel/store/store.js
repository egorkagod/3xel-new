import { configureStore } from '@reduxjs/toolkit'
import goodReducer from './goodsSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
    reducer: {
        goods: goodReducer,
        cart: cartReducer,
    },
})