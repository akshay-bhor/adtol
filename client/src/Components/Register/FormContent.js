import { Form } from "formik";
import { Fragment } from "react";
import styles from "./Register.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, makeStyles, MenuItem } from "@material-ui/core";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";
import { MyTextField, MySelectField, MyCheckboxField } from "../FormUtils/FormUtils";

const useStyles = makeStyles(theme => ({
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
  },
  link: {
    color: theme.palette.primary.main
  }
}));

const FormContent = (props) => { 
  const muiStyle = useStyles();
  const loading = useSelector((state) => state.auth.loading);
  const countries = useSelector((state) => state.formdata.countries);
  const hasRecaptcha = useSelector((state) => state.script.recaptcha);

  const checkboxLabel = (<Fragment>
      I have read and agree to 
      <Link to="/guidelines" className={muiStyle.link}> guidelines </Link> 
      and <Link to="/tos" className={muiStyle.link}>terms of service</Link>
    </Fragment>
  );

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
                    {country.name}
                  </MenuItem>
                );
              })}
            </MySelectField>
            <MyTextField
              name="mobile"
              type="number"
              label="Phone"
              inputProps={{min:0}}
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
            <MyTextField
              name="ref_by"
              type="text"
              label="Have a Referrel Code?"
              className={muiStyle.block}
            />
            <MyCheckboxField
              name="agreement"
              type="checkbox"
              label={checkboxLabel}
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
