import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    enteredEmail: '',
    enteredName: '',
    enteredPassword: '',
}

const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        setEnteredEmail: (state, action) => {
            state.enteredEmail = action.payload
        },
        setEnteredPassword: (state, action) => {
            state.enteredPassword = action.payload
        },
        setEnteredName: (state, action) => {
            state.enteredName = action.payload
        },
    },
})

export const {setEnteredEmail, setEnteredPassword, setEnteredName} = signUpSlice.actions
export default signUpSlice.reducer