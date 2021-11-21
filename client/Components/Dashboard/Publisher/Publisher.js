import { DataGrid } from "@material-ui/data-grid";
import { Box } from "@material-ui/core";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Loading from "../../UI/Loading";
import PublisherSummaryBlock from "./PublisherSummaryBlock";
import styles from "../Dashboard.module.css";
import {
  abortPublisherRequest,
  fetchPublisherData,
} from "../../../store/actions/publisher.action";
import ShowError from "../../UI/ShowError";
import ViewClicksChart from "../Common/ViewClicksChart";
import GeoChart from "../Common/GeoChart";
import PaperBlock from "../Common/PaperBlock";
import { websitesCols } from "../../../constants/common";

const mapRows = (data) => {
    return Object.keys(data).map(key => (
        {
            id: key,
            website: data[key].url,
            views: (+data[key].views).toLocaleString(),
            clicks: (+data[key].clicks).toLocaleString(),
            pops: (+data[key].pops).toLocaleString(),
            earned: '$'+ parseFloat(data[key].earned).toFixed(2).toLocaleString(),
            ctr: data[key].ctr ? data[key].ctr+'%': 'NA'
        }
    ));
}

const Publisher = () => {
  const isLoading = useSelector((state) => state.publisher.loading);
  const data = useSelector((state) => state.publisher.data);
  const err = useSelector((state) => state.publisher.error);
  const dispatch = useDispatch();
  const geoChartCols = ['Country', 'Clicks', 'Earned'];
  let cols = [];
  let rows = [];

  useEffect(() => {
    dispatch(fetchPublisherData());

    return () => {
      abortPublisherRequest();
    };
  }, [dispatch]);

  if(!isLoading && !err) {
      cols = websitesCols().map(col => ({
        ...col,
        cellClassName: styles.cellCenter,
      }));
      rows = mapRows(data.by_websites)
  }

  return (
    <Fragment>
      <Head>
        <title>Publisher - AdTol</title>
      </Head>
      {isLoading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!isLoading && !err && (
        <Fragment>
          <PublisherSummaryBlock data={data.total} />
          <ViewClicksChart data={data.views_clicks} />
          <GeoChart data={data.by_country} cols={geoChartCols} />
          <PaperBlock heading="By Websites" fullWidth={true}></PaperBlock>
          <Box className={styles.tableContainer}>
            <DataGrid
              autoHeight
              columns={cols}
              rows={rows}
              style={{ minWidth: '1200px' }}
            ></DataGrid>
          </Box>
        </Fragment>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default Publisher;
