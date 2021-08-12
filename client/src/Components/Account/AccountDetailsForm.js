import { Button, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { updateAccountInfo } from "../../store/actions/user.action";
import { uiActions } from "../../store/reducers/ui.reducer";
import { MyTextField } from "../FormUtils/FormUtils";

const useStyles = makeStyles({
  block: {
    width: "60%",
    margin: "10px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  fullWidth: {
    width: "100%",
    textAlign: "center",
    display: "block",
  },
});

const validationSchema = yup.object({
  name: yup
    .string()
    .optional()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
  surname: yup
    .string()
    .optional()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
  mobile: yup
    .string("Enter your Phone")
    .required("Phone is required")
    .min(4, "Min phone length is 4")
    .max(10, "Max phone length is 10"),
});

const AccountDetailsForm = () => {
  const muiStyles = useStyles();
  const loading = useSelector((state) => state.user.loading);
  const userInfo = useSelector((state) => state.user.userInfo);
  const success = useSelector((state) => state.user.success);
  const dispatch = useDispatch();

  useEffect(() => {
    if(success) {
        dispatch(uiActions.showSnack({severity: 'success', message: "Account Details Updated Successfully"}))
    }
  }, [success]);

  if (!loading && Object.keys(userInfo).length === 0) return null;

  const submitForm = (values) => {
    dispatch(updateAccountInfo(values));
  }
    
  return (
    <Formik
      initialValues={{
        name: userInfo.name || '',
        surname: userInfo.surname || '',
        mobile: userInfo.mobile || '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        submitForm(values);
      }}
    >
      <Form className={muiStyles.fullWidth}>
        <MyTextField
          name="name"
          label="First Name"
          className={muiStyles.block}
        />
        <MyTextField
          name="surname"
          label="Last Name"
          className={muiStyles.block}
        />
        <MyTextField
          type="number"
          name="mobile"
          label="Phone"
          className={muiStyles.block}
        />
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
  );
};

export default AccountDetailsForm;
