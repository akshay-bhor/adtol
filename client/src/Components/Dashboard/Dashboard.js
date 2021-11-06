import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { scripts, scriptSrc, loadScript } from "../../util/load-scripts";
import { scriptActions } from "../../store/reducers/script.reducer";
import { uiActions } from "../../store/reducers/ui.reducer";
import DashboardNav from "./DashboardNav/DashboardNav";
import styles from "./Dashboard.module.css";
import { Fragment } from "react";

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
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
