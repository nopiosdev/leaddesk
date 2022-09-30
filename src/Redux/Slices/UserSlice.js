import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: {},
        login: 'Logout',
        active: 1,
        clientId: null
    },
    reducers: {
        toggleUser(state, action) {
            state.login = action.payload
        },
        toggleActive(state, action) {
            state.active = action.payload
        },
        addUser(state, action) {
            state.currentUser = action.payload
        },
        updateUserPhone(state, action) {
            state.currentUser.PhoneNumber = action.payload
        },
        updateUserEmployee(state, action) {
            state.currentUser.aItemEmployeeName = action.payload
        },
        removeUser(state, action) {
            state.currentUser = {}
        },
        setClientId(state, action) {
            state.clientId = action.payload
        },
    }
})

export const { addUser, removeUser, toggleUser, updateUserPhone, setClientId, updateUserEmployee, toggleActive } = userSlice.actions
export default userSlice.reducer