import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        email: '',
        rank: 0,
        status: 0
    },
    reducers: {
        loadUser(state, action) {
            state.username = action.payload.user;
            state.email = action.payload.mail;
            state.rank = action.payload.rank;
            state.status = action.payload.status;
        },
        unloadUser(state) {
            state.username = null;
            state.email = null;
            state.rank = null;
            state.status = null;
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice;


