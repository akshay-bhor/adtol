import { Formik, Form } from "formik";
import { useEffect, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  abortBillingRequest,
  fetchFormData,
  makeWithdraw,
} from "../../../../store/actions/billing.action";
import { billingActions } from "../../../../store/reducers/billing.reducer";
import Loading from "../../../UI/Loading";
import ShowError from "../../../UI/ShowError";
import PaperBlock from "../../Common/PaperBlock";
import styles from "../../Dashboard.module.css";
import * as yup from "yup";
import { MySelectField, MyTextField } from "../../../FormUtils/FormUtils";
import { Box, Button, makeStyles, MenuItem } from "@material-ui/core";
import { Icon } from "@material-ui/core";
import BillingConfirmModal from "../BillingConfirmModal";

const useStyles = makeStyles({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  info: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "#666",
  },
  btnContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-start",
  }
});

const processors = [
  {
    title: "Bank",
    value: 1,
  },
  {
    title: "Paypal",
    value: 2,
  },
  {
    title: "Payoneer",
    value: 3,
  },
];

const Withdraw = () => {
  const loading = useSelector((state) => state.billing.loading);
  const err = useSelector((state) => state.billing.error);
  const formData = useSelector((state) => state.billing.formData);
  const modalOpen = useSelector((state) => state.billing.modalOpen);
  const [withdrawFormData, setWithdrawFormData] = useState();
  const dispatch = useDispatch();
  const muiStyles = useStyles();
  let validationSchema;

  useEffect(() => {
    // Fetch formdata
    dispatch(fetchFormData());

    return () => {
      abortBillingRequest();
      dispatch(billingActions.clearError());
    };
  }, []);

  const handleModalToggle = (toggle) => {
    dispatch(billingActions.setModalOpen(toggle));
  };

  const submitForm = () => {
    dispatch(makeWithdraw(withdrawFormData));
  };

  // Create validation schema
  if (!loading && !err && formData !== null) {
    validationSchema = yup.object({
      amt: yup
        .number()
        .required("Amount is required")
        .min(
          formData.min_withdraw,
          `Min withdraw amount is ${formData.min_withdraw}`
        )
        .max(formData.pub_bal, `Max withdraw amount is ${formData.pub_bal}`),
      processor: yup.string().required("Processor is required"),
    });
  }

  return (
    <Fragment>
      {loading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!loading && !err && formData !== null && (
        <PaperBlock
          heading={"Withdraw Funds"}
          fullWidth={true}
          headingCenter={true}
        >
          <Formik
            initialValues={{
              amt: formData.min_withdraw,
              processor: 2,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setWithdrawFormData(() => values);
              handleModalToggle(true);
            }}
          >
            <Form className={styles.fullWidthForm}>
              <MyTextField
                name="amt"
                type="number"
                className={muiStyles.block}
                label="Amount"
              />

              <MySelectField
                name="processor"
                label="Processor"
                className={muiStyles.block}
              >
                {processors.map((processor) => (
                  <MenuItem key={processor.value} value={processor.value}>
                    {processor.title}
                  </MenuItem>
                ))}
              </MySelectField>

              <Box
                component="div"
                className={[muiStyles.block, muiStyles.info].join(" ")}
              >
                <Icon>info</Icon>&nbsp;Make sure you have added your respective
                withdraw account details to prevent rejection.
              </Box>

              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                className={muiStyles.block}
              >
                Review
              </Button>
            </Form>
          </Formik>
        </PaperBlock>
      )}
      {err && <ShowError />}

      {modalOpen && (
        <BillingConfirmModal
          formData={withdrawFormData}
          processors={processors}
          submitForm={submitForm}
          loading={loading}
          handleModalToggle={handleModalToggle}
        />
      )}
    </Fragment>
  );
};

export default Withdraw;
