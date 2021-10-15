import { DataGrid } from "@material-ui/data-grid";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import PaperBlock from "../Common/PaperBlock";
import styles from "../Dashboard.module.css";
import {
  abortWebsiteRequest,
  deleteWebsite,
  fetchWebsites,
} from "../../../store/actions/websites.action";
import { websiteActions } from "../../../store/reducers/websites.reducer";
import ShowError from "../../UI/ShowError";
import Loading from "../../UI/Loading";
import { Button, Chip, Icon, makeStyles, Box, IconButton, Menu } from "@material-ui/core";
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
  menuBtnContainer: {
    padding: '5px 10px'
  }
}));

const websiteCols = [
  { field: "website", headerName: "Website", flex: 1, headerAlign: 'center' },
  { field: "category", headerName: "Category", flex: 0.8, headerAlign: 'center' },
  { field: "status", headerName: "Status", flex: 0.8, headerAlign: 'center' },
  { field: "views", headerName: "Views", flex: 0.6, headerAlign: 'center' },
  { field: "clicks", headerName: "Clicks", flex: 0.6, headerAlign: 'center' },
  { field: "pops", headerName: "Pops", flex: 0.6, headerAlign: 'center' },
  { field: "earned", headerName: "Earned", flex: 0.6, headerAlign: 'center' },
  { field: "ctr", headerName: "CTR", flex: 0.6, headerAlign: 'center' },
  { field: "manage", headerName: "Manage", flex: 0.6, headerAlign: 'center' },
];

const mapRows = (data) => {
  return Object.keys(data).map((key) => {
    let item = data[key];
    return {
      id: item.id,
      website: `${item.domain},${item.adult}`,
      category: `${item.category},${item.language}`,
      status: `${item.status}`,
      views: (+item.views).toLocaleString(),
      clicks: (+item.clicks).toLocaleString(),
      pops: (+item.pops).toLocaleString(),
      ctr: item.ctr ? item.ctr.toFixed(2) + "%" : "NA",
      earned: "$" + (+item.earned).toLocaleString(),
      manage: "Manage",
    };
  });
};

const ManageMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { id, changeStatusHelper } = props;
  const muiStyles = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton 
        color="primary" 
        aria-controls={`manage-menu-${id}`} 
        aria-haspopup="true" 
        onClick={handleClick}
        compoenent="span">
        <Icon>menu</Icon>
      </IconButton>
      <Menu
        id={`manage-menu-${id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        >
        <Box component="div" className={muiStyles.menuBtnContainer}>
          <Link to={`/dashboard/websites/edit/${id}`}>
            <Button
              color="primary"
              className={muiStyles.smallBtn}
              startIcon={<Icon>edit</Icon>}
            >
              Edit
            </Button>
          </Link>
        </Box>
          <Box component="div" className={muiStyles.menuBtnContainer}>
            <Link to={`/dashboard/get-adcode`}>
              <Button
                color="primary"
                className={muiStyles.smallBtn}
                startIcon={<Icon>code</Icon>}
              >
                Get Adcode
              </Button>
            </Link>
          </Box>
        <Box component="div" className={muiStyles.menuBtnContainer}>
          <Button
              color="secondary"
              className={muiStyles.smallBtn}
              startIcon={<Icon>delete</Icon>}
              onClick={() => changeStatusHelper(id, true)}
            >
              Delete
          </Button>
        </Box>
      </Menu>
    </Fragment>
  );
    
}

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
    if (data.length === 0 || !fetched) dispatch(fetchWebsites());

    return () => {
      abortWebsiteRequest();
      dispatch(websiteActions.clearError());
    };
  }, [dispatch, fetched]);

  const changeStatusHelper = (id, confirm = false) => {
    if (confirm) {
      const res = window.confirm(
        "Website once deleted cannot be recovered/readded, still want to go ahead?"
      );

      if (!res) return;
    }

    const data = {};
    data.id = id;

    dispatch(deleteWebsite(data));
  };

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
      const id = params.row.id;
      return (
        <ManageMenu 
          id={id}
          changeStatusHelper={changeStatusHelper}
        />
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
      <Helmet>
        <title>Websites - AdTol</title>
      </Helmet>
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
          <PaperBlock heading={'Websites'} fullWidth={true}></PaperBlock>
          <Box className={styles.tableContainer}>
            <DataGrid
              autoHeight
              disableColumnMenu
              rows={rows}
              rowHeight={80}
              columns={cols}
              style={{ minWidth: '1200px' }}
            ></DataGrid>
          </Box>
        </Fragment>
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default WebsiteList;
