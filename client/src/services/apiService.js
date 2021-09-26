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
  baseURL: `/api`,
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

export const registerApi = (data) => conn.post('/auth/register', data);

export const loginApi = (data) => conn.post('/auth/login', data);

export const gloginApi = (data) => conn.post('/auth/glogin', data);

export const changePassApi = (data) => conn.post('/auth/change-pass', data);

export const forgotPassApi = (data) => conn.post('/auth/forgot-pass', data);

export const resetPassApi = (data) => conn.post('/auth/reset-pass', data);

export const getAccountInfo = () => conn.get('/account');

export const editAccountInfo = (data) => conn.post('/account/edit-details', data);

export const editPaymentInfo = (data) => conn.post('/account/edit-payment', data);

export const getCountries = () => conn.get('/auth/get-countries');

export const getSummaryData = () => conn.get('/dashboard/summary');

export const getUserStatus = () => conn.get('/dashboard/user-status');

export const getAdvertiserData = () => conn.get('/dashboard/advertiser');

export const getCampaignsList = () => conn.get('/dashboard/campaigns');

export const getCampaignTypes = () => conn.get('/dashboard/campaigns/get-campaign-types');

export const getCampaignBanners = () => conn.get('/dashboard/campaigns/get-banners');

export const getCampaignFormData = () => conn.get('/dashboard/campaigns/formdata');

export const getCampaignData = (data) => conn.get(`/dashboard/campaigns/get-info/${data.campid}`);

export const createCampaignApi = (data) => conn.post(`/dashboard/campaigns/create?type=${data.params.type}`, data);

export const editCampaignApi = (data) => conn.post(`/dashboard/campaigns/edit/${data.params.campaign_id}?type=${data.params.type}`, data);

export const uploadBannersApi = (data) => conn.post('/dashboard/campaigns/upload-banners', data);

export const changeCampaignStatus = (data) => conn.post('/dashboard/campaigns/change-status/' + data.id, data.data);

export const changeCampaignBudget = (data) => conn.post('/dashboard/campaigns/change-budget/' + data.id, data.data);

export const getPublisherData = () => conn.get('/dashboard/publisher');

export const getWebsitesList = () => conn.get('/dashboard/websites');

export const getWebsiteFormData = () => conn.get('/dashboard/websites/formdata');

export const addWebsite = (data) => conn.post('/dashboard/websites/add', data);

export const editWebsite = (data) => conn.post('/dashboard/websites/edit/' + data.id, data.data);

export const getAdcode = (data) => conn.post('/dashboard/websites/get-adcode', data);

export const getReferralStats = () => conn.get('/dashboard/referrals');

export const getPaymentHistory = () => conn.get('/dashboard/billing/payment-history');

export const getWithdrawHistory = () => conn.get('/dashboard/billing/withdraw-history');

export const createWithdraw = (data) => conn.post('/dashboard/billing/withdraw', data);

export const getBillingFormData = () => conn.get('/dashboard/billing/formdata');

export const convertPubBalanceApi = (data) => conn.post('/dashboard/billing/convert-pub-balance', data);

export const createOrderApi = (data) => conn.post('/dashboard/payment/create-order', data);

export const verifyPaymentApi = (data) => conn.post('/dashboard/payment/verify-payment', data);

export const getAdvertiserReports = (data) => conn.post('/dashboard/reports/advertiser', data);

export const getPublisherReports = (data) => conn.post('/dashboard/reports/publisher', data);
