import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    active: [],
    past: [],
}

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        updateActiveOrders: (state, action) => {
            state.active = action.payload
        },
        updatePastOrders: (state, action) => {
            state.past = action.payload
        }
    }
})

export const { updateActiveOrders, updatePastOrders } = ordersSlice.actions
export default ordersSlice.reducer