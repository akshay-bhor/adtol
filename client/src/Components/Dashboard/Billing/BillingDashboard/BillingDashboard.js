import { Tabs, Tab, Paper, makeStyles, Box, Chip } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../Dashboard.module.css";
import { DataGrid } from "@material-ui/data-grid";
import {
  abortBillingRequest,
  fetchPayments,
  fetchWithdraw,
} from "../../../../store/actions/billing.action";
import { billingActions } from "../../../../store/reducers/billing.reducer";
import * as luxon from "luxon";
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
    flexGrow: "1",
    padding: "15px",
    borderRadius: "10px",
  },
  tableContainer: {
    marginTop: "10px",
    marginBottom: "10px",
  },
}));

const paymentCols = [
  { field: "payment_id", headerName: "Payment ID", flex: 0.8 },
  { field: "order_id", headerName: "Order ID", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 0.8 },
  { field: "currency", headerName: "Currency", flex: 0.5 },
  { field: "status", headerName: "Status", flex: 0.6 },
  { field: "processor", headerName: "Processor", flex: 0.6 },
  { field: "time", headerName: "Time", flex: 0.8 },
];

const withdrawCols = [
  { field: "payment_id", headerName: "Payment ID", flex: 0.8 },
  { field: "amount", headerName: "Amount", flex: 0.8 },
  { field: "fee", headerName: "Fee", flex: 0.8 },
  { field: "currency", headerName: "Currency", flex: 0.5 },
  { field: "status", headerName: "Status", flex: 0.6 },
  { field: "processor", headerName: "Processor", flex: 0.6 },
  { field: "time", headerName: "Time", flex: 0.8 },
];

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
                  ? muiStyles.info
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
                  ? muiStyles.info
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
      return "$" + params.value;
    }
    if (params.colDef.field == "processor") {
      return (
        <div className={styles.chipContainer}>
          <Chip size="small" label={params.value} className={muiStyles.info} />
        </div>
      );
    }
    if (params.colDef.field == "time") {
      return DateTime.fromSeconds(params.value).toLocaleString(DateTime.DATETIME_SHORT);
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
    <Paper className={muiStyles.container}>
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
      <Box component="div" className={muiStyles.tableContainer}>
        <Tabpanel value={tabValue} index={0}>
          <DataGrid
            autoHeight
            disableColumnMenu
            rows={payRows}
            rowHeight={80}
            columns={payCols}
          ></DataGrid>
        </Tabpanel>
        <Tabpanel value={tabValue} index={1}>
          <DataGrid
            autoHeight
            disableColumnMenu
            rows={wdRows}
            rowHeight={80}
            columns={wdCols}
          ></DataGrid>
        </Tabpanel>
      </Box>
    </Paper>
  );
};

export default BillingDashboard;
