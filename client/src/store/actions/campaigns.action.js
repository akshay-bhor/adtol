import { campaignActions } from "../reducers/campaigns.reducer";
import { abortRequest, changeCampaignBudget, changeCampaignStatus, getCampaignsList } from "../../services/apiService";

const _campaignGetRequest = (sendRequest) => {
    return async (dispatch) => {
        dispatch(campaignActions.setLoading(true));
    
        try {
          dispatch(campaignActions.setError(null));
          dispatch(campaignActions.setSuccess(null));
          const getData = await sendRequest();
         
          if (getData) {
            dispatch(campaignActions.setData(getData.data));
          }
    
          dispatch(campaignActions.setLoading(false));
          dispatch(campaignActions.setFetched(true));
        } catch (err) { 
          dispatch(campaignActions.setError(err));
          dispatch(campaignActions.setLoading(false));
        }
    };
}

const _campaignPostRequest = (sendRequest, data) => {
  return async (dispatch) => {
    dispatch(campaignActions.setLoading(true));

    try {
      dispatch(campaignActions.setError(null));
      dispatch(campaignActions.setSuccess(null));
      
      await sendRequest(data);

      dispatch(campaignActions.setLoading(false));
      dispatch(campaignActions.setSuccess(true));

    } catch (err) {
      dispatch(campaignActions.setError(err));
      dispatch(campaignActions.setLoading(false));
    }
  }
}

export const updateCampaignStatus = (data) => {
  return async (dispatch) => {
    await dispatch(_campaignPostRequest(changeCampaignStatus, data));
    dispatch(fetchCampaignsList());
  }
}

export const fetchCampaignsList = () => {
  return async (dispatch) => dispatch(_campaignGetRequest(getCampaignsList));
}

export const updateCampaignBudget = (data) => {
  return async (dispatch) => {
    await dispatch(_campaignPostRequest(changeCampaignBudget, data));
    dispatch(fetchCampaignsList());
  }
}

export const abortCampaignRequest = () => {
  abortRequest();
}