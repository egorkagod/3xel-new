import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    authorized: false,
    profileData: []
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.profileData = action.payload
        },
        setAuthorized: (state, action) => {
            state.authorized = action.payload
        },
        clearProfile: (state) => {
            state.profileData = []
        }
    },
})

export const { updateProfile, setAuthorized, clearProfile } = profileSlice.actions
export default profileSlice.reducer