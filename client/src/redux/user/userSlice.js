import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
        state.currentUser = action.payload
        state.loading = false
        state.error = null
        },
        signInFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
        },
        updateProfile: (state, action) => {
        if (state.currentUser) {
            state.currentUser.avatar = action.payload.avatar
        }
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state) => {
            state.error = action.payload
            state.loading = false
        }

    },
})

export const {signInStart, signInSuccess, signInFailure, updateProfile, deleteUserStart, deleteUserSuccess, deleteUserFailure} = userSlice.actions

export default userSlice.reducer