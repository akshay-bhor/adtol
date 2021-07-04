import { summaryActions } from "../reducers/summary.reducer";
import { abortRequest, getSummaryData } from "../../services/apiService";

const _summaryAPIRequest = (sendRequest) => {
    return async (dispatch) => {
        dispatch(summaryActions.setLoading(true));
    
        try {
          dispatch(summaryActions.setError(null));
          const getData = await sendRequest();
    
          if (getData) {
            dispatch(summaryActions.setData(getData.data));
          }
    
          dispatch(summaryActions.setLoading(false));
        } catch (err) {
            dispatch(summaryActions.setError(err));
            dispatch(summaryActions.setLoading(false));
        }
    };
}

export const fetchSummaryData = () => {
  return async (dispatch) => dispatch(_summaryAPIRequest(getSummaryData));
}

export const abortSummaryRequest = () => {
    abortRequest();
};