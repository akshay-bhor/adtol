import { Fragment, useEffect } from "react";
import styles from "./Login.module.css";
import { MyTextField } from "../FormUtils/FormUtils";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { handleGLogin, handleLogin } from "../../store/actions/auth.action";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";
import { abortRequest } from "../../services/apiService";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  btn: {
    float: "left",
    alignSelf: "flex-start",
    minWidth: "190px",
    marginTop: "10px",
  },
  link: {
    color: theme.palette.primary.main
  }
}));

const validationSchema = yup.object({
  client: yup
    .string("Enter your username/email")
    .required("Username/email is required")
    .min(4, "Min username length is 4"),
  pass: yup
    .string("Enter your password")
    .min(8, "Min password length is 8")
    .required("Password is required"),
});

const LoginForm = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  useEffect(() => {
    // Run on component unmount
    return () => {
      abortRequest();
    };
  }, []);

  const login = (data) => {
    dispatch(handleLogin(data));
  };

  const gLogin = (gToken) => {
    let data = {};
    data.gToken = gToken;
    dispatch(handleGLogin(data));
  };

  return (
    <Fragment>
      <Helmet>
        <title>Login - AdTol</title>
      </Helmet>
      <div className={styles.loginContainer}>
        <h2 className={`${styles.block} ${styles.center}`}>Login</h2>
        <Formik
          initialValues={{
            client: "",
            pass: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            login(values);
          }}
        >
          <Form className={styles.form}>
            <MyTextField
              name="client"
              type="text"
              label="Email/Username"
              className={muiStyles.block}
            />
            <MyTextField
              name="pass"
              type="password"
              label="Password"
              className={muiStyles.block}
            />
            <div className={[styles.submitContainer, "w-60"].join(" ")}>
              <Button
                variant="contained"
                className={muiStyles.btn}
                type="submit"
                color="primary"
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Login"}
              </Button>
              <GoogleSignIn onSuccess={gLogin} />
            </div>
          </Form>
        </Formik>
        <div className={`${muiStyles.block} ${muiStyles.link}`}><Link to="/forgot-password">Forgot Password?</Link></div>
        <div className={`${muiStyles.block} ${muiStyles.link}`}><Link to="/register">Don't have an account?</Link></div>
      </div>
    </Fragment>
  );
};

export default LoginForm;
