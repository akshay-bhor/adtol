import { DataGrid } from "@material-ui/data-grid";
import { Box } from "@material-ui/core";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Loading from "../../UI/Loading";
import AdvertiserSummaryBlock from "./AdvertiserSummaryBlock";
import styles from "../Dashboard.module.css";
import {
  abortAdvertiserRequest,
  fetchAdvertiserData,
} from "../../../store/actions/advertiser.action";
import ShowError from "../../UI/ShowError";
import ViewClicksChart from "../Common/ViewClicksChart";
import GeoChart from "../Common/GeoChart";
import PaperBlock from "../Common/PaperBlock";
import { campaignCols } from "../../../constants/common";

const mapRows = (data) => {
    return Object.keys(data).map(key => (
        {
            id: key,
            campaign: data[key].title,
            views: (+data[key].views).toLocaleString(),
            clicks: (+data[key].clicks).toLocaleString(),
            pops: (+data[key].pops).toLocaleString(),
            spent: '$'+ parseFloat(data[key].spent).toFixed(2).toLocaleString(),
            ctr: data[key].ctr ? data[key].ctr+'%': 'NA'
        }
    ));
}

const Advertiser = () => {
  const isLoading = useSelector((state) => state.advertiser.loading);
  const data = useSelector((state) => state.advertiser.data);
  const err = useSelector((state) => state.advertiser.error);
  const dispatch = useDispatch();
  const geoChartCols = ['Country', 'Clicks', 'Spent'];
  let cols = [];
  let rows = [];

  useEffect(() => {
    dispatch(fetchAdvertiserData());

    return () => {
      abortAdvertiserRequest();
    };
  }, [dispatch]);

  if(!isLoading && !err) {
      cols = campaignCols().map(col => ({
        ...col,
        cellClassName: styles.cellCenter,
      }));
      rows = mapRows(data.by_campaign)
  }

  return (
    <Fragment>
      <Head>
        <title>Advertiser</title>
      </Head>
      {isLoading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!isLoading && !err && (
        <Fragment>
          <AdvertiserSummaryBlock data={data.total} />
          <ViewClicksChart data={data.views_clicks} />
          <GeoChart data={data.by_country} cols={geoChartCols} />
          <PaperBlock heading="By Campaigns" fullWidth={true}></PaperBlock>
          <Box className={styles.tableContainer}>
            <DataGrid
              autoHeight
              columns={cols}
              rows={rows}
              style={{ minWidth: '1200px', background: '#fff' }}
            ></DataGrid>
          </Box>
        </Fragment>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default Advertiser;
