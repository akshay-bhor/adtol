import { Formik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import { abortWebsiteRequest, updateWebsite } from "../../../store/actions/websites.action";
import PaperBlock from "../Common/PaperBlock";
import { websiteFormValidationSchema } from "./ValidationSchema";
import WebsiteForm from "./WebsiteForm";

const EditWebsite = () => {
    const websiteData = useSelector((state) => state.website.data);
    const router = useRouter();
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState();

    useEffect(() => {

        const extractFormValues = () => {
            // Extract form values from websiteData
            const webid = router.query.id;
            let tmpVal = websiteData.filter(data => data.id == webid)[0];
            
            setFormValues(() => {
                return {
                    domain: tmpVal.domain,
                    category: tmpVal.category,
                    language: tmpVal.language,
                    traffic: tmpVal.traffic
                };
            });
        }

        if(websiteData.length === 0) router.push("/dashboard/websites");
        else extractFormValues();

        // cleanup
        return () => {
            abortWebsiteRequest();
        }
    }, []);

    const submitForm = (values) => {
        const data = {};
        data.id = router.query.id;
        data.data= values;

        dispatch(updateWebsite(data));
    }
   
    return (
        <Fragment>
            <Head>
                <title>Edit Website - AdTol</title>
            </Head>
            <PaperBlock heading="Edit Website" fullWidth={true} headingCenter={true}>
                {formValues !== undefined && <Formik
                    initialValues={formValues}
                    validationSchema={websiteFormValidationSchema}
                    onSubmit={(values, actions) => {
                        submitForm(values);
                    }}
                >
                    <WebsiteForm edit={true} />
                </Formik>}
            </PaperBlock>
        </Fragment>
    );
}

export default EditWebsite;
