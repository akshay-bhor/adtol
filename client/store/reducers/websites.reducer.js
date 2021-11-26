import { createSlice } from "@reduxjs/toolkit";

const websiteSlice = createSlice({
    name: 'website',
    initialState: {
        loading: false,
        data: [],
        success: null,
        error: null,
        fetched: false,
        adCodes: null
    },
    reducers: {
        setData(state, action) {
            state.data = action.payload;
        },
        setAdCodes(state, action) {
            state.adCodes = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setSuccess(state, action) {
          state.success = action.payload;
        },
        clearError(state) {
          state.error = null;
        },
        clearAdCodes(state) {
            state.adCodes = null;
        },
        setFetched(state, action) {
          state.fetched = action.payload;
        }
    }
});

export const websiteActions = websiteSlice.actions;

export default websiteSlice;
