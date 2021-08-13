import axios from "axios";
import { authActions } from "../store/reducers/auth.reducer";
import { createLogout } from "../store/actions/auth.action";
import { uiActions } from "../store/reducers/ui.reducer";
import { getAuthorizationToken } from "../util/authorization-header";
import handleErrorResponse from "../util/error-response";
import { dispatch } from '../store/store';
let cancelToken = [];
let source = [];

const conn = axios.create({
  baseURL: ``,
  timeout: 10000,
});

conn.interceptors.request.use(
  (config) => {
    // cancel tokens
    let currSource = axios.CancelToken.source();
    cancelToken.push(currSource.token);
    source.push(currSource);

    if (getAuthorizationToken() !== null) {
      config.headers.Authorization = getAuthorizationToken();
    }
    config.cancelToken = currSource.token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

conn.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    let errMsg = null;
    if (err.response?.status === 303) {
      dispatch(authActions.setRequireRegister(true));
    } else if (err.response?.status === 401) {
      dispatch(createLogout());
    } else {
      errMsg = handleErrorResponse(err);
      if (errMsg) {
        dispatch(
          uiActions.showAlert({
            title: "Error",
            message: errMsg,
          })
        );
      }
    }
    return Promise.reject(errMsg);
  }
);

export const abortRequest = () => { 
    if (source.length !== 0) {
        source.forEach(s => {
            s.cancel("User Abort");
        });
    }
}

export const registerApi = (data) => conn.post('/api/auth/register', data);

export const loginApi = (data) => conn.post('/api/auth/login', data);

export const gloginApi = (data) => conn.post('/api/auth/glogin', data);

export const changePassApi = (data) => conn.post('/api/auth/change-pass', data);

export const forgotPassApi = (data) => conn.post('/api/auth/forgot-pass', data);

export const resetPassApi = (data) => conn.post('/api/auth/reset-pass', data);

export const getAccountInfo = () => conn.get('/api/account');

export const editAccountInfo = (data) => conn.post('/api/account/edit-details', data);

export const editPaymentInfo = (data) => conn.post('/api/account/edit-payment', data);

export const getCountries = () => conn.get('/api/auth/get-countries');

export const getSummaryData = () => conn.get('/api/dashboard/summary');

export const getAdvertiserData = () => conn.get('/api/dashboard/advertiser');

export const getCampaignsList = () => conn.get('/api/dashboard/campaigns');

export const changeCampaignStatus = (data) => conn.post('/api/dashboard/campaigns/change-status/' + data.id, data.data);

export const changeCampaignBudget = (data) => conn.post('/api/dashboard/campaigns/change-budget/' + data.id, data.data);

export const getPublisherData = () => conn.get('/api/dashboard/publisher');

export const getWebsitesList = () => conn.get('/api/dashboard/websites');

export const getWebsiteFormData = () => conn.get('/api/dashboard/websites/formdata');

export const addWebsite = (data) => conn.post('/api/dashboard/websites/add', data);

export const editWebsite = (data) => conn.post('/api/dashboard/websites/edit/' + data.id, data.data);

export const getAdcode = (data) => conn.post('/api/dashboard/websites/get-adcode', data);

export const getReferralStats = () => conn.get('/api/dashboard/referrals');

export const getPaymentHistory = () => conn.get('/api/dashboard/billing/payment-history');

export const getWithdrawHistory = () => conn.get('/api/dashboard/billing/withdraw-history');

export const createWithdraw = (data) => conn.post('/api/dashboard/billing/withdraw', data);

export const getBillingFormData = () => conn.get('/api/dashboard/billing/formdata');

export const convertPubBalanceApi = (data) => conn.post('/api/dashboard/billing/convert-pub-balance', data);

export const createOrderApi = (data) => conn.post('/api/dashboard/payment/create-order', data);

export const verifyPaymentApi = (data) => conn.post('/api/dashboard/payment/verify-payment', data);

export const getAdvertiserReports = (data) => conn.post('/api/dashboard/reports/advertiser', data);

export const getPublisherReports = (data) => conn.post('/api/dashboard/reports/publisher', data);
