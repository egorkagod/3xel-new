import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('cart')) || []

const updateCartDiscounts = (items) => {
    if (items.length === 0) return []

    const plasticBusts = items.filter(item => item.type === 'Пластиковый бюст')
    const cardboardBusts = items.filter(item => item.type === 'Картонный бюст')

    const countPairs = Math.min(plasticBusts.length, cardboardBusts.length)

    const updatedCart = items.map((item) => {
        let discount = 0

        if (item.type === 'Пластиковый бюст') {
            const plasticIndex = plasticBusts.findIndex(p => p === item)
            if (plasticIndex > 0) discount = 500
        }

        if (item.type === 'Картонный бюст') {
            const cardboardIndex = cardboardBusts.findIndex(c => c === item)
            if (cardboardIndex < countPairs) discount = 1000
        }

        return {...item, discount}
    })

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    return updatedCart
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newState = [...state, action.payload]
            return updateCartDiscounts(newState)
        },
        removeFromCart: (state, action) => {
            const newState = state.filter((_, i) => i !== action.payload)
            return updateCartDiscounts(newState)
        },
    }
})

export const {addToCart, removeFromCart} = cartSlice.actions
export default cartSlice.reducer