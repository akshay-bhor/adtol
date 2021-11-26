import { createSlice } from "@reduxjs/toolkit";

const advertiserSlice = createSlice({
    name: 'advertiser',
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

export const advertiserActions = advertiserSlice.actions;

export default advertiserSlice;
