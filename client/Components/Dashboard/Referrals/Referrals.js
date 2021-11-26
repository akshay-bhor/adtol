import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Loading from "../../UI/Loading";
import styles from "../Dashboard.module.css";
import ShowError from "../../UI/ShowError";
import PaperBlock from "../Common/PaperBlock";
import SummaryBlock from "../Common/SummaryBlock";
import {
  abortReferralRequest,
  fetchReferralData,
} from "../../../store/actions/referrals.action";
import RefEarningChart from "../Common/RefEarningChart";
import { makeStyles, Typography } from "@material-ui/core";
import { Icon } from "@material-ui/core";
import { uiActions } from "../../../store/reducers/ui.reducer";

const useStyles = makeStyles({
  ref_code: {
    backgroundColor: "#eee",
    padding: "5px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  copy: {
    color: "#888",
    marginLeft: "20px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontWeight: "600",
    cursor: "pointer",
  },
});

const initSummaryData = [
  {
    key: 1,
    title: "Referrals",
    value: "",
  },
  {
    key: 2,
    title: "Total Earnings",
    value: "",
    prefix: "$",
  },
  {
    key: 3,
    title: "Balance",
    value: "",
    prefix: "$",
  },
];

const Referrals = () => {
  const isLoading = useSelector((state) => state.referral.loading);
  const data = useSelector((state) => state.referral.data);
  const ref_link = `https://adtol.com/register?ref=${data.share_link_code}`;
  const err = useSelector((state) => state.referral.error);
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  const [estimates, setEstimates] = useState(initSummaryData);

  useEffect(() => {
    dispatch(fetchReferralData());

    return () => {
      abortReferralRequest();
    };
  }, [dispatch]);

  useEffect(() => {
    // Map Data
    if (Object.keys(data).length !== 0) {
      setEstimates((estimates) => {
        return [
          {
            ...estimates[0],
            value: data.referred,
          },
          {
            ...estimates[1],
            value: data.total_earnings,
          },
          {
            ...estimates[2],
            value: data.balance,
          },
        ];
      });
    }
  }, [data]);

  const copyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      dispatch(
        uiActions.showSnack({
          severity: "success",
          message: "Copied to clipboard",
        })
      );
    } else {
      dispatch(
        uiActions.showSnack({
          severity: "error",
          message:
            "Browser doesn't support auto copying, please manually copy the code",
        })
      );
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Referral - AdTol</title>
      </Head>
      {isLoading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!isLoading && !err && (
        <Fragment>
          <SummaryBlock data={estimates} heading={"Estimates"}></SummaryBlock>
          <RefEarningChart data={data.ref_stats} />
          <PaperBlock heading="Referral Code" fullWidth={false}>
            <Typography variant="h4" className={muiStyles.ref_code}>
              {data.share_link_code}
            </Typography>
            <Typography
              variant="subtitle2"
              className={muiStyles.copy}
              onClick={() => copyCode(data.share_link_code)}
            >
              <Icon>content_copy</Icon>&nbsp;Copy
            </Typography>
          </PaperBlock>
          <PaperBlock heading="Referral Link" fullWidth={false}>
            <Typography variant="h5" className={muiStyles.ref_code}>
              {ref_link}
            </Typography>
            <Typography
              variant="subtitle2"
              className={muiStyles.copy}
              onClick={() => copyCode(ref_link)}
            >
              <Icon>content_copy</Icon>&nbsp;Copy
            </Typography>
          </PaperBlock>
        </Fragment>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default Referrals;
