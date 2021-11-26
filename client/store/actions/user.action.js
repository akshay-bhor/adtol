import { userActions } from "../reducers/user.reducer";
import {
  abortRequest,
  editAccountInfo,
  editPaymentInfo,
  forgotPassApi,
  getAccountInfo,
  resetPassApi,
} from "../../services/apiService";
import { dispatch } from "../store";

const _userAPIRequest = (sendRequest) => {
  return async (dispatch) => {
    dispatch(userActions.setLoading(true));

    try {
      const getData = await sendRequest();

      if (getData) {
        dispatch(userActions.setUserInfo(getData.data));
      }

      dispatch(userActions.setLoading(false));
    } catch (err) {
      dispatch(userActions.setLoading(false));
    }
  };
};

const _userPostRequest = (sendRequest, data, updateAccountInfo = true) => {
  return async (dispatch) => {
    dispatch(userActions.setLoading(true));

    try {
      const postData = await sendRequest(data);

      // Dispatch update account Info action
      if (updateAccountInfo) await dispatch(fetchAccountInfoData());

      dispatch(userActions.setLoading(false));

      /** Set Success */
      dispatch(userActions.setSuccess(true));

      /** Clear Success */
      setTimeout(() => {
        dispatch(userActions.setSuccess(null));
      }, 3000);
    } catch (err) {
      dispatch(userActions.setLoading(false));
    }
  };
};

export const fetchAccountInfoData = () => async (dispatch) =>
  dispatch(_userAPIRequest(getAccountInfo));

export const updateAccountInfo = (data) => async (dispatch) =>
  dispatch(_userPostRequest(editAccountInfo, data));

export const updatePaymentInfo = (data) => async (dispatch) =>
  dispatch(_userPostRequest(editPaymentInfo, data));

export const sendForgotPass = (data) => async (dispatch) =>
  dispatch(_userPostRequest(forgotPassApi, data, false));

export const sendResetPass = (data) => async (dispatch) =>
  dispatch(_userPostRequest(resetPassApi, data, false));

export const abortUserRequest = () => {
  abortRequest();
};
