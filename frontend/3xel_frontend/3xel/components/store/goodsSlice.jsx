import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products: null,
}

export const goodsSlice = createSlice({
    name: 'goods',
    initialState,
    reducers: {
       addGoods: (state, action) => {
            state.products = action.payload 
       } 
    }
})

export const {addGoods} = goodsSlice.actions
export default goodsSlice.reducer