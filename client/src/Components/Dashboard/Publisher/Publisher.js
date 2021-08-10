import { DataGrid } from "@material-ui/data-grid";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
            views: data[key].views,
            clicks: data[key].clicks,
            pops: data[key].pops,
            earned: '$'+ parseFloat(data[key].earned).toFixed(2),
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
      cols = websitesCols();
      rows = mapRows(data.by_websites)
  }

  return (
    <Fragment>
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
          <PaperBlock heading="By Websites" fullWidth={true}>
            <DataGrid
              autoHeight
              columns={cols}
              rows={rows}
            ></DataGrid>
          </PaperBlock>
        </Fragment>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default Publisher;
