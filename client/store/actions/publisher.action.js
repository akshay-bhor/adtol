import { publisherActions } from "../reducers/publisher.reducer";
import { abortRequest, getPublisherData } from "../../services/apiService";

const _publisherAPIRequest = (sendRequest) => {
    return async (dispatch) => {
        dispatch(publisherActions.setLoading(true));
    
        try {
          dispatch(publisherActions.setError(null));
          const getData = await sendRequest();
    
          if (getData) {
            dispatch(publisherActions.setData(getData.data));
          }
    
          dispatch(publisherActions.setLoading(false));
        } catch (err) {
            dispatch(publisherActions.setError(err));
            dispatch(publisherActions.setLoading(false));
        }
    };
}

export const fetchPublisherData = () => {
  return async (dispatch) => dispatch(_publisherAPIRequest(getPublisherData));
}

export const abortPublisherRequest = () => {
    abortRequest();
};