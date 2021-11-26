import { referralActions } from "../reducers/referrals.reducer";
import { abortRequest, getReferralStats } from "../../services/apiService";

const _referralAPIRequest = (sendRequest) => {
    return async (dispatch) => {
        dispatch(referralActions.setLoading(true));
    
        try {
          dispatch(referralActions.setError(null));
          const getData = await sendRequest();
    
          if (getData) {
            dispatch(referralActions.setData(getData.data));
          }
    
          dispatch(referralActions.setLoading(false));
        } catch (err) {
            dispatch(referralActions.setError(err));
            dispatch(referralActions.setLoading(false));
        }
    };
}

export const fetchReferralData = () => {
  return async (dispatch) => dispatch(_referralAPIRequest(getReferralStats));
}

export const abortReferralRequest = () => {
    abortRequest();
};