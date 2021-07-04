import axios from "axios";

const handleErrorResponse = (error) => {
  if (axios.isCancel(error)) {
    console.log(error);
    return null;
  } else {
    let errorResponse;
    if (error.response && error.response.data) { 
      // API Error
      errorResponse = error.response.data.msg;
    } else if (error.request) {
      // NW Error
      errorResponse = "Network error occured, please check your connectivity";
    } else {
      errorResponse = error.message;
    }
    return errorResponse;
  }
};

export default handleErrorResponse;
