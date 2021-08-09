import { reportActions } from "../reducers/reports.reducer";
import { abortRequest, getAdvertiserReports, getPublisherReports } from "../../services/apiService";

const _reportPostRequest = (sendRequest, data, type) => {
  return async (dispatch) => {
    dispatch(reportActions.setLoading(true));

    try {
      dispatch(reportActions.setError(null));
      
      const res = await sendRequest(data);

      dispatch(reportActions.setLoading(false));

      if(type === 'advertiser') dispatch(reportActions.setAdvertiserData(res.data));
      if(type === 'publisher') dispatch(reportActions.setPublisherData(res.data));

    } catch (err) {
      dispatch(reportActions.setError(err));
      dispatch(reportActions.setLoading(false));
    }
  }
}

export const fetchAdvertiserReport = data => dispatch => dispatch(_reportPostRequest(getAdvertiserReports, data, 'advertiser'));

export const fetchPublisherReport = data => dispatch => dispatch(_reportPostRequest(getPublisherReports, data, 'publisher'));

export const abortReportRequest = () => {
  abortRequest();
}