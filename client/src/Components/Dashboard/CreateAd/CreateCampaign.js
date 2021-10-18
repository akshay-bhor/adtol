import { Formik } from "formik";
import { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  fetchCampaignFormData,
  fetchCountries,
  fetchWebsiteFormData,
} from "../../../store/actions/formdata.action";
import * as yup from "yup";
import CampaignForm from "./CampaignForm";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../../UI/Loading";
import { weekDaysList } from "../../../constants/common";
import { createCampaign } from "../../../store/actions/campaigns.action";
import { campaignActions } from "../../../store/reducers/campaigns.reducer";
import { fetchCampaignTypes } from "../../../store/actions/campaigns.action";
import TrafficEstimation from "./TrafficEstimation";

const CreateCampaign = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const type = params.type; // campaign or pop
  const queryParams = new URLSearchParams(location.search);
  const campType = queryParams.get("type") || 1;

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
  const [categoryState, setCategoryState] = useState(categories);
  const [langState, setLangState] = useState(languages);
  const [countryState, setCountryState] = useState(countries);
  const [deviceState, setDeviceState] = useState(devices);
  const [osState, setOsState] = useState(os);
  const [browserState, setBrowserState] = useState(browsers);
  const [daysState, setDaysState] = useState(weekDaysList);
  const [banners, setBanners] = useState([]);
  const [tfEstModalOpen, setTfEstModalOpen] = useState(false);

  useEffect(() => {
    // Fetch timezones, country, and settings
    dispatch(fetchWebsiteFormData());
    dispatch(fetchCountries());
    dispatch(fetchCampaignFormData());

    if(campTypeData.length === 0) dispatch(fetchCampaignTypes());
    
    // Clear campaign data
    return () => {
      dispatch(campaignActions.setCampaignData(null));
      dispatch(campaignActions.setError(null));
    }
  }, []);

  const getRequiredFields = useCallback(() => {
    return campTypeData.filter(data => data.id == campType)[0].fields.split(',');
  }, [campTypeData, campType]);

  /** Toggle modal */
  const toggleTrafficEstModal = () => {
    setTfEstModalOpen(prev => !prev);
  }

  /** Check if formdata fetched */
  const formDataFetched = () => {
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
      Object.keys(campSettings).length > 0
    )
      return true;
    else return false;
  };

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
      run: yup.boolean().required('Run value is required'),
      adult: yup.boolean().required('Adult value is required'),
    });
  }

  const getInitialFormData = useCallback(() => {
     // Intial form data
    const initialData = {
      campaign_name: "",
      url: "",
      timezone: "Asia/Kolkata",
      cpc: 0.02,
      adult: false,
      budget: 100,
      daily_budget: 10,
      run: true,
    };

    /**
     * If type campaign then add rel
     */
    if(type === 'campaign') {
      initialData.cpc = 0.03;
    }

    const requiredFields = getRequiredFields();

    if(requiredFields.includes('title')) initialData.title = '';
    if(requiredFields.includes('desc')) initialData.desc = '';
    if(requiredFields.includes('follow')) initialData.rel = 1;
    if(requiredFields.includes('btn')) initialData.btn = '';

    return initialData;
  }, [getRequiredFields]);

  const onSubmit = (values) => {
    const postData = {
      ...values,
      campaign_type: campType,
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
        type
      }
    }

    if(postData.banners.length === 0) {
      delete postData.banners;
    }

    dispatch(createCampaign(postData));
  }

  return (
    <Fragment>
      <Helmet>
        <title>Create Ad - AdTol</title>
      </Helmet>
      {!formDataFetched && <Loading />}
      {formDataFetched() && (
        <Formik
          initialValues={getInitialFormData()}
          validationSchema={getValidationSchema()}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
          {({ values }) => (
            <Fragment>
              <CampaignForm 
                type={type} 
                edit={false} 
                banners={banners}
                setBanners={setBanners}
                categoriesList={categories}
                setCategories={setCategoryState}
                languagesList={languages}
                setLanguages={setLangState}
                countriesList={countries}
                setCountries={setCountryState}
                devicesList={devices}
                setDevices={setDeviceState}
                osList={os}
                setOs={setOsState}
                browsersList={browsers}
                setBrowsers={setBrowserState}
                daysList={weekDaysList}
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
                campType={type}
                onClose={toggleTrafficEstModal}
              />:null}
            </Fragment>
          )}
        </Formik>
      )}
    </Fragment>
  );
};

export default CreateCampaign;
