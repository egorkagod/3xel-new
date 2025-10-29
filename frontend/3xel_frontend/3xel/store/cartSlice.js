import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem('cart')) || { items: [], isRepeat: false }

const applyDiscounts = (items, repeat) => {
    if (items.length === 0) return items

    const plasticBusts = items.filter(item => item.type === 'Пластиковый бюст')
    const cardboardBusts = items.filter(item => item.type === 'Картонный бюст')
    const countPairs = Math.min(plasticBusts.length, cardboardBusts.length)

    return items.map((item) => {
        let discount = 0

        if (item.type !== 'Подарочный сертификат' && repeat) {
            discount = 1000
        } else if (item.type === 'Пластиковый бюст') {
            const plasticIndex = plasticBusts.findIndex(p => p === item)
            if (plasticIndex > 0) discount = 500
        } else if (item.type === 'Картонный бюст') {
            const cardboardIndex = cardboardBusts.findIndex(c => c === item)
            if (cardboardIndex < countPairs) discount = 1000
        }

        return { ...item, discount }
    });
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload)
            state.items = applyDiscounts(state.items, state.isRepeat)
            localStorage.setItem('cart', JSON.stringify(state))
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((_, i) => i !== action.payload)
            state.items = applyDiscounts(state.items, state.isRepeat)
            localStorage.setItem('cart', JSON.stringify(state))
        },
        setIsRepeat: (state, action) => {
            state.isRepeat = action.payload
            state.items = applyDiscounts(state.items, action.payload)
            localStorage.setItem('cart', JSON.stringify(state))
        },
    },
});

export const { addToCart, removeFromCart, setIsRepeat } = cartSlice.actions
export default cartSlice.reducer
