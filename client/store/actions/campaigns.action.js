import { campaignActions } from "../reducers/campaigns.reducer";
import {
  abortRequest,
  changeCampaignBudget,
  changeCampaignStatus,
  createCampaignApi,
  getCampaignBanners,
  getCampaignData,
  getCampaignsList,
  getCampaignTypes,
  editCampaignApi
} from "../../services/apiService";
import { uiActions } from "../reducers/ui.reducer";

const _campaignGetRequest = (
  sendRequest,
  set,
  hasData = false,
  data = null
) => {
  return async (dispatch) => {
    dispatch(campaignActions.setLoading(true));

    try {
      dispatch(campaignActions.setError(null));
      dispatch(campaignActions.setSuccess(null));
      let getData;

      if (!hasData) getData = await sendRequest();
      if (hasData) getData = await sendRequest(data);

      if (getData) {
        if (set === "campaignList")
          dispatch(campaignActions.setData(getData.data));
        if (set === "campaignTypes")
          dispatch(campaignActions.setCampaignTypes(getData.data));
        if (set === "banners")
          dispatch(campaignActions.setBanners(getData.data));
        if (set === "campaignData")
          dispatch(campaignActions.setCampaignData(getData.data));
      }

      dispatch(campaignActions.setLoading(false));
      dispatch(campaignActions.setFetched(true));
    } catch (err) {
      dispatch(campaignActions.setError(err));
      dispatch(campaignActions.setLoading(false));
    }
  };
};

const _campaignPostRequest = (
  sendRequest,
  data,
  snack = false,
  msg = null,
  reset = false
) => {
  return async (dispatch) => {
    dispatch(campaignActions.setLoading(true));

    try {
      dispatch(campaignActions.setError(null));
      dispatch(campaignActions.setSuccess(null));

      await sendRequest(data);

      dispatch(campaignActions.setLoading(false));
      dispatch(campaignActions.setSuccess(true));

      if (snack)
        dispatch(uiActions.showSnack({ severity: "success", message: msg }));
      if (reset) dispatch(campaignActions.setFetched(false));
    } catch (err) {
      dispatch(campaignActions.setError(err));
      dispatch(campaignActions.setLoading(false));
    }
  };
};

export const updateCampaignStatus = (data) => {
  return async (dispatch) => {
    await dispatch(_campaignPostRequest(changeCampaignStatus, data));
    dispatch(fetchCampaignsList());
  };
};

export const fetchCampaignsList = () => {
  return async (dispatch) =>
    dispatch(_campaignGetRequest(getCampaignsList, "campaignList"));
};

export const fetchCampaignData = (data) => {
  return async (dispatch) =>
    dispatch(_campaignGetRequest(getCampaignData, "campaignData", true, data));
};

export const updateCampaignBudget = (data) => {
  return async (dispatch) => {
    await dispatch(_campaignPostRequest(changeCampaignBudget, data));
    dispatch(fetchCampaignsList());
  };
};

export const createCampaignAction = (data) => {
  return async (dispatch) =>
    dispatch(
      _campaignPostRequest(
        createCampaignApi,
        data,
        true,
        "Campaign created successfully",
        true
      )
    );
};

export const editCampaignAction = (data) => {
  return async (dispatch) =>
    dispatch(
      _campaignPostRequest(
        editCampaignApi,
        data,
        true,
        "Campaign Updated successfully",
        true
      )
    );
};

export const fetchCampaignTypes = () => {
  return async (dispatch) =>
    dispatch(_campaignGetRequest(getCampaignTypes, "campaignTypes"));
};

export const fetchCampaignBanners = () => {
  return async (dispatch) =>
    dispatch(_campaignGetRequest(getCampaignBanners, "banners"));
};

export const abortCampaignRequest = () => {
  abortRequest();
};
