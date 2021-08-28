import { createSlice } from "@reduxjs/toolkit";

const formDataSlice = createSlice({
  name: "formdata",
  initialState: {
    countries: [],
    categories: [],
    languages: [],
    timezones: []
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
    }
  },
});

export const formDataActions = formDataSlice.actions;

export default formDataSlice;
