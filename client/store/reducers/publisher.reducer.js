import { createSlice } from "@reduxjs/toolkit";

const publisherSlice = createSlice({
    name: 'publisher',
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

export const publisherActions = publisherSlice.actions;

export default publisherSlice;
