import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import Summary from "./Summary/Summary";
import { scripts, scriptSrc, loadScript } from "../../util/load-scripts";
import { scriptActions } from "../../store/reducers/script.reducer";
import { uiActions } from "../../store/reducers/ui.reducer";
import Sidenav from "./Sidenav/Sidenav";
import styles from "./Dashboard.module.css";
import { Fragment } from "react";
import Advertiser from "./Advertiser/Advertiser";
import CampaignList from "./Campaigns/CampaignList";
import Publisher from "./Publisher/Publisher";
import WebsiteList from "./Websites/WebsiteList";
import EditWebsite from "./Websites/EditWebsite";
import AddWebsite from "./Websites/AddWebsite";
import AdCode from "./AdCode/AdCode";

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
        <Sidenav />
        <div className={styles.container}>
          <Switch>
            <Route path="/dashboard" component={Summary} exact />
            <Route path="/dashboard/advertiser" component={Advertiser} />
            <Route path="/dashboard/campaigns" component={CampaignList} />
            <Route path="/dashboard/publisher" component={Publisher} />
            <Route path="/dashboard/websites" component={WebsiteList} exact />
            <Route path="/dashboard/websites/add" component={AddWebsite} />
            <Route path="/dashboard/websites/edit/:id" component={EditWebsite} />
            <Route path="/dashboard/get-adcode" component={AdCode} />
          </Switch>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
