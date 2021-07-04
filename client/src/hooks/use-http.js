import { useState } from "react";
import axios from "axios";

const handleErrorResponse = (error) => {
  let errorResponse;
  if (error.response && error.response.data) {
    // API Error
    errorResponse = error.response.data.msg;
  } else if (error.request) {
    // NW Error
    errorResponse = 'Network error occured, please check your connectivity';
  } else {
    errorResponse = error.message;
  }
  return errorResponse;
}

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendGetRequest = async (reqConfig, applyData) => {
    try {
      setIsLoading(true);
      const res = await axios.get(reqConfig.url, reqConfig.config);
      setIsLoading(false);
      applyData(res.data);
    } catch (err) {
        setIsLoading(false);
        let error = handleErrorResponse(err);
        setError(error);
    }
  };

  const sendPostRequest = async (reqConfig, applyData) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        reqConfig.url,
        reqConfig.data,
        reqConfig.config
      );
      setIsLoading(false);
      applyData(res.data);
    } catch (err) {
      setIsLoading(false);
      let error = handleErrorResponse(err);
      setError(error);
    }
  }

  const clearError = () => {
    setError(null);
  }

  return {
    isLoading,
    error,
    sendGetRequest,
    sendPostRequest,
    clearError
  };
};

export default useHttp;
