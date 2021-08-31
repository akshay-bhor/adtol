import { Formik } from "formik";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaignFormData, fetchCountries, fetchWebsiteFormData } from "../../../store/actions/formdata.action";
import PaperBlock from "../Common/PaperBlock";
import * as luxon from 'luxon';
import * as yup from 'yup';
const DateTime = luxon.DateTime;

const validationSchema = yup.object({
    campaign_name: yup.string().required('Campaign Name is required').min(3, 'Min Length is 3').max(50, 'Max Length is 50'),
    title: yup.string().required('Title is required').min(3, 'Min length is 3').max(50, 'Max length is 50'),
    desc: yup.string().required('Description is required').min(3, 'Min length is 3').max(300, 'Max length is 300'),
    url: yup.string().required('URL is required').url('Invalid URL'),

});

const CreateCampaign = () => {
  const timezones = useSelector((state) => state.formdata.timezones);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch timezones
    dispatch(fetchWebsiteFormData());
    dispatch(fetchCountries());
    dispatch(fetchCampaignFormData());
  }, []);

  const getInitialData = (type) => {
    return {
        campaign_name: '',
        title: '',
        desc: '',
        url: '',
        category: '',
        country: '',
        device: '',
        os: '',
        browser: '',
        language: '',
        day: '',
        timezone: 'Asia/Kolkata',
        cpc: 0.02,
        adult: 0,
        budget: 100,
        daily_budget: 10,
        run: 2
    }
  }
  
  return (
    <Fragment>
      <Formik
        initialValues={
            getInitialData()
        }
        validationSchema={validationSchema}
        onSubmit={(values) => {
            console.log(values);
        }}
      >
        <PaperBlock heading={"General"} fullWidth={true}></PaperBlock>

      </Formik>
    </Fragment>
  );
};

export default CreateCampaign;
