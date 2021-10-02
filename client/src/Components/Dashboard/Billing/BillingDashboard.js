import {
  Tabs,
  Tab,
  Paper,
  makeStyles,
  Box,
  Chip,
  Grid,
  Typography
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../Dashboard.module.css";
import { DataGrid } from "@material-ui/data-grid";
import { Helmet } from "react-helmet";
import {
  abortBillingRequest,
  fetchPayments,
  fetchWithdraw,
} from "../../../store/actions/billing.action";
import { billingActions } from "../../../store/reducers/billing.reducer";
import * as luxon from "luxon";
import { Icon } from "@material-ui/core";
import { Link } from "react-router-dom";
import { paymentCols, withdrawCols } from "../../../constants/common";
const DateTime = luxon.DateTime;

const useStyles = makeStyles((theme) => ({
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: "#fff",
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  info: {
    backgroundColor: theme.palette.info.main,
    color: "#fff",
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
  },
  smallBtn: {
    fontSize: "12px",
  },
  smallIcon: {
    fontSize: "16px",
  },
  btnContainer: {
    display: "flex",
    justifyContent: "flex-end",
    flexBasis: "100%",
  },
  container: {
    display: "block",
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
  },
  tabContainer: {
    padding: '0',
    paddingLeft: '10px'
  },
  topContainer: {
    marginBottom: "20px",
  },
  billingBox: {
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: theme.palette.primary.main,
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  billingIcon: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  tableContainer: {
    marginTop: "10px",
    marginBottom: "10px",
    display: "block",
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
    overflow: 'auto'
  },
}));

const mapRows = (data) => {
  return Object.keys(data).map((key) => {
    let item = data[key];
    return {
      ...item,
      id: item.payment_id,
    };
  });
};

const tabProps = (index) => {
  return {
    id: `billing-tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const Tabpanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`billing-tab-${index}`}
      {...other}
    >
      {value === index && props.children}
    </div>
  );
};

const BillingDashboard = () => {
  const muiStyles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const loading = useSelector((state) => state.billing.loading);
  const payData = useSelector((state) => state.billing.paymentsData);
  const wdData = useSelector((state) => state.billing.withdrawData);
  const payFetched = useSelector((state) => state.billing.fetchedPayments);
  const wdFetched = useSelector((state) => state.billing.fetchedWithdraw);
  const err = useSelector((state) => state.billing.error);
  const dispatch = useDispatch();
  let payCols = [];
  let payRows = [];
  let wdCols = [];
  let wdRows = [];

  useEffect(() => {
    if (!payFetched) dispatch(fetchPayments());
    if (!wdFetched) dispatch(fetchWithdraw());

    return () => {
      abortBillingRequest();
      dispatch(billingActions.clearError());
    };
  }, [dispatch]);

  const renderTableCell = (params) => {
    if (params.colDef.field == "status") {
      const status = params.value;
      if (params.view === "withdraw") {
        return (
          <div className={styles.chipContainer}>
            <Chip
              size="small"
              label={status}
              className={
                status == "Approved"
                  ? muiStyles.success
                  : status == "Pending"
                  ? muiStyles.warning
                  : muiStyles.error
              }
            />
          </div>
        );
      }
      if (params.view === "payment") {
        return (
          <div className={styles.chipContainer}>
            <Chip
              size="small"
              label={status}
              className={
                status == "captured"
                  ? muiStyles.success
                  : status == "created"
                  ? muiStyles.warning
                  : muiStyles.error
              }
            />
          </div>
        );
      }
    }
    if (params.colDef.field == "amount") {
      return "$" + params.value;
    }
    if (params.colDef.field == "fee") {
      return params.value + "%";
    }
    if (params.colDef.field == "processor") {
      return (
        <div className={styles.chipContainer}>
          <Chip size="small" label={params.value} className={muiStyles.info} />
        </div>
      );
    }
    if (params.colDef.field == "time") {
      return DateTime.fromSeconds(params.value, { zone: 'utc' }).toLocal().toLocaleString(
        {...DateTime.DATETIME_SHORT, hour12: true}
      );
    }
  };

  if (!loading && !err) {
    payCols = paymentCols.map((colData) => {
      return {
        ...colData,
        renderCell: (params) => renderTableCell({ ...params, view: "payment" }),
        cellClassName: styles.cellClass,
      };
    });
    wdCols = withdrawCols.map((colData) => {
      return {
        ...colData,
        renderCell: (params) =>
          renderTableCell({ ...params, view: "withdraw" }),
        cellClassName: styles.cellClass,
      };
    });
    payRows = mapRows(payData);
    wdRows = mapRows(wdData);
  }

  return (
    <Fragment>
      <Helmet>
        <title>Billing -AdTol</title>
      </Helmet>
      <Paper
        className={[muiStyles.container, muiStyles.topContainer].join(" ")}
      >
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Link to={'/dashboard/billing/deposit'} className={muiStyles.billingBox}>
              <Icon className={muiStyles.billingIcon}>payments</Icon>
              <Typography variant="h6">Add money into your account</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link to={'/dashboard/billing/withdraw'} className={muiStyles.billingBox}>
              <Icon className={muiStyles.billingIcon}>
                account_balance_wallet
              </Icon>
              <Typography variant="h6">
                Cash out money from your account
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={[muiStyles.container, muiStyles.tabContainer].join(' ')}>
        <Tabs
          value={tabValue}
          onChange={(_, nval) => {
            setTabValue((_) => nval);
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Payment History" {...tabProps(0)} />
          <Tab label="Withdraw History" {...tabProps(1)} />
        </Tabs>
      </Paper>

      <Box component="div" className={muiStyles.tableContainer}>
        <Tabpanel value={tabValue} index={0}>
          <DataGrid
            autoHeight
            disableColumnMenu
            rows={payRows}
            rowHeight={80}
            columns={payCols}
            pageSize={25}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            style={{ minWidth: '1200px' }}
          ></DataGrid>
        </Tabpanel>
        <Tabpanel value={tabValue} index={1}>
          <DataGrid
            autoHeight
            disableColumnMenu
            rows={wdRows}
            rowHeight={80}
            columns={wdCols}
            pageSize={25}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            style={{ minWidth: '1200px' }}
          ></DataGrid>
        </Tabpanel>
      </Box>
    </Fragment>
  );
};

export default BillingDashboard;
