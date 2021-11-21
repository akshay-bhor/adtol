import { websiteActions } from "../reducers/websites.reducer";
import { abortRequest, addWebsite, deleteWebsiteApi, editWebsite, getAdcode, getWebsitesList } from "../../services/apiService";
import { uiActions } from "../reducers/ui.reducer";

const _websiteGetRequest = (sendRequest) => {
    return async (dispatch) => {
        dispatch(websiteActions.setLoading(true));
    
        try {
          dispatch(websiteActions.setError(null));
          dispatch(websiteActions.setSuccess(null));
          const getData = await sendRequest();
         
          if (getData) {
            dispatch(websiteActions.setData(getData.data.data));
          }
    
          dispatch(websiteActions.setLoading(false));
          dispatch(websiteActions.setFetched(true));
        } catch (err) { 
          dispatch(websiteActions.setError(err));
          dispatch(websiteActions.setLoading(false));
        }
    };
}

const _websitePostRequest = (sendRequest, data) => {
  return async (dispatch) => {
    dispatch(websiteActions.setLoading(true));

    try {
      dispatch(websiteActions.setError(null));
      dispatch(websiteActions.setSuccess(null));
      await sendRequest(data);

      dispatch(websiteActions.setLoading(false));
      dispatch(websiteActions.setSuccess(true));

      dispatch(uiActions.showSnack({severity: 'success', message: "Request completed successfully"}))

    } catch (err) {
      dispatch(websiteActions.setError(err));
      dispatch(websiteActions.setLoading(false));
    }
  }
}

export const fetchWebsites = () => {
  return async (dispatch) => dispatch(_websiteGetRequest(getWebsitesList));
}

export const updateWebsite = (data) => {
  return async (dispatch) => {
    await dispatch(_websitePostRequest(editWebsite, data));
    dispatch(websiteActions.setFetched(false));
  }
}

export const createWebsite = (data) => {
  return async (dispatch) => {
    await dispatch(_websitePostRequest(addWebsite, data));
    dispatch(websiteActions.setFetched(false));
  }
}

export const deleteWebsite = (data) => {
  return async (dispatch) => {
    await dispatch(_websitePostRequest(deleteWebsiteApi, data));
    dispatch(websiteActions.setFetched(false));
  }
}

export const fetchAdCodes = (data) => {
  return async (dispatch) => {
    dispatch(websiteActions.setLoading(true));

    try {
      dispatch(websiteActions.setError(null));
      dispatch(websiteActions.setSuccess(null));
      const resData = await getAdcode(data);

      dispatch(websiteActions.setLoading(false));
      dispatch(websiteActions.setSuccess(true));

      dispatch(websiteActions.setAdCodes(resData.data));

      dispatch(uiActions.showSnack({severity: 'success', message: "Request completed successfully"}))

    } catch (err) {
      dispatch(websiteActions.setError(err));
      dispatch(websiteActions.setLoading(false));
    }
  }
}

export const abortWebsiteRequest = () => {
  abortRequest();
}