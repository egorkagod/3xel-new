import { createSlice } from "@reduxjs/toolkit"

const storedCart = JSON.parse(localStorage.getItem('cart')) || []

const initialState = {
    items: storedCart,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items = [...state.items, action.payload]
        },
        removeFromCart: (state, action) => {
            const index = state.items.findIndex(item => 
                item.title === action.payload.title &&
                item.selectedSize === action.payload.selectedSize &&
                item.selectedColor === action.payload.selectedColor
            )

            if (index != -1) state.items.splice(index, 1)
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const {addToCart, removeFromCart, clearCart} = cartSlice.actions
export default cartSlice.reducer