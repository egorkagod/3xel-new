import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../utils/apiClient'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await apiFetch('/api-order/orders/')
      return orders || []
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        return []
      }
      return rejectWithValue(
        error?.message || error?.payload?.error || 'Не удалось загрузить заказы',
      )
    }
  },
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
        state.error = null
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
    
  },
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
