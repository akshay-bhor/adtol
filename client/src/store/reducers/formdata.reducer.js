import { createSlice } from "@reduxjs/toolkit";

const formDataSlice = createSlice({
  name: "formdata",
  initialState: {
    countries: [],
    categories: [],
    languages: [],
    timezones: [],
    devices: [],
    os: [],
    browsers: [],
    btns: [],
    campaign_settings: {}
  },
  reducers: {
    loadCountries(state, action) {
      state.countries = action.payload;
    },
    loadCategories(state, action) {
      state.categories = action.payload;
    },
    loadLanguages(state, action) {
      state.languages = action.payload;
    },
    loadTimezones(state, action) {
      state.timezones = action.payload;
    },
    loadDevices(state, action) {
      state.devices = action.payload
    },
    loadOs(state, action) {
      state.os = action.payload
    },
    loadBrowsers(state, action) {
      state.browsers = action.payload
    },
    loadBtns(state, action) {
      state.btns = action.payload
    },
    loadCampaignSettings(state, action) {
      state.campaign_settings = action.payload
    }
  },
});

export const formDataActions = formDataSlice.actions;

export default formDataSlice;
