import { configureStore } from '@reduxjs/toolkit'
import goodReducer from './goodsSlice'
import cartReducer from './cartSlice'
import userReducer from './userSlice'
import ordersReducer from './ordersSlice'

export const store = configureStore({
  reducer: {
    goods: goodReducer,
    cart: cartReducer,
    user: userReducer,
    orders: ordersReducer,
  },
})
