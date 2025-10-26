import { configureStore } from '@reduxjs/toolkit'
import goodReducer from './goodsSlice'
import cartReducer from './cartSlice'
import userReducer from './userSlice'
import ordersReducer from './ordersSlice'
import orderReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    goods: goodReducer,
    cart: cartReducer,
    user: userReducer,
    orders: ordersReducer,
    order: orderReducer,
  },
})
