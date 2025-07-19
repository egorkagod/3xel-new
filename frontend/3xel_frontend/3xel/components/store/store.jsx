import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import signUpReducer from './signUpSlice'
import profileReducer from './profileSlice'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        signUp: signUpReducer,
        profile: profileReducer,
    },
})

store.subscribe(() => {
    const state = store.getState()
    localStorage.setItem('cart', JSON.stringify(state.cart.items))
})