import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    email: '',
}

const recoverySlice = createSlice({
    name: 'recovery',
    initialState,
    reducers: {
        setRecoveryEmail: (state, action) => {
            state.email = action.payload
        },
    },
})

export const {setRecoveryEmail} = recoverySlice.actions
export default recoverySlice.reducer