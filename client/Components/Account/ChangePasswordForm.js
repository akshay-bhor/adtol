import { useEffect } from "react";
import { Box, Button, Icon, makeStyles, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { MyTextField } from "../FormUtils/FormUtils";
import * as yup from 'yup';
import { handlePasswordChange } from "../../store/actions/auth.action";
import { uiActions } from "../../store/reducers/ui.reducer";

const useStyles = makeStyles({
  block: {
    width: "60%",
    margin: "10px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  fullWidth: {
      width: '100%',
      textAlign: 'center',
      display: 'block',
  },
  notice: {
    margin: '5px auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

const validationSchema = yup.object({
    opass: yup.string().required('Old Password is required').min(8, 'Min length is 8'),
    npass: yup.string().required('New Password is required').min(8, 'Min length is 8').notOneOf([yup.ref('opass')], 'New Password cannot be old password'),
    cpass: yup.string().required('Confirm new password').oneOf([yup.ref('npass')], 'Passwords must match')
})

const ChangePasswordForm = () => {
  const muiStyles = useStyles();
  const loading = useSelector((state) => state.auth.loading);
  const success = useSelector((state) => state.auth.success);
  const dispatch = useDispatch();

  useEffect(() => {
    if(success) {
        dispatch(uiActions.showSnack({severity: 'success', message: "Password Changed Successfully"}))
    }
  }, [success]);

  const changePassword = (values) => {
    dispatch(handlePasswordChange(values));
  };

  return (
    <Box component="div">
      <Formik
        initialValues={{
          opass: "",
          npass: "",
          cpass: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          changePassword(values);
        }}
      >
        <Form className={muiStyles.fullWidth}>
          <MyTextField
            type="password"
            name="opass"
            label="Old Password"
            className={muiStyles.block}
          />
          <MyTextField
            type="password"
            name="npass"
            label="New Password"
            className={muiStyles.block}
          />
          <MyTextField
            type="password"
            name="cpass"
            label="Confirm Password"
            className={muiStyles.block}
          />
          <Box component="div" className={[muiStyles.block, muiStyles.notice, "subtitle"].join(' ')}>
            <Icon>info</Icon>
            <Typography variant="subtitle2" className="iblock">&nbsp;&nbsp;Changing password will log you out of all the devices except this one.</Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className={muiStyles.block}
            color="primary"
          >
            Change
          </Button>
        </Form>
      </Formik>
    </Box>
  );
};

export default ChangePasswordForm;
