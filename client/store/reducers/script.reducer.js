import { createSlice } from "@reduxjs/toolkit";

const scriptSlice = createSlice({
    name: 'script',
    initialState: {
        recaptcha: false,
        one_tap: false,
        g_charts: false,
        rzr_pay: false
    },
    reducers: {
        loadScripts(state, action) {
            const scriptName = action.payload.scriptName;
            state[scriptName] = action.payload.isLoaded;
        }
    }
});

export const scriptActions = scriptSlice.actions;

export default scriptSlice;