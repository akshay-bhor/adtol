import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 500,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  block: {
    flexGrow: "1",
  },
  fullWidth: {
    width: "100%",
  },
  scroll: {
      display: "block",
      overflowY: "auto"
  },
  tabPanelContent: {
    marginBottom: '10px'
  }
}));

const TabPanel = (props) => {
    const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={"block"}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{props.children}</Box>}
    </div>
  );
};

const TabPanelContent = (props) => {
const classes = useStyles();

  return (
    <div className={classes.tabPanelContent}>
      <div className={"block"}>
        <Typography component="h3" variant="h6">
          {props.heading}
        </Typography>
      </div>
      <TextField
        type={"text"}
        className={props.className}
        variant="filled"
        value={props.value}
        multiline={true}
        onFocus={(e) => e.target.select()}
        rows={8}
        readOnly
      ></TextField>
    </div>
  );
};

const tabProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const AdCodeContainer = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Ad Codes"
        className={classes.tabs}
      >
        <Tab label="Text" {...tabProps(0)} />
        <Tab label="Pop" {...tabProps(1)} />
        <Tab label="Native" {...tabProps(2)} />
        <Tab label="Banner" {...tabProps(3)} />
        <Tab label="Widget" {...tabProps(4)} />
      </Tabs>
      <div className={[classes.block, classes.scroll].join(' ')}>
        <TabPanel value={value} index={0}>
          <TabPanelContent
            heading="Text Ad (CPC)[Recommended]"
            className={classes.fullWidth}
            value={props.data.text}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TabPanelContent
            heading="Pop Ad (CPM)"
            className={classes.fullWidth}
            value={props.data.pop}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TabPanelContent
            heading="Native Ad"
            className={classes.fullWidth}
            value={props.data.native}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          {Object.keys(props.data.banner).map((key) => {
            return (
              <TabPanelContent
                key={key}
                heading={key}
                className={classes.fullWidth}
                value={props.data.banner[key]}
              />
            );
          })}
        </TabPanel>
        <TabPanel value={value} index={4}>
          <TabPanelContent
            heading="Widget Ad"
            className={classes.fullWidth}
            value={props.data.feed}
          />
        </TabPanel>
      </div>
    </div>
  );
};

export default AdCodeContainer;
