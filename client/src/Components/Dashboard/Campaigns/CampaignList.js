import { DataGrid } from "@material-ui/data-grid";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaperBlock from "../Common/PaperBlock";
import styles from "../Dashboard.module.css";
import {
  abortCampaignRequest,
  fetchCampaignsList,
  updateCampaignStatus,
} from "../../../store/actions/campaigns.action";
import ShowError from "../../UI/ShowError";
import Loading from "../../UI/Loading";
import { Button, Chip, Icon, makeStyles } from "@material-ui/core";
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
}));

const campaignCols = [
  { field: "campaign", headerName: "Campaign", flex: 1 },
  { field: "type", headerName: "Type", flex: 0.8 },
  { field: "status", headerName: "Status", flex: 0.8 },
  { field: "views", headerName: "Views", flex: 0.6 },
  { field: "clicks", headerName: "Clicks", flex: 0.6 },
  { field: "pops", headerName: "Pops", flex: 0.6 },
  { field: "cpc", headerName: "CPC", flex: 0.6 },
  { field: "budget", headerName: "Budget", flex: 0.8 },
  { field: "manage", headerName: "Manage", flex: 0.6 },
];

const mapRows = (data) => {
  return data.map((item) => {
    return {
      id: item.id,
      campaign: item.name,
      type: `${item.campaign_type},${item.adult ? 1 : 2}`,
      status: `${item.status},${item.cstatus}`,
      views: item.views,
      clicks: item.clicks,
      pops: item.pops,
      cpc: "$" + parseFloat(item.cpc).toFixed(2),
      budget: "$" + item.budget + ", rem:" + "$" + item.budget_rem,
      manage: "Manage",
    };
  });
};

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
      const id = params.id;
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
            <div className={styles.menuOptions}>
              <span
                className="block"
                onClick={() => changeStatusHelper(id, "run")}
              >
                Run
              </span>
              <span
                className="block"
                onClick={() => changeStatusHelper(id, "pause")}
              >
                Pause
              </span>
            </div>
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
              "pointer",
            ].join(" ")}
            onClick={() => modalHandler(params.id, budget[1])}
          >
            {budget[1]}
            <span className={styles.editIcon}>
              <Icon className={muiStyles.smallIcon}>edit</Icon>
            </span>
          </div>
        </Fragment>
      );
    }
    if (params.colDef.field == "manage") { 
      const pathParam = params.row.type.split(',')[0].toLowerCase() === 'pop' ? 'pop':'campaign';
      return (
        <Fragment>
          <Link 
            to={`/dashboard/edit-ad/${pathParam}/${params.id}`}>
            <Button
              color="primary"
              className={muiStyles.smallBtn}
              startIcon={<Icon>edit</Icon>}
            >
              Edit
            </Button>
          </Link>
          <Button
            color="secondary"
            className={muiStyles.smallBtn}
            startIcon={<Icon>delete</Icon>}
            onClick={() => changeStatusHelper(params.id, "delete", true)}
          >
            Delete
          </Button>
        </Fragment>
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
      {loading && !err && (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
      {!loading && !err && (
        <PaperBlock heading="Campaigns" fullWidth="true">
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
