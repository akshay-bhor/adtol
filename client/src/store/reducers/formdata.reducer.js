import { createSlice } from "@reduxjs/toolkit";

const formDataSlice = createSlice({
  name: "formdata",
  initialState: {
    countries: [],
    categories: [],
    languages: [],
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
    }
  },
});

export const formDataActions = formDataSlice.actions;

export default formDataSlice;
