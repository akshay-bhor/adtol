import { Formik } from "formik";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampaignFormData,
  fetchCountries,
  fetchWebsiteFormData,
} from "../../../store/actions/formdata.action";
import PaperBlock from "../Common/PaperBlock";
import * as luxon from "luxon";
import * as yup from "yup";
import CampaignForm from "./CampaignForm";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../../UI/Loading";
const DateTime = luxon.DateTime;

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
  url: yup.string().required("URL is required").url("Invalid URL"),
});

const initialData = {
  campaign_name: "",
  title: "",
  desc: "",
  url: "",
  category: "",
  country: "",
  device: "",
  os: "",
  browser: "",
  language: "",
  day: "",
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
  const goal = searchParams.get("type");

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

  return (
    <Fragment>
      {!formDataFetched && <Loading />}
      {formDataFetched() && (
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <CampaignForm type={type} edit={false} />
        </Formik>
      )}
    </Fragment>
  );
};

export default CreateCampaign;
