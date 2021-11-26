import { authActions } from "../reducers/auth.reducer";
import { userActions } from "../reducers/user.reducer";
import { parseAuthToken, removeToken, validAuthToken } from "../../util/common";
import {
  gloginApi,
  loginApi,
  registerApi,
  abortRequest,
  changePassApi,
} from "../../services/apiService";

const _sendAuthRequest = (sendRequest, data, redirect = false) => {
  return async (dispatch) => {
    dispatch(authActions.setLoading(true));

    try {
      const postData = await sendRequest(data);

      if (postData) {
        // Set data
        localStorage.setItem("authToken", postData.data.token);
        // Get expiration
        const expiration =
          new Date().getTime() + 1000 * 60 * 60 * 24 * +postData.data.expiresIn;
        localStorage.setItem("expiration", expiration);
        dispatch(autoLogin());
      }

      dispatch(authActions.setLoading(false));

      /** Set Success */
      dispatch(authActions.setSuccess(true));

      /** Clear Success */
      setTimeout(() => {
        dispatch(authActions.setSuccess(null));
      }, 3000);

      // Set redirect
      if(redirect) {
        dispatch(authActions.setRedirect(redirect));
        setTimeout(() => {
          dispatch(authActions.setRedirect(null));
        }, 1000);
      }

    } catch (err) {
      dispatch(authActions.setLoading(false));
    }
  };
};

export const handleRegister = (data, redirect = false) => {
  return async (dispatch) => dispatch(_sendAuthRequest(registerApi, data, redirect));
};

export const handleLogin = (data, redirect = false) => {
  return async (dispatch) => dispatch(_sendAuthRequest(loginApi, data, redirect));
};

export const handleGLogin = (data, redirect = false) => {
  return async (dispatch) => dispatch(_sendAuthRequest(gloginApi, data, redirect));
};

export const handleOneTapGLogin = (data, redirect = false) => {
  return async (dispatch) => dispatch(_sendAuthRequest(gloginApi, data, redirect));
};

export const handlePasswordChange = (data) => async (dispatch) =>
  dispatch(_sendAuthRequest(changePassApi, data));

export const autoLogin = () => {
  return (dispatch) => {
    const tokenValid = validAuthToken();

    if (tokenValid !== false) {
      dispatch(authActions.login());
      // Load User
      const userData = parseAuthToken();
      if(userData) dispatch(userActions.loadUser(userData));
    }
  };
};

export const createLogout = () => {
  return async (dispatch) => {
    // Remove Tokens
    removeToken();
  };
};

export const abortAuthRequest = () => {
  abortRequest();
};
