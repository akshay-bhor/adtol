import { createSlice } from "@reduxjs/toolkit";

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    loading: false,
    fetchedPayments: false,
    fetchedWithdraw: false,
    paymentsData: [],
    withdrawData: [],
    payFormData: null,
    error: null,
    formData: null,
    modalOpen: false,
    paymentState: {
      orderData: null,
      loading: false,
      success: null,
    }
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
    setPayFormData(state, action) {
      state.payFormData = action.payload;
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
    },
    setModalOpen(state, action){
      state.modalOpen = action.payload;
    },
    setOrderData(state, action) {
      state.paymentState.orderData = action.payload;
    },
    setPaymentLoading(state, action) {
      state.paymentState.loading = action.payload;
    },
    setPaymentSuccess(state, action) {
      state.paymentState.success = action.payload;
    }
  },
});

export const billingActions = billingSlice.actions;

export default billingSlice;
