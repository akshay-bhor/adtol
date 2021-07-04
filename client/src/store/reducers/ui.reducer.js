import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        alert: null,
        snack: null
    },
    reducers: {
        showAlert(state, action) {
            state.alert = {
                title: action.payload.title,
                message: action.payload.message
            }
        },
        clearAlert(state) {
            state.alert = null
        },
        showSnack(state, action) {
            state.snack = {
                severity: action.payload.severity,
                message: action.payload.message
            }
        },
        clearSnack(state) {
            state.snack = null
        }
    }
});

export const uiActions = uiSlice.actions;

export default uiSlice;