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

const _sendAuthRequest = (sendRequest, data) => {
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

    } catch (err) {
      dispatch(authActions.setLoading(false));
    }
  };
};

export const handleRegister = (data) => {
  return async (dispatch) => dispatch(_sendAuthRequest(registerApi, data));
};

export const handleLogin = (data) => {
  return async (dispatch) => dispatch(_sendAuthRequest(loginApi, data));
};

export const handleGLogin = (data) => {
  return async (dispatch) => dispatch(_sendAuthRequest(gloginApi, data));
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
      dispatch(userActions.loadUser(userData));
    }
  };
};

export const createLogout = () => {
  return async (dispatch) => {
    // Remove Tokens
    removeToken();

    dispatch(authActions.logout());
    dispatch(userActions.unloadUser());
  };
};

export const abortAuthRequest = () => {
  abortRequest();
};
