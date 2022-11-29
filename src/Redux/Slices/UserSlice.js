import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: {},
        login: 'Logout',
        active: 1,
        selectedEmp: null
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
        // updateUserPhone(state, action) {
        //     state.currentUser.PhoneNumber = action.payload
        // },
        // updateUserEmployee(state, action) {
        //     state.currentUser.aItemEmployeeName = action.payload
        // },
        removeUser(state, action) {
            state.currentUser = {}
        },
        setSelectedEmployee(state, action) {
            state.selectedEmp = action.payload
        },
    }
})

export const { addUser, removeUser, toggleUser, updateUserPhone, setSelectedEmployee, updateUserEmployee, toggleActive } = userSlice.actions
export default userSlice.reducer