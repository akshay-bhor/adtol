import {
  abortRequest,
  convertPubBalanceApi,
  createOrderApi,
  createWithdraw,
  getBillingFormData,
  getPaymentHistory,
  getWithdrawHistory,
  verifyPaymentApi,
} from "../../services/apiService";
import { billingActions } from "../reducers/billing.reducer";
import { uiActions } from "../reducers/ui.reducer";

const _billingGetRequest = (sendRequest, which) => {
  return async (dispatch) => {
    dispatch(billingActions.setLoading(true));

    try {
      dispatch(billingActions.setError(null));
      const getData = await sendRequest();

      if (getData) {
        if (which === "payments") {
          dispatch(billingActions.setPaymentsData(getData.data.data));
          dispatch(billingActions.setFetchedPayments(true));
        }
        if (which === "withdraw") {
          dispatch(billingActions.setWithdrawData(getData.data.data));
          dispatch(billingActions.setFetchedWithdraws(true));
        }
        if (which === "formdata") {
          dispatch(billingActions.setFormData(getData.data));
        }
      }

      dispatch(billingActions.setLoading(false));
    } catch (err) {
      dispatch(billingActions.setError(err));
      dispatch(billingActions.setLoading(false));
    }
  };
};

const _billingPostRequest = (
  sendRequest,
  data,
  which,
  msg = "Request completed successfully"
) => {
  return async (dispatch) => {
    dispatch(billingActions.setLoading(true));

    try {
      if(which === "gateway") {
        dispatch(billingActions.setPaymentLoading(true));
        dispatch(billingActions.setPaymentSuccess(null));
      }

      dispatch(billingActions.setError(null));
      const res = await sendRequest(data);

      dispatch(billingActions.setLoading(false));

      if (which === "withdraw") {
        dispatch(billingActions.setFetchedWithdraws(false));
        dispatch(billingActions.setModalOpen(false));
        dispatch(fetchFormData());
      }

      if (which === "payments") {
        dispatch(billingActions.setFetchedPayments(false));
        dispatch(billingActions.setModalOpen(false));
        dispatch(fetchFormData());
      }

      if(which === "order") {
        dispatch(billingActions.setFetchedPayments(false));
        dispatch(billingActions.setOrderData(res.data));
        return;
      }

      if(which === "gateway") {
        if(which === "gateway") dispatch(billingActions.setPaymentLoading(false));
        if(which === "gateway") dispatch(billingActions.setPaymentSuccess(true));
        return;
      }

      dispatch(uiActions.showSnack({ severity: "success", message: msg }));
    } catch (err) {
      if(which === "gateway") dispatch(billingActions.setPaymentLoading(false));
      if(which === "gateway") dispatch(billingActions.setPaymentSuccess(false));
      dispatch(billingActions.setLoading(false));
    }
  };
};

export const fetchPayments = () => {
  return async (dispatch) =>
    dispatch(_billingGetRequest(getPaymentHistory, "payments"));
};

export const fetchWithdraw = () => {
  return async (dispatch) =>
    dispatch(_billingGetRequest(getWithdrawHistory, "withdraw"));
};

export const fetchFormData = () => {
  return async (dispatch) =>
    dispatch(_billingGetRequest(getBillingFormData, "formdata"));
};

export const makeWithdraw = (data) => {
  return async (dispatch) =>
    dispatch(_billingPostRequest(createWithdraw, data, "withdraw"));
};

export const convertPubBalance = (data) => {
  return async (dispatch) =>
    dispatch(
      _billingPostRequest(
        convertPubBalanceApi,
        data,
        "payments",
        "Payment Sucessfull!"
      )
    );
};

export const createOrder = (data) => {
  return async (dispatch) => dispatch(_billingPostRequest(createOrderApi, data, "order"));
}

export const verifyPayment = (data) => {
  return async (dispatch) => dispatch(_billingPostRequest(verifyPaymentApi, data, "gateway"));
}

export const abortBillingRequest = () => {
  abortRequest();
};
