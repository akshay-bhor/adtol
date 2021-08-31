import { formDataActions } from "../reducers/formdata.reducer";
import { abortRequest, getCampaignFormData, getCountries, getWebsiteFormData } from "../../services/apiService";
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
      if(which.includes("Timezones")) {
        const tzData = data.data.timezones;
        dispatch(formDataActions.loadTimezones(tzData));
      }
      if(which.includes("Devices")) {
        const deviceData = data.data.devices;
        dispatch(formDataActions.loadDevices(deviceData));
      }
      if(which.includes("Os")) {
        const osData = data.data.os;
        dispatch(formDataActions.loadOs(osData));
      }
      if(which.includes("Browsers")) {
        const browserData = data.data.browsers;
        dispatch(formDataActions.loadBrowsers(browserData));
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

export const fetchCampaignFormData = () => {
  return async (dispatch) => dispatch(_formDataAPIRequest(getCampaignFormData, ["Timezones", "Devices", "Os", "Browsers"]))
}

export const abortFormDataRequest = () => {
    abortRequest();
}
