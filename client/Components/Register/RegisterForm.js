import { Formik } from "formik";
import { useEffect } from "react";
import styles from "./Register.module.css";
import { registerValidationSchema } from './ValidationSchema';
import { useDispatch, useSelector } from "react-redux";
import { handleRegister, abortAuthRequest } from "../../store/actions/auth.action";
import { abortFormDataRequest, fetchCountries } from "../../store/actions/formdata.action";
import LoadReCaptcha from "../Common/LoadReCaptcha";
import { useRouter } from "next/router";
import FormContent from "./FormContent";
import { RECAPTCHA_SITE_KEY } from "../../util/load-scripts";
import Link from "next/link";
import { makeStyles } from "@material-ui/core";
import { createCookie, getCookie } from "../../util/common";
import RegisterWrapper from "./RegisterWrapper";

const useStyles = makeStyles((theme) => ({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  link: {
    color: theme.palette.primary.main
  }
}));

const RegisterForm = () => { 
  const countries = useSelector((state) => state.formdata.countries);
  const router = useRouter();
  const ref_by = router.query.ref || getCookie('ref') || '';
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  const gSignInHandler = (data) => {
    router.push('/register/google');
  }

  useEffect(() => {
    const getCountries = () => {
      if (countries.length === 0) {
        dispatch(fetchCountries());
      }
    };

    getCountries();
  }, [countries, dispatch]);

  useEffect(() => {
    // Set cookie
    if(ref_by) createCookie('ref', ref_by, 90);

    // On unmount
    return () => {  
      abortAuthRequest();
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
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'submit'}).then((token) => {
          data.grecaptcha = token;
          // Send Request
          dispatch(handleRegister(data, '/dashboard'));
      });
    });
  };

  return (
    <RegisterWrapper>
      <LoadReCaptcha />
      <div className={styles.registerContainer}>
        <h2 className={"block text-center"}>Register</h2>
        <Formik
          initialValues={{
            user: "",
            pass: "",
            mail: "",
            country: "",
            mobile: "",
            ac_type: "",
            company_name: "",
            ref_by: ref_by,
            agreement: false
          }}
          validationSchema={registerValidationSchema}
          onSubmit={(values, actions) => {
            register(values, actions);
          }}
        >
          {({ values }) => (
            <FormContent
              onSuccess={gSignInHandler}
              formValues={values}
            />
          )}
        </Formik>
        <div className={`${muiStyles.block} ${muiStyles.link}`}><Link href="/login"><a>Already have an account?</a></Link></div>
      </div>
    </RegisterWrapper>
  );
};

export default RegisterForm;
