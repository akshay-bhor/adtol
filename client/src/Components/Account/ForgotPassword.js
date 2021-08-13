import { useEffect } from "react";
import { Typography, makeStyles, Button, Box } from "@material-ui/core";
import { Form, Formik } from "formik";
import PaperBlock from "../Dashboard/Common/PaperBlock";
import * as yup from "yup";
import { MyTextField } from "../FormUtils/FormUtils";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui.reducer";
import { sendForgotPass } from "../../store/actions/user.action";

const validationSchema = yup.object({
  mail: yup.string().required("Email is required").email("Invalida Email"),
});

const useStyles = makeStyles((theme) => ({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  fullWidth: {
    width: "100%",
    display: "block",
    textAlign: "center",
  },
}));

const ForgotPassword = () => {
  const muiStyles = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const success = useSelector((state) => state.user.success);

  useEffect(() => {
    if (success) {
      dispatch(
        uiActions.showSnack({
          severity: "success",
          message: "Password Reset Link has been sent successfully",
        })
      );
    }
  }, [success]);

  const submitForm = (values) => {
    dispatch(sendForgotPass(values));
  };

  return (
    <div className="block mt-60 pl-10 pr-10">
      <PaperBlock fullWidth={true}>
        <Box component="div" className={`${muiStyles.block} text-center`}>
          <Typography variant="h5" component="h2">
            Forgot Password?
          </Typography>
        </Box>
        <Formik
          initialValues={{
            mail: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitForm(values);
          }}
        >
          <Form className={muiStyles.fullWidth}>
            <MyTextField
              name="mail"
              label="Your Email"
              className={muiStyles.block}
            />

            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={muiStyles.block}
              disabled={loading}
            >
              Send Password Reset Link
            </Button>
          </Form>
        </Formik>
      </PaperBlock>
    </div>
  );
};

export default ForgotPassword;
