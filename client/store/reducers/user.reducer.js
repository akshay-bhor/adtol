import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        email: '',
        rank: 0,
        status: 0,
        userInfo: {},
        loading: false,
        success: null
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
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        setSuccess(state, action) {
            state.success = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice;


