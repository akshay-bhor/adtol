import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
    name: "report",
    initialState: {
        loading: false,
        advertiserData: {},
        publisherData: {},
        error: null 
    },
    reducers: {
        setAdvertiserData(state, action) {
            state.advertiserData = action.payload;
        },
        setPublisherData(state, action) {
            state.publisherData = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    }
});

export const reportActions = reportSlice.actions;

export default reportSlice;