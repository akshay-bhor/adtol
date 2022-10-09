import { Formik, Form } from "formik";
import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import {
  abortBillingRequest,
  convertPubBalance,
  fetchFormData,
} from "../../../../store/actions/billing.action";
import { billingActions } from "../../../../store/reducers/billing.reducer";
import Loading from "../../../UI/Loading";
import ShowError from "../../../UI/ShowError";
import PaperBlock from "../../Common/PaperBlock";
import styles from "../../Dashboard.module.css";
import * as yup from "yup";
import { MySelectField, MyTextField } from "../../../FormUtils/FormUtils";
import { Button, makeStyles, MenuItem, Box } from "@material-ui/core";
import { useRouter } from "next/router";
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
  marginTop0: {
    marginTop: "0px!important",
  },
  btnContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-start",
  },
  gridLeft: {
    color: "#666",
    textAlign: "left",
    fontSize: "120%",
    paddingBottom: "10px",
  },
  gridRight: {
    fontWeight: "600",
    fontSize: "125%",
    textAlign: "right",
    paddingBottom: "10px",
  },
});

const processors = [
  {
    title: "Payment Gateway",
    value: 1,
  },
  {
    title: "Convert Publisher Balance",
    value: 2,
  },
];

const Deposit = () => {
  const loading = useSelector((state) => state.billing.loading);
  const err = useSelector((state) => state.billing.error);
  const formData = useSelector((state) => state.billing.formData);
  const modalOpen = useSelector((state) => state.billing.modalOpen);
  const payFormData = useSelector((state) => state.billing.payFormData);
  const dispatch = useDispatch();
  const router = useRouter();
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

  const handleSubmit = (values) => {
    dispatch(billingActions.setPayFormData(values));
    if (values.processor === 2) handleModalToggle(true);
    if (values.processor === 1) router.push("/dashboard/billing/payment");
  };

  const submitForm = () => {
    const postValues = { ...payFormData };

    if (formData.country == "India") {
      postValues.amt = +(
        parseFloat(postValues.amt) /
        parseFloat(formData.inr_to_usd_exchange_rate)
      ).toFixed(2);
    }
    dispatch(convertPubBalance(postValues));
  };

  const getMinDeposit = () => {
    if (formData.country !== "India") return formData.min_deposit;
    return +(
      parseFloat(formData.min_deposit) *
      parseFloat(formData.inr_to_usd_exchange_rate)
    ).toFixed(2);
  };

  const getMaxDeposit = () => {
    if (formData.country !== "India") return formData.max_deposit;
    return +(
      parseFloat(formData.max_deposit) *
      parseFloat(formData.inr_to_usd_exchange_rate)
    ).toFixed(2);
  };

  const getAmountLabel = () => {
    if (formData.country !== "India") return "Amount (USD)";
    return "Amount (INR)";
  };

  // Create validation schema
  if (!loading && !err && formData !== null) {
    validationSchema = yup.object({
      amt: yup
        .number()
        .required("Amount is required")
        .min(getMinDeposit(), `Min deposit amount is ${getMinDeposit()}`)
        .max(getMaxDeposit(), `Max deposit amount is ${getMaxDeposit()}`),
      processor: yup.string().required("Processor is required"),
    });
  }

  return (
    <Fragment>
      <Head>
        <title>Deposit - AdTol</title>
      </Head>
      {loading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!loading && !err && formData !== null && (
        <PaperBlock heading={"Add Funds"} fullWidth={true} headingCenter={true}>
          <Formik
            initialValues={{
              amt: getMinDeposit(),
              processor: 1,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            <Form className={styles.fullWidthForm}>
              <MyTextField
                name="amt"
                type="number"
                className={muiStyles.block}
                label={getAmountLabel()}
              />
              {formData.country == "India" && (
                <Box
                  component="div"
                  className={[
                    muiStyles.block,
                    muiStyles.info,
                    muiStyles.marginTop0,
                  ].join(" ")}
                >
                  Exchange rate is ₹{formData.inr_to_usd_exchange_rate}.
                </Box>
              )}

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
          formData={payFormData}
          processors={processors}
          submitForm={submitForm}
          convert={true}
          handleModalToggle={handleModalToggle}
          loading={loading}
        />
      )}
    </Fragment>
  );
};

export default Deposit;
