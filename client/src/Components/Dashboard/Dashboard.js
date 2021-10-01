import { useCallback, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import { scripts, scriptSrc, loadScript } from "../../util/load-scripts";
import { scriptActions } from "../../store/reducers/script.reducer";
import { uiActions } from "../../store/reducers/ui.reducer";
import DashboardNav from "./DashboardNav/DashboardNav";
import styles from "./Dashboard.module.css";
import { Fragment } from "react";
import Loading from "../UI/Loading";

const Summary = lazy(() => import("./Summary/Summary"));
const Advertiser = lazy(() => import("./Advertiser/Advertiser"));
const CampaignList = lazy(() => import("./Campaigns/CampaignList"));
const Publisher = lazy(() => import("./Publisher/Publisher"));
const WebsiteList = lazy(() => import("./Websites/WebsiteList"));
const EditWebsite = lazy(() => import("./Websites/EditWebsite"));
const AddWebsite = lazy(() => import("./Websites/AddWebsite"));
const AdCode = lazy(() => import("./AdCode/AdCode"));
const Referrals = lazy(() => import("./Referrals/Referrals"));
const BillingDashboard = lazy(() => import("./Billing/BillingDashboard"));
const Withdraw = lazy(() => import("./Billing/Withdraw/Withdraw"));
const Deposit = lazy(() => import("./Billing/Deposit/Deposit"));
const Payment = lazy(() => import("./Billing/Deposit/Payment"));
const Reports = lazy(() => import("./Reports/Reports"));
const CampaignTypes = lazy(() => import("./CreateAd/CampaignTypes"));
const CreateCampaign = lazy(() => import("./CreateAd/CreateCampaign"));
const EditCampaign = lazy(() => import("./CreateAd/EditCampaign"));

const Dashboard = () => {
  const gChartLoaded = useSelector((state) => state.script.g_charts);
  const dispatch = useDispatch();

  const initCharts = useCallback(() => {
    if (window.google) {
      window.google.charts.load("current", { packages: ["corechart"] });
    }
  }, []);

  useEffect(() => {
    const loadChartsScript = async () => {
      const id = scripts.GCHARTS;
      const src = scriptSrc.GCHARTS;

      try {
        await loadScript(id, src);

        dispatch(scriptActions.loadScripts({ scriptName: id, isLoaded: true }));
        initCharts();
      } catch (err) {
        dispatch(
          uiActions.showAlert({
            title: "Error",
            message:
              "Network error occured, please check your connectivity and refresh the page!",
          })
        );
      }
    };

    if (!gChartLoaded) loadChartsScript();
  }, [gChartLoaded, dispatch, initCharts]);

  return (
    <Fragment>
      <div className={styles.mainContainer}>
        <DashboardNav />
        <div className={styles.container}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/dashboard" component={Summary} exact />
              <Route path="/dashboard/advertiser" component={Advertiser} />
              <Route path="/dashboard/campaigns" component={CampaignList} />
              <Route path="/dashboard/campaign-type" component={CampaignTypes} />
              <Route path="/dashboard/create-ad/:type" component={props => <CreateCampaign {...props} />} />
              <Route path="/dashboard/edit-ad/:type/:campid" component={EditCampaign} />
              <Route path="/dashboard/publisher" component={Publisher} />
              <Route path="/dashboard/websites" component={WebsiteList} exact />
              <Route path="/dashboard/websites/add" component={AddWebsite} />
              <Route
                path="/dashboard/websites/edit/:id"
                component={EditWebsite}
              />
              <Route path="/dashboard/get-adcode" component={AdCode} />
              <Route path="/dashboard/referrals" component={Referrals} />
              <Route
                path="/dashboard/billing"
                component={BillingDashboard}
                exact
              />
              <Route path="/dashboard/billing/withdraw" component={Withdraw} />
              <Route path="/dashboard/billing/deposit" component={Deposit} />
              <Route path="/dashboard/billing/payment" component={Payment} />
              <Route path="/dashboard/reports/:id" component={Reports} />
            </Switch>
          </Suspense>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
