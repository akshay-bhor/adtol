import {
  abortRequest,
  createWithdraw,
  getBillingFormData,
  getPaymentHistory,
  getWithdrawHistory,
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

const _billingPostRequest = (sendRequest, data, which) => {
  return async(dispatch) => {
    dispatch(billingActions.setLoading(true));

    try {
      dispatch(billingActions.setError(null));
      await sendRequest(data);

      dispatch(billingActions.setLoading(false));
      
      if(which === 'withdraw') {
        dispatch(billingActions.setFetchedWithdraws(false));
      }

      dispatch(uiActions.showSnack({severity: 'success', message: "Request completed successfully"}))
      
    } catch(err) {
      dispatch(billingActions.setLoading(false));
    }
  }
}

export const fetchPayments = () => {
  return async (dispatch) =>
    dispatch(_billingGetRequest(getPaymentHistory, "payments"));
};

export const fetchWithdraw = () => {
  return async (dispatch) =>
    dispatch(_billingGetRequest(getWithdrawHistory, "withdraw"));
};

export const fetchFormData = () => {
  return async (dispatch) => dispatch(_billingGetRequest(getBillingFormData, 'formdata'));
}

export const makeWithdraw = (data) => {
  return async (dispatch) => dispatch(_billingPostRequest(createWithdraw, data, 'withdraw'));
}

export const abortBillingRequest = () => {
  abortRequest();
};
