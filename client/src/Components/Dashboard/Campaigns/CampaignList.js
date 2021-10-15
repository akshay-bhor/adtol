import { DataGrid } from "@material-ui/data-grid";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import PaperBlock from "../Common/PaperBlock";
import styles from "../Dashboard.module.css";
import {
  abortCampaignRequest,
  fetchCampaignsList,
  updateCampaignStatus,
} from "../../../store/actions/campaigns.action";
import ShowError from "../../UI/ShowError";
import Loading from "../../UI/Loading";
import { Box, Button, Chip, Icon, IconButton, makeStyles, Menu } from "@material-ui/core";
import EditBudgetModal from "./EditBudgetModal";
import { Link } from "react-router-dom";

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
    padding: '5px 10px'
  }
}));

const campaignCols = [
  { field: "campaign", headerName: "Campaign", flex: 1, headerAlign: 'center' },
  { field: "type", headerName: "Type", flex: 0.8, headerAlign: 'center' },
  { field: "status", headerName: "Status", flex: 0.8, headerAlign: 'center' },
  { field: "views", headerName: "Views", flex: 0.6, headerAlign: 'center' },
  { field: "clicks", headerName: "Clicks", flex: 0.6, headerAlign: 'center' },
  { field: "pops", headerName: "Pops", flex: 0.6, headerAlign: 'center' },
  { field: "cpc", headerName: "CPC", flex: 0.6, headerAlign: 'center' },
  { field: "budget", headerName: "Budget", flex: 0.8, headerAlign: 'center' },
  { field: "manage", headerName: "Manage", flex: 0.6, headerAlign: 'center' },
];

const mapRows = (data) => {
  return data.map((item) => {
    return {
      id: item.id,
      campaign: item.name,
      type: `${item.campaign_type},${item.adult ? 1 : 2}`,
      status: `${item.status},${item.cstatus}`,
      views: (+item.views).toLocaleString(),
      clicks: (+item.clicks).toLocaleString(),
      pops: (+item.pops).toLocaleString(),
      cpc: "$" + parseFloat(item.cpc),
      budget: "$" + item.budget + ", rem:" + "$" + item.budget_rem,
      manage: "Manage",
    };
  });
};

const ManageMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { pathParam, id, budget, changeStatusHelper, modalHandler } = props;
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
        <Box component="div" className={muiStyles.btnContainer}>
          <Link 
            to={`/dashboard/edit-ad/${pathParam}/${id}`}>
            <Button
              color="primary"
              className={muiStyles.smallBtn}
              startIcon={<Icon>edit</Icon>}
            >
              Edit
            </Button>
          </Link>
        </Box>
        <Box component="div" className={muiStyles.btnContainer}>
          <Button
            color="primary"
            className={muiStyles.smallBtn}
            startIcon={<Icon>attach_money</Icon>}
            onClick={() => modalHandler(id, budget)}
          >
            Edit Budget
          </Button>
        </Box>
        <Box component="div" className={muiStyles.btnContainer}>
          <Button
            color="primary"
            className={muiStyles.smallBtn}
            startIcon={<Icon>play_arrow</Icon>}
            onClick={() => changeStatusHelper(id, "run")}
          >
            Run
          </Button>
        </Box>
        <Box component="div" className={muiStyles.btnContainer}>
          <Button
            color="primary"
            className={muiStyles.smallBtn}
            startIcon={<Icon>pause</Icon>}
            onClick={() => changeStatusHelper(id, "pause")}
          >
            Pause
          </Button>
        </Box>
        <Box component="div" className={muiStyles.btnContainer}>
          <Button
            color="secondary"
            className={muiStyles.smallBtn}
            startIcon={<Icon>delete</Icon>}
            onClick={() => changeStatusHelper(id, "delete", true)}
          >
            Delete
          </Button>
        </Box>
      </Menu>
    </Fragment>
  );
    
}

const CampaignList = () => {
  const muiStyles = useStyles();
  const data = useSelector((state) => state.campaign.data);
  const loading = useSelector((state) => state.campaign.loading);
  const fetched = useSelector((state) => state.campaign.fetched);
  const err = useSelector((state) => state.campaign.error);
  const dispatch = useDispatch();
  const [modal, setModal] = useState({ open: false, data: {} });
  let cols = [];
  let rows = [];

  useEffect(() => {
    if (data.data.length === 0 || !fetched) dispatch(fetchCampaignsList());

    return () => {
      abortCampaignRequest();
    };
  }, [dispatch]);

  const changeStatusHelper = (id, action, confirm = false) => {
    if (confirm) {
      const res = window.confirm(
        "Campaign once deleted cannot be recovered, still want to go ahead?"
      );

      if (!res) return;
    }

    const data = {};
    data.id = id;
    data.data = { status: action };

    dispatch(updateCampaignStatus(data));
  };

  const modalHandler = (id, budget) => { 
    const max = data.max_budget;
    setModal((prev) => { 
      return {
        open: true,
        data: {
          id,
          budget,
          max,
        },
      };
    });
  };

  const modalCloseHandler = () => { 
    setModal((prev) => ({ ...prev, open: false }));
  };

  const renderTableCell = (params) => {
    if (params.colDef.field == "type") {
      const types = params.value.split(",");
      return (
        <Fragment>
          <div className={styles.chipContainer}>
            <Chip size="small" label={types[0]} className={muiStyles.info} />
          </div>
          <div className={styles.chipContainer}>
            <Chip
              size="small"
              label={types[1] == 1 ? "Adult" : "Non-Adult"}
              className={types[1] == 1 ? muiStyles.error : muiStyles.success}
            />
          </div>
        </Fragment>
      );
    }
    if (params.colDef.field == "status") {
      const status = params.value.split(",");
      return (
        <Fragment>
          <div className={styles.chipContainer}>
            <Chip
              size="small"
              label={
                status[0] == 1
                  ? "Approved"
                  : status[0] == 2
                  ? "Pending"
                  : "Rejected"
              }
              className={
                status[0] == 1
                  ? muiStyles.success
                  : status[0] == 2
                  ? muiStyles.info
                  : muiStyles.error
              }
            />
          </div>
          <div className={styles.chipContainer}>
            <Chip
              size="small"
              label={
                status[1] == 1
                  ? "Running"
                  : status[1] == 2
                  ? "Paused"
                  : "Machine Paused"
              }
              className={
                status[1] == 1
                  ? muiStyles.success
                  : status[1] == 2
                  ? muiStyles.warning
                  : muiStyles.info
              }
            />
          </div>
        </Fragment>
      );
    }
    if (params.colDef.field == "budget") {
      const budget = params.value.split(",");
      return (
        <Fragment>
          <div className="bold">{budget[0]}</div>
          <div
            className={[
              styles.budgetContainer,
              "bold",
              "subtitle",
            ].join(" ")}
          >
            {budget[1]}
          </div>
        </Fragment>
      );
    }
    if (params.colDef.field == "manage") {
      const pathParam = params.row.type.split(',')[0].toLowerCase() === 'pop' ? 'pop':'campaign';
      const id = params.id;
      const budget = params.row.budget.split(",")[1];
      return (
        <ManageMenu 
          id={id}
          pathParam={pathParam}
          budget={budget}
          changeStatusHelper={changeStatusHelper}
          modalHandler={modalHandler}
        />
      );
    }
  };

  if (!loading && !err) {
    cols = campaignCols.map((colData) => {
      return {
        ...colData,
        renderCell: renderTableCell,
        cellClassName: styles.cellClass,
      };
    });
    rows = mapRows(data.data);
  }

  return (
    <Fragment>
      <Helmet>
        <title>Campaigns - AdTol</title>
      </Helmet>
      {loading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!loading && !err && (
        <Fragment>
          <PaperBlock heading="Campaigns" fullWidth="true"></PaperBlock>
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
      {modal.open && (
        <EditBudgetModal
          data={modal.data}
          loading={loading}
          onClose={modalCloseHandler}
        />
      )}
      {err && <ShowError />}
    </Fragment>
  );
};

export default CampaignList;
