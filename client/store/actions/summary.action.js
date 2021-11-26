import { summaryActions } from "../reducers/summary.reducer";
import { abortRequest, getSummaryData, getUserStatus } from "../../services/apiService";

const _summaryAPIRequest = (sendRequest, which) => {
    return async (dispatch) => {
        dispatch(summaryActions.setLoading(true));
    
        try {
          dispatch(summaryActions.setError(null));
          const getData = await sendRequest();
    
          if (getData) {
            if(which === 'data') dispatch(summaryActions.setData(getData.data));
            if(which === 'userStatus') dispatch(summaryActions.setUserStatus(getData.data));
          }
    
          dispatch(summaryActions.setLoading(false));
        } catch (err) {
            dispatch(summaryActions.setError(err));
            dispatch(summaryActions.setLoading(false));
        }
    };
}

export const fetchSummaryData = () => {
  return async (dispatch) => dispatch(_summaryAPIRequest(getSummaryData, 'data'));
}

export const fetchUserStatus = () => {
  return async (dispatch) => dispatch(_summaryAPIRequest(getUserStatus, 'userStatus'));
}

export const abortSummaryRequest = () => {
    abortRequest();
};