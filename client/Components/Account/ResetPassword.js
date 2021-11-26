import { useEffect } from "react";
import { Typography, makeStyles, Button, Box, Icon } from "@material-ui/core";
import { Form, Formik } from "formik";
import PaperBlock from "../Dashboard/Common/PaperBlock";
import * as yup from "yup";
import { MyTextField } from "../FormUtils/FormUtils";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui.reducer";
import { sendResetPass } from "../../store/actions/user.action";
import { useRouter } from "next/router";

const validationSchema = yup.object({
  pass: yup.string().required("Password is required").min(8, "Min 8 characters"),
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
  notice: {
    margin: '5px auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}));

const ResetPassword = () => {
  const muiStyles = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const success = useSelector((state) => state.user.success);
  const router = useRouter();
  const params = router.query;

  useEffect(() => {
    if (success) {
      dispatch(
        uiActions.showSnack({
          severity: "success",
          message: "Password Reset Successfull, try loggin in with new password",
        })
      );
    }
  }, [success]);

  const submitForm = (values) => {
    values.token = params.token;
    dispatch(sendResetPass(values));
  };

  return (
    <div className="block mt-60 pl-10 pr-10">
      <PaperBlock fullWidth={true}>
        <Box component="div" className={`${muiStyles.block} text-center`}>
          <Typography variant="h5" component="h2">
            Reset Password
          </Typography>
        </Box>
        <Formik
          initialValues={{
            pass: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitForm(values);
          }}
        >
          <Form className={muiStyles.fullWidth}>
            <MyTextField
              name="pass"
              type="password"
              label="New Password"
              className={muiStyles.block}
            />

            <Box component="div" className={[muiStyles.block, muiStyles.notice, "subtitle"].join(' ')}>
                <Icon>info</Icon>
                <Typography variant="subtitle2" className="iblock">&nbsp;&nbsp;Changing password will log you out of all the devices!</Typography>
            </Box>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={muiStyles.block}
              disabled={loading}
            >
              Reset Password
            </Button>
          </Form>
        </Formik>
      </PaperBlock>
    </div>
  );
};

export default ResetPassword;
