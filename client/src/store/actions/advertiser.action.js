import { advertiserActions } from '../reducers/advertiser.reducer';
import { abortRequest, getAdvertiserData } from "../../services/apiService";

const _advertiserAPIRequest = (sendRequest) => {
    return async (dispatch) => {
        dispatch(advertiserActions.setLoading(true));
    
        try {
          dispatch(advertiserActions.setError(null));
          const getData = await sendRequest();
    
          if (getData) {
            dispatch(advertiserActions.setData(getData.data));
          }
    
          dispatch(advertiserActions.setLoading(false));
        } catch (err) {
            dispatch(advertiserActions.setError(err));
            dispatch(advertiserActions.setLoading(false));
        }
    };
}

export const fetchAdvertiserData = () => {
    return async (dispatch) => {
        dispatch(_advertiserAPIRequest(getAdvertiserData));
    }
}

export const abortAdvertiserRequest = () => {
    abortRequest();
};