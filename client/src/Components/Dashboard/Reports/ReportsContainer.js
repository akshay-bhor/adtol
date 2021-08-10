import {
  Box,
  Grid,
  MenuItem,
  makeStyles,
  Button,
  Select,
  Typography,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import { Fragment, useCallback, useState } from "react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  breakdownByListAd,
  breakdownByListPub,
  reportDurationSelection,
} from "../../../constants/common";
import {
  fetchAdvertiserReport,
  fetchPublisherReport,
} from "../../../store/actions/reports.action";
import { MySelectField } from "../../FormUtils/FormUtils";
import GeoChart from "../Common/GeoChart";
import PaperBlock from "../Common/PaperBlock";
import PieChart from "../Common/PieChart";
import ViewClicksChart from "../Common/ViewClicksChart";
import styles from "../Dashboard.module.css";
import ReportsTableContainer from "./ReportsTableContainer";

const useStyles = makeStyles({
  block: {
    width: "100%",
  },
  headingContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
});

const ReportsContainer = ({ title, selectionOption, path }) => {
  const muiStyles = useStyles();
  const loading = useSelector((state) => state.report.loading);
  const advertiserData = useSelector((state) => state.report.advertiserData);
  const publisherData = useSelector((state) => state.report.publisherData);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [breakdown, setBreakdown] = useState(1);
  const dispatch = useDispatch();

  const fetchReport = (values) => {
    if (path === "advertiser") dispatch(fetchAdvertiserReport(values));
    if (path === "publisher") dispatch(fetchPublisherReport(values));
    setSelectedDuration((_) => values.duration);
  };

  const getTitle = () => {
    const [{ name }] = reportDurationSelection.filter(
      (item) => item.id === selectedDuration
    );
    return name;
  };

  const getInitialValues = useCallback(() => {
    if (path === "advertiser") return { duration: 2, campaign: 0 };
    else return { duration: 2, website: 0 };
  }, [path]);

  const getGeoChartCols = useCallback(() => {
    if (path === "advertiser") return ["Country", "Clicks", "Spent"];
    else return ["Country", "Clicks", "Earned"];
  }, [path]);

  const getPieChartCols = useCallback(() => {
    return ["Device", "Clicks"];
  }, [path]);

  const getBreakdownList = useCallback(() => {
    if (path === "advertiser") return breakdownByListAd();
    if (path === "publisher") return breakdownByListPub();
  }, [path]);

  return (
    <Fragment>
      <PaperBlock heading={title} fullWidth={true}>
        <Formik
          initialValues={getInitialValues()}
          enableReinitialize={true}
          onSubmit={(values) => {
            fetchReport(values);
          }}
        >
          <Form className={styles.fullWidthForm}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Box component={"div"}>
                  <MySelectField
                    name="duration"
                    label="Duration"
                    className={muiStyles.block}
                    size="small"
                  >
                    {reportDurationSelection.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </MySelectField>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box component={"div"}>
                  <MySelectField
                    name={path === "advertiser" ? "campaign" : "website"}
                    label={path === "advertiser" ? "Campaigns" : "Websites"}
                    className={muiStyles.block}
                    size="small"
                  >
                    {selectionOption.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </MySelectField>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box component={"div"}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={muiStyles.block}
                    disabled={loading}
                  >
                    Filter
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </PaperBlock>

      <ViewClicksChart
        data={
          path === "advertiser"
            ? advertiserData.views_clicks
            : publisherData.views_clicks
        }
        title={getTitle()}
        fullWidth={true}
      />

      <GeoChart
        data={
          path === "advertiser"
            ? advertiserData.by_country
            : publisherData.by_country
        }
        cols={getGeoChartCols()}
      />

      <PieChart
        data={
          path === "advertiser"
            ? advertiserData.by_device
            : publisherData.by_device
        }
        cols={getPieChartCols()}
        heading="By Device"
        subheading="clicks"
      />

      <PaperBlock fullWidth={true}>
        <Grid item xs={12} className={muiStyles.headingContainer}>
          <Box component="span">
            <Typography variant="h5" component="h3" className="fleft">
              Breakdown By:
            </Typography>
          </Box>
          <Box component="span" className="fright">
            <Select
              value={breakdown}
              onChange={(e) => setBreakdown((_) => e.target.value)}
            >
              {getBreakdownList().map((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>

        {path === 'advertiser' && advertiserData.views_clicks !== undefined && (<ReportsTableContainer
            breakdown={breakdown}
            advertiserData={advertiserData}
            publisherData={null}
            path={path}
            class={muiStyles.block}
          />
        )}
        {path === 'publisher' && publisherData.views_clicks !== undefined && (<ReportsTableContainer
            breakdown={breakdown}
            advertiserData={null}
            publisherData={publisherData}
            path={path}
            class={muiStyles.block}
          />
        )}

      </PaperBlock>
    </Fragment>
  );
};

export default memo(ReportsContainer);
