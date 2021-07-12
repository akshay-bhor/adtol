import { createSlice } from "@reduxjs/toolkit";

const referralSlice = createSlice({
    name: 'referral',
    initialState: {
        loading: true,
        data: {},
        error: null
    },
    reducers: {
        setData(state, action) {
            state.data = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

export const referralActions = referralSlice.actions;

export default referralSlice;
