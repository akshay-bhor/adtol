import { DataGrid } from "@material-ui/data-grid";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PaperBlock from "../Common/PaperBlock";
import styles from "../Dashboard.module.css";
import {
  abortWebsiteRequest,
  fetchWebsites,
} from "../../../store/actions/websites.action";
import { websiteActions } from "../../../store/reducers/websites.reducer";
import ShowError from "../../UI/ShowError";
import Loading from "../../UI/Loading";
import { Button, Chip, Icon, makeStyles, Box } from "@material-ui/core";
import { Typography } from "@material-ui/core";

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
}));

const websiteCols = [
  { field: "website", headerName: "Website", flex: 1 },
  { field: "category", headerName: "Category", flex: 0.8 },
  { field: "status", headerName: "Status", flex: 0.8 },
  { field: "views", headerName: "Views", flex: 0.6 },
  { field: "clicks", headerName: "Clicks", flex: 0.6 },
  { field: "pops", headerName: "Pops", flex: 0.6 },
  { field: "earned", headerName: "Earned", flex: 0.6 },
  { field: "ctr", headerName: "CTR", flex: 0.6 },
  { field: "manage", headerName: "Manage", flex: 0.6 },
];

const mapRows = (data) => {
  return Object.keys(data).map((key) => {
    let item = data[key];
    return {
      id: item.id,
      website: `${item.domain},${item.adult}`,
      category: `${item.category},${item.language}`,
      status: `${item.status}`,
      views: item.views,
      clicks: item.clicks,
      pops: item.pops,
      ctr: item.ctr ? item.ctr.toFixed(2) + "%" : "NA",
      earned: "$" + item.earned,
      manage: "Manage",
    };
  });
};

const WebsiteList = () => {
  const muiStyles = useStyles();
  const data = useSelector((state) => state.website.data);
  const loading = useSelector((state) => state.website.loading);
  const fetched = useSelector((state) => state.website.fetched);
  const err = useSelector((state) => state.website.error);
  const dispatch = useDispatch();
  let cols = [];
  let rows = [];

  useEffect(() => {
    if (data.length === 0 && !fetched) dispatch(fetchWebsites());

    return () => {
      abortWebsiteRequest();
      dispatch(websiteActions.clearError());
    };
  }, [dispatch]);

  const renderTableCell = (params) => {
    if (params.colDef.field == "website") {
      const data = params.value.split(",");
      return (
        <Fragment>
          <Typography variant="subtitle2" component="div">
            {data[0]}
          </Typography>
          <div className={styles.chipContainer}>
            <Chip
              size="small"
              label={data[1] == 1 ? "Adult" : "Non-Adult"}
              className={data[1] == 1 ? muiStyles.error : muiStyles.success}
            />
          </div>
        </Fragment>
      );
    }
    if (params.colDef.field == "category") {
      const data = params.value.split(",");
      return (
        <Fragment>
          <div className={styles.chipContainer}>
            <Chip size="small" label={data[0]} className={muiStyles.info} />
          </div>
          <div className={styles.chipContainer}>
            <Chip size="small" label={data[1]} className={muiStyles.info} />
          </div>
        </Fragment>
      );
    }
    if (params.colDef.field == "status") {
      const status = params.value;
      return (
        <div className={styles.chipContainer}>
          <Chip
            size="small"
            label={status}
            className={
              status == "Active"
                ? muiStyles.success
                : status == "Pending"
                ? muiStyles.info
                : muiStyles.error
            }
          />
        </div>
      );
    }
    if (params.colDef.field == "manage") {
      return (
        <Fragment>
          <Link to={`/dashboard/websites/edit/${params.row.id}`}>
            <Button
              color="primary"
              className={muiStyles.smallBtn}
              startIcon={<Icon>edit</Icon>}
            >
              Edit
            </Button>
          </Link>
          <Link to={`/dashboard/get-adcode`}>
            <Button
              color="primary"
              className={muiStyles.smallBtn}
              startIcon={<Icon>code</Icon>}
            >
              Get Adcode
            </Button>
          </Link>
        </Fragment>
      );
    }
  };

  if (!loading && !err) {
    cols = websiteCols.map((colData) => {
      return {
        ...colData,
        renderCell: renderTableCell,
        cellClassName: styles.cellClass,
      };
    });
    rows = mapRows(data);
  }

  return (
    <Fragment>
      {loading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!loading && !err && (
        <Fragment>
          <Box component="div" className={muiStyles.btnContainer}>
            <Link to="/dashboard/websites/add">
              <Button
                color="primary"
                className={"fright"}
                startIcon={<Icon>add</Icon>}
              >
                Add Website
              </Button>
            </Link>
          </Box>
          <PaperBlock heading={'Websites'} fullWidth={true}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                autoHeight
                disableColumnMenu
                rows={rows}
                rowHeight={80}
                columns={cols}
              ></DataGrid>
            </div>
          </PaperBlock>
        </Fragment>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default WebsiteList;
