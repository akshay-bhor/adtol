import { Icon, Typography } from "@material-ui/core";
import { Button, Grid, makeStyles } from "@material-ui/core";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  abortBillingRequest,
  createOrder,
  verifyPayment,
} from "../../../../store/actions/billing.action";
import { billingActions } from "../../../../store/reducers/billing.reducer";
import { scriptActions } from "../../../../store/reducers/script.reducer";
import { uiActions } from "../../../../store/reducers/ui.reducer";
import { scripts, scriptSrc, loadScript } from "../../../../util/load-scripts";
import Loading from "../../../UI/Loading";
import ShowError from "../../../UI/ShowError";
import PaperBlock from "../../Common/PaperBlock";
import styles from "../../Dashboard.module.css";

const useStyles = makeStyles((theme) => ({
  depositContainer: {
    maxWidth: "500px",
    padding: "20px 10px",
    margin: "5px auto",
  },
  block: {
    width: "100%",
  },
  textCenter: {
    textAlign: "center",
  },
  success: {
    color: theme.palette.success.main,
  },
  link: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    alignItems: "center",
    color: theme.palette.primary.main,
  },
  iconBig: {
    fontSize: "125%",
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
}));

const Payment = () => {
  const payFormData = useSelector((state) => state.billing.payFormData);
  const err = useSelector((state) => state.billing.error);
  const scriptLoaded = useSelector((state) => state.script.rzr_pay);
  const paymentState = useSelector((state) => state.billing.paymentState);
  const loading = useSelector((state) => state.billing.loading);
  const userData = useSelector((state) => state.user);
  const [rzrPayObj, setRzrPayObj] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  useEffect(() => {
    const loadRzrPayScript = async () => {
      const id = scripts.RZRPAY;
      const src = scriptSrc.RZRPAY;

      try {
        await loadScript(id, src);
        dispatch(scriptActions.loadScripts({ scriptName: id, isLoaded: true }));
      } catch (err) {
        dispatch(
          uiActions.showAlert({
            title: "Network Error",
            message:
              "Network error occured, please check your connectivity and refresh the page!",
          })
        );
      }
    };

    if (!scriptLoaded) {
      loadRzrPayScript();
    } else {
      // Create order
      const data = {};
      data.amt = payFormData.amt;
      dispatch(createOrder(data));
    }
  }, [scriptLoaded]);

  useEffect(() => {
    initPayment();
  }, [paymentState]);

  useEffect(() => {
    if (!payFormData || payFormData.amt < 1) {
      history.push("/dashboard/billing/deposit");
    }

    return () => {
      abortBillingRequest();
      dispatch(billingActions.setPaymentSuccess(null));
      dispatch(billingActions.setPaymentLoading(false));
      dispatch(billingActions.clearError());
    };
  }, []);

  const initPayment = useCallback(() => {
    if (scriptLoaded && window.Razorpay && paymentState.orderData !== null) {
      const orderData = paymentState.orderData;
      let options = {
        key: orderData.api_key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: "Deposit amount in your account",
        image: "https://adtol.com/i/favicon-96x96.png",
        order_id: orderData.order_id,
        prefill: {
          email: userData.email,
        },
        handler: function (response) {
          // Verify payment
          verifyPay(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        theme: {
          color: "#3f51b5",
        },
      };

      setRzrPayObj((_) => new window.Razorpay(options));
    }
  }, [scriptLoaded, paymentState.orderData]);

  const verifyPay = (payment_id, order_id, sign) => {
    const data = {};
    data.razorpay_payment_id = payment_id;
    data.razorpay_order_id = order_id;
    data.razorpay_signature = sign;

    dispatch(verifyPayment(data));
  };

  return (
    <Fragment>
      {loading && !err && (
        <div className={styles.loader}>
          <Loading
            msg={
              paymentState.loading
                ? "Verifying Payment, Please not press back button..."
                : "Loading..."
            }
          />
        </div>
      )}
      {!loading && !err && !paymentState.loading && paymentState.success && (
        <PaperBlock fullWidth={true}>
          <Grid
            container
            className={[muiStyles.depositContainer, muiStyles.success].join(
              " "
            )}
          >
            <Typography
              variant="h5"
              className={[muiStyles.block, muiStyles.textCenter].join(" ")}
            >
              <Icon className={muiStyles.iconBig}>check_circle</Icon>
            </Typography>
            <Typography
              variant="h6"
              className={[muiStyles.block, muiStyles.textCenter].join(" ")}
            >
              Payment Successfull
            </Typography>
            <Typography
              variant="subtitle1"
              className={[muiStyles.block, muiStyles.textCenter].join(" ")}
            >
              <Link to="/dashboard/billing" className={muiStyles.link}>
                <Icon>keyboard_backspace</Icon>
                &nbsp;&nbsp;View Payment History
              </Link>
            </Typography>
          </Grid>
        </PaperBlock>
      )}
      {!loading &&
        !err &&
        paymentState.orderData &&
        paymentState.success === null && (
          <PaperBlock
            heading={"Deposit Advertiser Balance"}
            headingCenter={true}
            fullWidth={true}
          >
            <Grid container className={muiStyles.depositContainer}>
              <Grid item xs={6} className={muiStyles.gridLeft}>
                Amount
              </Grid>
              <Grid item xs={6} className={muiStyles.gridRight}>
                ${payFormData.amt}
              </Grid>
              <Grid item xs={6} className={muiStyles.gridLeft}>
                Total
              </Grid>
              <Grid item xs={6} className={muiStyles.gridRight}>
                ${payFormData.amt}
              </Grid>
              <Grid item xs={12} className={muiStyles.btnContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={muiStyles.block}
                  onClick={() => rzrPayObj.open()}
                >
                  {"Pay with Razorpay"}
                </Button>
              </Grid>
            </Grid>
          </PaperBlock>
        )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default Payment;
