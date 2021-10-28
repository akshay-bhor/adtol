import { Formik } from "formik";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  fetchCampaignFormData,
  fetchCountries,
  fetchWebsiteFormData,
} from "../../../store/actions/formdata.action";
import * as yup from "yup";
import CampaignForm from "./CampaignForm";
import { useParams } from "react-router-dom";
import Loading from "../../UI/Loading";
import { weekDaysList } from "../../../constants/common";
import { editCampaign, fetchCampaignData, fetchCampaignTypes } from "../../../store/actions/campaigns.action";
import { campaignActions } from "../../../store/reducers/campaigns.reducer";
import TrafficEstimation from "./TrafficEstimation";

const EditCampaign = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const type = params.type; // campaign or pop
  const campaign_id = params.campid;
  const campaignData = useSelector(state => state.campaign.campaign_data);

  /**
   * FormData
   */
  const timezones = useSelector((state) => state.formdata.timezones);
  const categories = useSelector((state) => state.formdata.categories);
  const languages = useSelector((state) => state.formdata.languages);
  const countries = useSelector((state) => state.formdata.countries);
  const devices = useSelector((state) => state.formdata.devices);
  const os = useSelector((state) => state.formdata.os);
  const browsers = useSelector((state) => state.formdata.browsers);
  const btns = useSelector((state) => state.formdata.btns);
  const campSettings = useSelector((state) => state.formdata.campaign_settings);
  const campTypeData = useSelector((state) => state.campaign.campaign_types);
  /**
   * End
   */

  /**
   * States
   */
  const [categoryState, setCategoryState] = useState(null);
  const [langState, setLangState] = useState(null);
  const [countryState, setCountryState] = useState(null);
  const [deviceState, setDeviceState] = useState(null);
  const [osState, setOsState] = useState(null);
  const [browserState, setBrowserState] = useState(null);
  const [daysState, setDaysState] = useState(weekDaysList);
  const [banners, setBanners] = useState([]);
  const [stateUpdated, setStateUpdated] = useState(false);
  const [tfEstModalOpen, setTfEstModalOpen] = useState(false);

  useEffect(() => {
    // Campaign Data
    const postData = {
        campid: campaign_id
    }
    // Fetch timezones
    dispatch(fetchWebsiteFormData());
    dispatch(fetchCountries());
    dispatch(fetchCampaignFormData());
    dispatch(fetchCampaignData(postData));

    if(campTypeData.length === 0) dispatch(fetchCampaignTypes());

    // Clear campaign data
    return () => {
        dispatch(campaignActions.setCampaignData(null));
        dispatch(campaignActions.setError(null));
    }
  }, []);

  const getRequiredFields = useCallback(() => {
    if(!campaignData.campaign_type) return [];
    return campTypeData.filter(data => data.id == campaignData.campaign_type)[0].fields.split(',');
  }, [campTypeData, campaignData]);

  /** Toggle modal */
  const toggleTrafficEstModal = () => {
    setTfEstModalOpen(prev => !prev);
  }

  const updateStates = () => {
    if(stateUpdated) return;

    if(campaignData.category.length === 1 && campaignData.category[0] === 0) 
      setCategoryState(_ => categories);
    else setCategoryState(_ => campaignData.category.map(id => {
        const {name} = categories.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.language.length === 1 && campaignData.language[0] === 0)  
      setLangState(_ => languages);
    else setLangState(_ => campaignData.language.map(id => {
        const {name} = languages.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.country.length === 1 && campaignData.country[0] === 0)
      setCountryState(_ => countries);
    else setCountryState(_ => campaignData.country.map(id => {
        const {name} = countries.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.device.length === 1 && campaignData.device[0] === 0)  
      setDeviceState(_ => devices);
    else setDeviceState(_ => campaignData.device.map(id => {
        const {name} = devices.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.os.length === 1 && campaignData.os[0] === 0)
      setOsState(_ => os);
    else setOsState(_ => campaignData.os.map(id => {
        const {name} = os.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.browser.length === 1 && campaignData.browser[0] === 0)
      setBrowserState(_ => browsers);
    else setBrowserState(_ => campaignData.browser.map(id => {
        const {name} = browsers.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.day.length === 1 && campaignData.day[0] === 0)  {}
    else setDaysState(_ => campaignData.day.map(id => {
        const {name} = weekDaysList.filter(item => item.id === id)[0];
        return {id, name};
    }));

    if(campaignData.banners.length === 1 && campaignData.banners[0] === 0)  {}
    else setBanners(_ => campaignData.banners);

    setStateUpdated(_ => true);
  }

  const getInitialData = () => {
    const initData = {
        campaign_name: campaignData.campaign_name,
        url: campaignData.url,
        timezone: campaignData.timezone,
        cpc: campaignData.cpc,
        adult: campaignData.adult === 0 ? false:true,
        budget: campaignData.budget,
        daily_budget: campaignData.daily_budget
    };
    
    const requiredFields = getRequiredFields();

    if(requiredFields.includes('title')) initData.title = campaignData.title;
    if(requiredFields.includes('desc')) initData.desc = campaignData.desc;
    if(requiredFields.includes('follow')) initData.rel = campaignData.rel;
    if(requiredFields.includes('btn')) initData.btn = campaignData.btn;

    return initData;
  }

  const formDataFetched = useCallback(() => {
    if (
      timezones.length > 0 &&
      categories.length > 0 &&
      languages.length > 0 &&
      countries.length > 0 &&
      devices.length > 0 &&
      os.length > 0 &&
      browsers.length > 0 &&
      btns.length > 0 &&
      campTypeData.length > 0 &&
      campaignData !== null
    )
      return true;
    else return false;
  }, [timezones, categories, languages, countries, devices, os, browsers, btns, campaignData, campTypeData]);

  useEffect(() => {
    if(formDataFetched()) updateStates();
  }, [formDataFetched]);

  const getValidationSchema = () => {
    const min_cpc = type === 'campaign' ? campSettings.min_cpc:campSettings.min_pop_cpc;
    const requiredFields = getRequiredFields();
    const titleSchema = requiredFields.includes('title') 
    ? 
      yup.string()
      .required('title is required')
      .min(3, "Min length is 3")
      .max(55, "Max length is 55")
    : yup.string().optional();

    const descSchema = requiredFields.includes('desc')
    ?
      yup
        .string()
        .required('Description is required')
        .min(3, "Min length is 3")
        .max(300, "Max length is 300")
      : yup.string().optional();

    const relSchema = requiredFields.includes('follow')
    ?
      yup.number()
      .required('Follow is required')
    : yup.number().optional();

    const btnSchema = requiredFields.includes('btn')
    ?
      yup.number()
      .required('Button is required')
    : yup.number().optional();

    return yup.object({
      campaign_name: yup
        .string()
        .required("Campaign Name is required")
        .min(3, "Min Length is 3")
        .max(55, "Max Length is 55"),
      title: titleSchema,
      desc: descSchema,
      url: yup.string().max(2000, "Max length is 2000").required("URL is required").url('Invalid URL, make sure to add https://'),
      timezone: yup.string().required('Timezone is required'),
      rel: relSchema,
      btn: btnSchema,
      cpc: yup.number().required('CPC is required').when('rel', {
        is: 1,
        then: yup.number().min((min_cpc + 0.001), `Min CPC when DoFollow is $${(min_cpc + 0.001)}`)
      })
      .when('rel', {
        is: (rel) => rel !== 1,
        then: yup.number().min(min_cpc, `Min CPC is $${min_cpc}`)
      }),
      budget: yup.number().required('Budget is required').min(campSettings.min_budget, `Min budget is $${campSettings.min_budget}`),
      daily_budget: yup.number().required('Daily Budget is required').min(campSettings.min_daily_budget, `Min Daily Budget is $${campSettings.min_daily_budget}`),
      adult: yup.boolean().required('Adult value is required'),
    });
  }

  const onSubmit = (values) => {
    const postData = {
      ...values,
      campaign_type: campaignData.campaign_type,
      banners: banners.join(','),
      category: categoryState.length === categories.length ? '0':categoryState.join(','),
      country: countryState.length > 150 ? '0':countryState.join(','),
      device:  deviceState.length === devices.length ? '0':deviceState.join(','),
      os: osState.length === os.length ? '0':osState.join(','),
      browser: browserState.length === browsers.length ? '0':browserState.join(','),
      language: langState.length === languages.length ? '0':langState.join(','),
      day: daysState.length === 7 ? '0':daysState.join(','),
      run: values.run ? 1:2,
      adult: values.adult ? 1:0,
      params: {
        type,
        campaign_id
      }
    }

    if(postData.banners.length === 0) {
      delete postData.banners;
    }

    dispatch(editCampaign(postData));
  }

  return (
    <Fragment>
      <Helmet>
        <title>Edit Ad - AdTol</title>
      </Helmet>
      {!stateUpdated && <Loading />}
      {stateUpdated && (
        <Formik
          initialValues={getInitialData()}
          validationSchema={getValidationSchema()}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
          {({ values }) => (
            <Fragment>
              <CampaignForm 
                type={type} 
                edit={true} 
                banners={banners}
                setBanners={setBanners}
                categoriesList={categoryState}
                setCategories={setCategoryState}
                languagesList={langState}
                setLanguages={setLangState}
                countriesList={countryState}
                setCountries={setCountryState}
                devicesList={deviceState}
                setDevices={setDeviceState}
                osList={osState}
                setOs={setOsState}
                browsersList={browserState}
                setBrowsers={setBrowserState}
                daysList={daysState}
                setDays={setDaysState}
                trafficEstModalToggle={toggleTrafficEstModal}
                requiredFields={getRequiredFields()}
              />
              {tfEstModalOpen ? <TrafficEstimation
                adult={values.adult}
                categories={categoryState}
                devices={deviceState}
                os={osState}
                countries={countryState}
                browsers={browserState}
                languages={langState}
                type={type}
                campType={campaignData.campaign_type}
                onClose={toggleTrafficEstModal}
              />:null}
            </Fragment>
          )}
        </Formik>
      )}
    </Fragment>
  );
};

export default EditCampaign;
