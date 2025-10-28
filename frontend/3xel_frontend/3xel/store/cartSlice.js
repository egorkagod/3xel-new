import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('cart')) || {items: [], isRepeat: false}

const updateCartDiscounts = (items, repeat) => {
    if (items.length === 0) {
        const emptyState = {items: [], isRepeat: false}
        localStorage.setItem('cart', JSON.stringify(emptyState))
        return emptyState
    }

    const plasticBusts = items.filter(item => item.type === 'Пластиковый бюст')
    const cardboardBusts = items.filter(item => item.type === 'Картонный бюст')

    const countPairs = Math.min(plasticBusts.length, cardboardBusts.length)

    const updatedCart = items.map((item) => {
        let discount = 0

        if (item.type !== 'Подарочный сертификат' && repeat) {
            discount = 1000
            return {...item, discount}
        }

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

    const newCartState = {items: updatedCart, isRepeat: repeat}
    localStorage.setItem('cart', JSON.stringify(newCartState))
    return newCartState
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newState = [...state.items, action.payload]
            return updateCartDiscounts(newState, state.isRepeat)
        },
        removeFromCart: (state, action) => {
            const filtered = state.items.filter((_, i) => i !== action.payload)
            return updateCartDiscounts(filtered, state.isRepeat)
        },
        setIsRepeat: (state, action) => {
            state.isRepeat = action.payload
            return updateCartDiscounts(state.items, action.payload)
        }
    }
})

export const {addToCart, removeFromCart, setIsRepeat} = cartSlice.actions
export default cartSlice.reducer