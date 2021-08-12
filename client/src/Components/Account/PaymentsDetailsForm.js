import { Box, Button, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { updatePaymentInfo } from "../../store/actions/user.action";
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

const validationSchemaForeign = yup.object({
  paypal: yup.string().optional(),
  payoneer: yup.string().optional(),
});

const validationSchemaIN = yup.object({
  paypal: yup.string().optional(),
  payoneer: yup.string().optional(),
  upi: yup.string().optional(),
  bank: yup.string().optional(),
  acno: yup.string().when("bank", {
    is: (bank) => !!bank,
    then: yup.string().required("Account No is Required"),
  }),
  branch: yup.string().when("bank", {
    is: (bank) => !!bank,
    then: yup.string().required("Branch Name is Required"),
  }),
  ifsc: yup.string().when("bank", {
    is: (bank) => !!bank,
    then: yup.string().required("IFSC Code is Required"),
  }),
});

const PaymentDetailsForm = () => {
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

  const validationSchema =
    userInfo.country === "India" ? validationSchemaIN : validationSchemaForeign;

  const getInitialFormValues = () => {
    if (userInfo.country === "India") {
      return {
        paypal: userInfo.paypal || "",
        payoneer: userInfo.payoneer || "",
        upi: userInfo.upi || "",
        bank: userInfo.bank || "",
        acno: userInfo.acno || "",
        branch: userInfo.branch || "",
        ifsc: userInfo.ifsc || "",
      };
    } else {
      return {
        paypal: userInfo.paypal || "",
        payoneer: userInfo.payoneer || "",
      };
    }
  };

  const submitForm = (values) => {
    dispatch(updatePaymentInfo(values));
  };

  return (
    <Formik
      initialValues={getInitialFormValues()}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        submitForm(values);
      }}
    >
      {({ values }) => (
        <Form className={muiStyles.fullWidth}>
          <MyTextField
            name="paypal"
            label="Paypal"
            className={muiStyles.block}
          />
          <MyTextField
            name="payoneer"
            label="Payoneer"
            className={muiStyles.block}
          />
          {userInfo.country === "India" && (
            <Box component="div">
              <MyTextField name="upi" label="UPI" className={muiStyles.block} />
              <MyTextField
                name="bank"
                label="Bank"
                className={muiStyles.block}
              />
              <MyTextField
                name="acno"
                type="number"
                label="Account No."
                className={muiStyles.block}
                disabled={!values.bank}
              />
              <MyTextField
                name="branch"
                label="Branch"
                className={muiStyles.block}
                disabled={!values.bank}
              />
              <MyTextField
                name="ifsc"
                label="IFSC Code"
                className={muiStyles.block}
                disabled={!values.bank}
              />
            </Box>
          )}

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
      )}
    </Formik>
  );
};

export default PaymentDetailsForm;
