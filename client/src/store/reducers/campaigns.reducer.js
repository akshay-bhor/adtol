import { createSlice } from "@reduxjs/toolkit";

const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        loading: false,
        data: {
            data: [],
            max_budget: null
        },
        success: null,
        error: null, 
        fetched: false
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
        },
        setSuccess(state, action) {
          state.success = action.payload
        },
        setFetched(state, action) {
          state.fetched = action.payload;
        },
        clearError(state) {
          state.error = null;
        },
    }
});

export const campaignActions = campaignSlice.actions;

export default campaignSlice;
