import { Formik } from "formik";
import { Fragment, useEffect } from "react";
import styles from "./Register.module.css";
import { registerValidationSchema } from './ValidationSchema';
import { useDispatch, useSelector } from "react-redux";
import { handleRegister, abortAuthRequest } from "../../store/actions/auth.action";
import { abortFormDataRequest, fetchCountries } from "../../store/actions/formdata.action";
import LoadReCaptcha from "./LoadReCaptcha";
import { useHistory } from "react-router";
import FormContent from "./FormContent";
import { RECAPTCHA_SITE_KEY } from "../../util/load-scripts";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

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
  const history = useHistory();
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  const gSignInHandler = (data) => {
    history.push('/register/google');
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
          dispatch(handleRegister(data));
      });
    });
  };

  return (
    <Fragment>
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
            agreement: false
          }}
          validationSchema={registerValidationSchema}
          onSubmit={(values, actions) => {
            register(values, actions);
          }}
        >
          <FormContent
            onSuccess={gSignInHandler}
          />
        </Formik>
        <div className={`${muiStyles.block} ${muiStyles.link}`}><Link to="/login">Already have an account?</Link></div>
      </div>
    </Fragment>
  );
};

export default RegisterForm;
