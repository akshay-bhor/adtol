import { createSlice } from "@reduxjs/toolkit";

const scriptSlice = createSlice({
    name: 'script',
    initialState: {
        recaptcha: false,
        one_tap: false,
        gsi: false,
        g_charts: false
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