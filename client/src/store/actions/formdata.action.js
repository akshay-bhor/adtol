import { formDataActions } from "../reducers/formdata.reducer";
import { abortRequest, getCountries, getWebsiteFormData } from "../../services/apiService";
import { authActions } from "../reducers/auth.reducer";

const _formDataAPIRequest = (sendRequest, which) => {
  return async (dispatch) => {
    dispatch(authActions.setLoading(true));

    try {
      const data = await sendRequest();

      dispatch(authActions.setLoading(false));

      if(which.includes("Countries"))  {
        const countryData = data.data.countries;
        dispatch(formDataActions.loadCountries(countryData));
      }
      if(which.includes("Categories")) {
        const catsData = data.data.categories;
        dispatch(formDataActions.loadCategories(catsData))
      }
      if(which.includes("Languages")) {
        const langData = data.data.languages;
        dispatch(formDataActions.loadLanguages(langData));
      }
      
    } catch (err) {
      dispatch(authActions.setLoading(false));
    }
  };
};

export const fetchCountries = () => {
  return async (dispatch) => dispatch(_formDataAPIRequest(getCountries, ["Countries"]));
}

export const fetchWebsiteFormData = () => {
  return async (dispatch) => dispatch(_formDataAPIRequest(getWebsiteFormData, ["Categories", "Languages"]))
}

export const abortFormDataRequest = () => {
    abortRequest();
}
