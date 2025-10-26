import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiFetch } from "../utils/apiClient"

const initialState = {
    order: {},
    status: 'idle',
    error: null
}

export const fetchOrder = createAsyncThunk(
    'order/fetchOne',
    async ({ id }, { rejectWithValue }) => {
        try {
            const order = await apiFetch(`/api-order/order?id=${id}`)
            return order
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                return []
            }

            return rejectWithValue(
                error?.message || error?.payload?.status || "Не удалось загрузить заказ"
            )
        }
    }
)

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.order = action.payload
                state.error = null
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload || action.error.message
            })
    }
})

export default orderSlice.reducer