import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  abortCampaignRequest,
  fetchCampaignsList,
} from "../../../store/actions/campaigns.action";
import { abortReportRequest, fetchAdvertiserReport, fetchPublisherReport } from "../../../store/actions/reports.action";
import {
  abortWebsiteRequest,
  fetchWebsites,
} from "../../../store/actions/websites.action";
import { campaignActions } from "../../../store/reducers/campaigns.reducer";
import { reportActions } from "../../../store/reducers/reports.reducer";
import { websiteActions } from "../../../store/reducers/websites.reducer";
import Loading from "../../UI/Loading";
import ShowError from "../../UI/ShowError";
import styles from "../Dashboard.module.css";
import ReportsContainer from "./ReportsContainer";

let title = "Advertiser Reports";
let selectionOption;

const Reports = () => {
  const router = useRouter();
  const params = router.query;
  const campData = useSelector((state) => state.campaign.data);
  const campLoading = useSelector((state) => state.campaign.loading);
  const campFetched = useSelector((state) => state.campaign.fetched);
  const campErr = useSelector((state) => state.campaign.error);
  const webData = useSelector((state) => state.website.data);
  const webLoading = useSelector((state) => state.website.loading);
  const webFetched = useSelector((state) => state.website.fetched);
  const webErr = useSelector((state) => state.website.error);
  const dispatch = useDispatch();

  /**
   * Load campaigns or website data on mount
   */
  useEffect(() => {
    if (campData.data.length === 0 && !campFetched && params.id === "advertiser")
      dispatch(fetchCampaignsList());
    if (webData.length === 0 && !webFetched && params.id === "publisher")
      dispatch(fetchWebsites());

    /**
     * Fetch report
     */
    let data = {};
    if(params.id === 'advertiser') {
        data = {
            duration: 2,
            campaign: 0,
        }
        dispatch(fetchAdvertiserReport(data));
    }
    if(params.id === 'publisher') {
        data = {
            duration: 2,
            website: 0,
        }
        dispatch(fetchPublisherReport(data));
    }

    /**
     * Cleanup
     */
    return () => {
      abortCampaignRequest();
      abortWebsiteRequest();
      dispatch(websiteActions.clearError());
      dispatch(campaignActions.clearError());
      dispatch(reportActions.clearError());
      abortReportRequest();
    };
  }, [dispatch, params.id]);

  /** Set initial selection data */
  if (params.id === "advertiser") {
    let campaignSelection = [{ id: 0, name: "All" }];
    campData.data.forEach((data) => {
      const { id, name } = data;
      campaignSelection.push({ id, name });
    });
    selectionOption = campaignSelection
  }
  if (params.id === "publisher") {
    let websiteSelecton = [{ id: 0, name: "All" }];
    webData.forEach((data) => {
      const { id, domain } = data;
      websiteSelecton.push({ id, name: domain });
    });
    selectionOption = websiteSelecton
  }

  /**
   * Initial form values
   */
  if (params.id === "publisher") title = "Publisher Reports";
  if (params.id === "advertiser") title = "Advertiser Reports";

  return (
    <Fragment>
      <Head>
        <title>{title} - AdTol</title>
      </Head>
      {(campLoading || webLoading) && !campErr && !webErr && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!campLoading && !webLoading && !campErr && !webErr && (
        <ReportsContainer
          title={title}
          selectionOption={selectionOption}
          path={params.id}
        />
      )}
      {(webErr || campErr) && <ShowError />}
    </Fragment>
  );
};

export default Reports;
