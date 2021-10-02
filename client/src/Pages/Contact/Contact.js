import { Box, Button, Grid, Icon, makeStyles, Typography } from "@material-ui/core";
import { Fragment, useState } from "react";
import LayeredQuote from "../Common/LayeredQuote";
import Footer from "../../Components/UI/Footer/Footer";
import styles from "../Common/Content.module.css";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { MyTextField } from "../../Components/FormUtils/FormUtils";
import { sendMessageApi } from "../../services/apiService";
import { uiActions } from "../../store/reducers/ui.reducer";
import LoadReCaptcha from "../../Components/Common/LoadReCaptcha";
import { RECAPTCHA_SITE_KEY } from "../../util/load-scripts";

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Min length is 3")
    .max(25, "Max length is 25"),
  email: yup.string().required("Email is required").email("Invalid Email"),
  subject: yup
    .string()
    .required("Subject is required")
    .min(3, "Min length is 3")
    .max(60, "Max length is 60"),
  message: yup
    .string()
    .required("Message is required")
    .min(5, "Min length is 5")
    .max(500, "Max length is 500"),
});

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "50px auto",
    maxWidth: "800px",
    fontSize: "1.2em",
    padding: "10px",
  },
  formContainer: {
      marginTop: '20px'
  },
  iconContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: theme.palette.primary.main,
    marginBottom: "10px",
  },
  block: {
      width: '100%',
      marginBottom: '15px'
  }
}));

const Contact = () => {
  const muiStyles = useStyles();
  // Load user email
  const userMail = useSelector((state) => state.user.email);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const submitForm = async (values) => {
      try {
        // Call Recaptcha
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'submit'}).then(async (token) => {
                values.grecaptcha = token;
                try {
                    // Send Request
                    setLoading(true);
                    const res = await sendMessageApi(values);
                    // Show snack
                    dispatch(uiActions.showSnack({severity: 'success', message: "Message Send Successfully!"}));
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                }
            });
        });
      } catch (err) {
        setLoading(false);
      }
  }

  return (
    <Fragment>
      <Helmet>
        <title>Contact Us - AdTol</title>
      </Helmet>
      <LoadReCaptcha />
      <Box component="div" className={muiStyles.container}>
        <h2 className={styles.content_heading}>Contact Us</h2>

        <Grid container spacing={2} className={muiStyles.formContainer}>
          <Grid item sm={12} md={6}>
            <Formik
              initialValues={{
                name: "",
                email: userMail,
                subject: "",
                message: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                submitForm(values);
              }}
            >
              <Form>
                <MyTextField 
                    name="name"
                    type="text"
                    label="Name"
                    className={muiStyles.block}
                />
                <MyTextField 
                    name="email"
                    type="text"
                    label="Email"
                    className={muiStyles.block}
                />
                <MyTextField 
                    name="subject"
                    type="text"
                    label="Subject"
                    className={muiStyles.block}
                />
                <MyTextField 
                    name="message"
                    type="text"
                    label="Message"
                    multiline={true}
                    className={muiStyles.block}
                />
                <Button type="submit" 
                    className={muiStyles.block} 
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    Send
                </Button>
              </Form>
            </Formik>
          </Grid>

          <Grid item sm={12} md={6}>
            <Typography variant="subtitle1">
              Contact us and we'll get back to you within 24 hours.
            </Typography>
            <Box component="div" className={muiStyles.iconContainer}>
              <Icon>place</Icon>&nbsp;&nbsp;2nd Floor, Laxmi Plaza, BSNL Road,
              Narayangaon, Pune - 410504
            </Box>
            <Box component="div" className={muiStyles.iconContainer}>
              <Icon>email</Icon>&nbsp;&nbsp;adtol.com@gmail.com
            </Box>
          </Grid>
        </Grid>
      </Box>
      <LayeredQuote />
      <Footer />
    </Fragment>
  );
};

export default Contact;
