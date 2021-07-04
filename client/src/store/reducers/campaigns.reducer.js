import { createSlice } from "@reduxjs/toolkit";

const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        loading: true,
        data: {},
        success: null,
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
        },
        setSuccess(state, action) {
          state.success = action.payload
        }
    }
});

export const campaignActions = campaignSlice.actions;

export default campaignSlice;
