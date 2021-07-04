import { Form } from "formik";
import { Fragment } from "react";
import styles from "./Register.module.css";
import { useSelector } from "react-redux";
import { Button, makeStyles, MenuItem } from "@material-ui/core";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";
import { MyTextField, MySelectField } from "../FormUtils/FormUtils";

const useStyles = makeStyles({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  btn: {
    float:'left',
    minWidth: '190px',
    marginTop: '10px'
  }
});

const FormContent = (props) => { 
  const muiStyle = useStyles();
  const loading = useSelector((state) => state.auth.loading);
  const countries = useSelector((state) => state.formdata.countries);
  const hasRecaptcha = useSelector((state) => state.script.recaptcha);

  return (
    <Fragment>

          <Form className={styles.form}>
            <MyTextField
              name="user"
              type="text"
              label="Username"
              className={muiStyle.block}
            />
            {!props.isGoogle &&
            <MyTextField
              name="mail"
              type="text"
              label="Email"
              className={muiStyle.block}
            />}
            {!props.isGoogle &&
            <MyTextField
              name="pass"
              type="password"
              label="Password"
              className={muiStyle.block}
            />}
            <MySelectField
              name="country"
              label="Country"
              className={muiStyle.block}
            >
              {countries.map((country) => {
                return (
                  <MenuItem key={country.id} value={country.id}>
                    {country.country_name}
                  </MenuItem>
                );
              })}
            </MySelectField>
            <MyTextField
              name="mobile"
              type="number"
              label="Phone"
              className={muiStyle.block}
            />
            <MySelectField
              name="ac_type"
              label="Account Type"
              className={muiStyle.block}
            >
              <MenuItem value="1">Individual</MenuItem>
              <MenuItem value="2">Company</MenuItem>
            </MySelectField>
            <MyTextField
              name="company_name"
              type="text"
              label="Company Name"
              className={muiStyle.block}
            />
            <div className={[styles.submitContainer, 'w-60'].join(' ')}>
            <Button
              variant="contained"
              className={muiStyle.btn}
              type="submit"
              color="primary"
              disabled={loading || countries.length === 0 || !hasRecaptcha}
            >
              {loading ? "Please Wait..." : "Register"}
            </Button>
            {!props.isGoogle && <GoogleSignIn onSuccess={props.onSuccess} />}
            </div>
          </Form>

    </Fragment>
  );
};

export default FormContent;
