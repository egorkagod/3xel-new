import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import signUpReducer from './signUpSlice'
import profileReducer from './profileSlice'
import ordersReducer from './ordersSlice'
import recoveryReducer from './profileRecovery'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        signUp: signUpReducer,
        profile: profileReducer,
        orders: ordersReducer,
        recovery: recoveryReducer,
    },
})

store.subscribe(() => {
    const state = store.getState()
    localStorage.setItem('cart', JSON.stringify(state.cart.items))
})