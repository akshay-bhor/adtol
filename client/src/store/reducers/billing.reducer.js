import { createSlice } from "@reduxjs/toolkit";

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    loading: false,
    fetchedPayments: false,
    fetchedWithdraw: false,
    paymentsData: [],
    withdrawData: [],
    error: null,
    formData: null
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setPaymentsData(state, action) {
      state.paymentsData = action.payload;
    },
    setWithdrawData(state, action) {
      state.withdrawData = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setFetchedPayments(state, action) {
      state.fetchedPayments = action.payload;
    },
    setFetchedWithdraws(state, action) {
      state.fetchedWithdraw = action.payload;
    },
    setFormData(state, action) {
      state.formData = action.payload;
    }
  },
});

export const billingActions = billingSlice.actions;

export default billingSlice;
