import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { createWebsite } from "../../../store/actions/websites.action";
import PaperBlock from "../Common/PaperBlock";
import { websiteFormValidationSchema } from "./ValidationSchema";
import WebsiteForm from "./WebsiteForm";
import { Fragment } from "react";

const AddWebsite = () => {
  const dispatch = useDispatch();
  const initVal = {
    domain: "",
    category: "",
    language: "",
    traffic: 0,
  };

  const submitForm = (values) => {
    const data = values;

    dispatch(createWebsite(data));
  };

  return (
    <Fragment>
      <Helmet>
        <title>Add Website - AdTol</title>
      </Helmet>
      <PaperBlock heading="Add Website" fullWidth={true} headingCenter={true}>
        <Formik
          initialValues={initVal}
          validationSchema={websiteFormValidationSchema}
          onSubmit={(values, actions) => {
            submitForm(values);
          }}
        >
          <WebsiteForm edit={false} />
        </Formik>
      </PaperBlock>
    </Fragment>
  );
};

export default AddWebsite;
