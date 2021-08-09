import { Box, Grid, MenuItem, makeStyles, Button } from "@material-ui/core";
import { Form, Formik } from "formik";
import { Fragment } from "react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reportDurationSelection } from "../../../constants/common";
import {
  fetchAdvertiserReport,
  fetchPublisherReport,
} from "../../../store/actions/reports.action";
import { MySelectField } from "../../FormUtils/FormUtils";
import PaperBlock from "../Common/PaperBlock";
import ViewClicksChart from "../Common/ViewClicksChart";
import styles from "../Dashboard.module.css";

const useStyles = makeStyles({
  block: {
    width: "100%",
  },
});

const ReportsContainer = ({ title, initialValues, selectionOption, path }) => {
  const muiStyles = useStyles();
  const loading = useSelector((state) => state.report.loading);
  const advertiserData = useSelector((state) => state.report.advertiserData);
  const publisherData = useSelector((state) => state.report.publisherData);
  const dispatch = useDispatch();

  const fetchReport = (values) => {
    if (path === "advertiser") dispatch(fetchAdvertiserReport(values));
    if (path === "publisher") dispatch(fetchPublisherReport(values));
  };

  const getTitle = () => {
      const [{ name }] = reportDurationSelection.filter((item) => item.id === initialValues.duration);
      return name;
  }

  return (
    <Fragment>
      <PaperBlock heading={title} fullWidth={true}>
        <Formik
          initialValues={initialValues}
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
    </Fragment>
  );
};

export default memo(ReportsContainer);
