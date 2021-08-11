import {
  Box,
  Chip,
  Grid,
  Icon,
  makeStyles,
  Paper,
  Tab,
  Tabs,
} from "@material-ui/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import PaperBlock from "../Dashboard/Common/PaperBlock";
import AccountDetailsForm from "./AccountDetailsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import PaymentDetailsForm from "./PaymentsDetailsForm";

const useStyles = makeStyles((theme) => ({
  acInfoContainer: {
    padding: "10px 20px",
  },
  acIconContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  acIcon: {
    fontSize: "120px",
    color: "#999",
  },
  acInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  tabContainer: {
    paddingLeft: '10px',
    borderRadius: '10px'
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  fullWidth: {
      width: '100%'
  }
}));

const tabProps = (index) => {
  return {
    id: `account-tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const Tabpanel = (props) => {
  const { children, value, index, className, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
      className={className}
    >
      {value === index && props.children}
    </div>
  );
};

const Account = () => {
  const muiStyles = useStyles();
  const userInfo = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="block mt-60 pl-10 pr-10">
      <PaperBlock fullWidth={true}>
        <Grid container>
          <Grid item xs={12} className={muiStyles.acInfoContainer}>
            <Grid container spacing={4}>
              <Grid item xs={3} className={muiStyles.acIconContainer}>
                <Icon className={muiStyles.acIcon}>account_circle</Icon>
              </Grid>
              <Grid item xs={9} className={muiStyles.acInfo}>
                <Box component="div">
                  <Box component="span" className="bold subtitle">
                    Username:
                  </Box>
                  <Box component="span" className="bold">
                    &nbsp;{userInfo.username}
                  </Box>
                </Box>
                <Box component="div">
                  <Box component="span" className="bold subtitle">
                    Email:
                  </Box>
                  <Box component="span" className="bold">
                    &nbsp;{userInfo.email}
                  </Box>
                </Box>
                <Box component="div">
                  <Chip className={muiStyles.success} label="Active" />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </PaperBlock>

      <Paper className={muiStyles.tabContainer}>
        <Tabs
          value={tabValue}
          onChange={(_, nval) => {
            setTabValue((_) => nval);
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Account Details" {...tabProps(0)} />
          <Tab label="Payment Details" {...tabProps(1)} />
          <Tab label="Change Password" {...tabProps(2)} />
        </Tabs>
      </Paper>

      <PaperBlock fullWidth={true}>
          <Tabpanel value={tabValue} index={0} className={muiStyles.fullWidth}>
            <AccountDetailsForm />
          </Tabpanel>
          <Tabpanel value={tabValue} index={1} className={muiStyles.fullWidth}>
            <PaymentDetailsForm />
          </Tabpanel>
          <Tabpanel value={tabValue} index={2} className={muiStyles.fullWidth}>
            <ChangePasswordForm />
          </Tabpanel>
      </PaperBlock>
    </div>
  );
};

export default Account;
