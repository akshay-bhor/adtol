import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    requireRegister: false,
    loading: false,
    gToken: null,
    success: null,
    redirect: null
  },
  reducers: {
    login(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setGToken(state, action) {
      state.gToken = action.payload;
    },
    setRequireRegister(state, action) {
      state.requireRegister = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    setRedirect(state, action) {
      state.redirect = action.payload;
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice;
