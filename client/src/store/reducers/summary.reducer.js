import { createSlice } from "@reduxjs/toolkit";

const summarySlice = createSlice({
    name: 'summary',
    initialState: {
        loading: true,
        data: null,
        userStatus: null,
        notified: false,
        error: null
    },
    reducers: {
        setData(state, action) {
            state.data = action.payload;
        },
        setUserStatus(state, action) {
            state.userStatus = action.payload;
        },
        setNotified(state, action) {
            state.notified = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

export const summaryActions = summarySlice.actions;

export default summarySlice;
