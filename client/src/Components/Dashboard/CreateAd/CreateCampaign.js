import { Formik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const validationSchema = yup.object({
  campaign_name: yup
    .string()
    .required("Campaign Name is required")
    .min(3, "Min Length is 3")
    .max(50, "Max Length is 50"),
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Min length is 3")
    .max(50, "Max length is 50"),
  desc: yup
    .string()
    .required("Description is required")
    .min(3, "Min length is 3")
    .max(300, "Max length is 300"),
  url: yup.string().required("URL is required").matches(
    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    'Enter correct url!'
  ),
  timezone: yup.string().required('Timezone is required'),
  cpc: yup.number().required('CPC is required').min(0.02, 'Min CPC is $0.01'),
  budget: yup.number().required('Budget is required').min(1, 'Min budget is $1'),
  daily_budget: yup.number().required('Daily Budget is required').min(1, 'Min Daily Budget is $1'),
  run: yup.boolean().required('Run value is required'),
  adult: yup.boolean().required('Adult value is required'),
});

const initialData = {
  campaign_name: "",
  title: "",
  desc: "",
  url: "",
  timezone: "Asia/Kolkata",
  cpc: 0.02,
  adult: false,
  budget: 100,
  daily_budget: 10,
  run: true,
};

const CreateCampaign = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const type = params.type; // campaign or pop
  const searchParams = new URLSearchParams(location.search);
  const goal = searchParams.get("type") || 1;

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

  useEffect(() => {
    // Fetch timezones
    dispatch(fetchWebsiteFormData());
    dispatch(fetchCountries());
    dispatch(fetchCampaignFormData());
  }, []);

  const formDataFetched = () => {
    if (
      timezones.length > 0 &&
      categories.length > 0 &&
      languages.length > 0 &&
      countries.length > 0 &&
      devices.length > 0 &&
      os.length > 0 &&
      browsers.length > 0
    )
      return true;
    else return false;
  };

  const onSubmit = (values) => {
    const postData = {
      ...values,
      campaign_type: goal,
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
      {!formDataFetched && <Loading />}
      {formDataFetched() && (
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
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
          />
        </Formik>
      )}
    </Fragment>
  );
};

export default CreateCampaign;
