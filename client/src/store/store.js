import { configureStore } from '@reduxjs/toolkit';
import authSlice from './reducers/auth.reducer';
import uiSlice from './reducers/ui.reducer';
import userSlice from './reducers/user.reducer';
import formDataSlice from './reducers/formdata.reducer';
import scriptSlice from './reducers/script.reducer';
import summarySlice from './reducers/summary.reducer';
import advertiserSlice from './reducers/advertiser.reducer';
import campaignsSlice from './reducers/campaigns.reducer';
import publisherSlice from './reducers/publisher.reducer';
import websiteSlice from './reducers/websites.reducer';
import referralSlice from './reducers/referrals.reducer';

const store = configureStore({
    reducer: { 
        ui: uiSlice.reducer,
        auth: authSlice.reducer,
        user: userSlice.reducer,
        formdata: formDataSlice.reducer,
        script: scriptSlice.reducer,
        summary: summarySlice.reducer,
        advertiser: advertiserSlice.reducer,
        publisher: publisherSlice.reducer,
        campaign: campaignsSlice.reducer,
        website: websiteSlice.reducer,
        referral: referralSlice.reducer
     }
});

export const { dispatch } = store; // Only import this in apiService

export default store;