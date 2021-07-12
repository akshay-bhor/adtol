import {
  abortRequest,
  getPaymentHistory,
  getWithdrawHistory,
} from "../../services/apiService";
import { billingActions } from "../reducers/billing.reducer";

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
      }

      dispatch(billingActions.setLoading(false));
    } catch (err) {
      dispatch(billingActions.setError(err));
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

export const abortBillingRequest = () => {
  abortRequest();
};
