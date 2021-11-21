import { Formik } from "formik";
import { useEffect } from "react";
import styles from "./Register.module.css";
import { googleRegisterValidationSchema } from './ValidationSchema';
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "../../store/actions/auth.action";
import { abortFormDataRequest, fetchCountries  } from "../../store/actions/formdata.action";
import LoadReCaptcha from "../Common/LoadReCaptcha";
import FormContent from "./FormContent";
import { abortRequest } from "../../services/apiService";
import RegisterWrapper from "./RegisterWrapper";

const SITE_KEY = '6LcIF9waAAAAAM6J1cr9odD8vAi3Yh73Gi2HqG16';

const RegisterGoogle = () => { 
  const countries = useSelector((state) => state.formdata.countries);
  const gToken = useSelector((state) => state.auth.gToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCountries = () => {
      if (countries.length === 0) {
        dispatch(fetchCountries());
      }
    };

    getCountries();
  }, [countries, dispatch]);

  useEffect(() => {
    // On unmount
    return () => {  
      abortRequest();
      abortFormDataRequest();
    }
  }, []);

  const register = (data, actions) => {
    // Check ac type
    if (data.ac_type == 2 && data.company_name == "") {
      actions.setErrors({ company_name: "Company Name is required" });
      return;
    }
    // Call Recaptcha
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, {action: 'submit'}).then((token) => {
          data.grecaptcha = token;
          data.gToken = gToken;
          dispatch(handleRegister(data, '/dashboard'));
      });
    });
  };

  return (
    <RegisterWrapper>
      <LoadReCaptcha />
      <div className={styles.registerContainer}>
        <h2 className={`${styles.block} ${styles.center}`}>Complete your Google Registration</h2>
        <Formik
          initialValues={{
            user: "",
            country: "",
            mobile: "",
            ac_type: "",
            company_name: "",
          }}
          validationSchema={googleRegisterValidationSchema}
          onSubmit={(values, actions) => {
            register(values, actions);
          }}
        >
          {({ values }) => (
            <FormContent
              isGoogle={'true'}
              formValues={values}
            />
          )}
        </Formik>
        
      </div>
    </RegisterWrapper>
  );
};

export default RegisterGoogle;
