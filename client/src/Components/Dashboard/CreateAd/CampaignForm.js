import {
  Box,
  Button,
  Grid,
  Icon,
  makeStyles,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { Form } from "formik";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { linkRelList, weekDaysList } from "../../../constants/common";
import {
  MySelectField,
  MySwitchField,
  MyTextField,
} from "../../FormUtils/FormUtils";
import TransferList from "../../FormUtils/TransferList";
import PaperBlock from "../Common/PaperBlock";
import BannersListModal from "./BannersListModal";

const useStyles = makeStyles((theme) => ({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  btn: {
    float: "left",
    alignSelf: "flex-start",
    minWidth: "190px",
    marginTop: "10px",
  },
  link: {
    color: theme.palette.primary.main,
  },
  fullWidth: {
    width: "100%",
  },
  formGroup: {
    margin: "15px auto",
  },
  label: {
    fontSize: "1.4em",
    fontWeight: "500",
  },
  paperBlock: {
    display: "block",
    padding: "15px",
    borderRadius: "10px",
    margin: "15px 0",
    width: "100%",
    ["@media(max-width:780px)"]: {
      margin: "10px 0",
    },
  },
}));

export const CampaignForm = ({ 
    type, 
    edit, 
    banners,
    setBanners,
    categoriesList,
    setCategories, 
    languagesList,
    setLanguages, 
    devicesList,
    setDevices, 
    countriesList,
    setCountries, 
    osList,
    setOs, 
    browsersList,
    setBrowsers, 
    daysList,
    setDays,
    trafficEstModalToggle
  }) => {
  const muiStyles = useStyles();
  const loading = false;
  const [modalOpen, setModalOpen] = useState(false);
  const timezones = useSelector((state) => state.formdata.timezones);
  const categories = useSelector((state) => state.formdata.categories);
  const languages = useSelector((state) => state.formdata.languages);
  const countries = useSelector((state) => state.formdata.countries);
  const devices = useSelector((state) => state.formdata.devices);
  const os = useSelector((state) => state.formdata.os);
  const browsers = useSelector((state) => state.formdata.browsers);
  const btns = useSelector((state) => state.formdata.btns);

  const saveBanners = (bannerIds) => {
    setBanners(_ => bannerIds);
  }

  const modalToggle = () => {
    setModalOpen(prev => !prev);
  }

  return (
    <Fragment>
      <Form className={muiStyles.fullWidth}>
        <PaperBlock heading={"General"} fullWidth={true} headingCenter={true}>
          <MyTextField
            name="campaign_name"
            type="text"
            label="Campaign Name"
            className={muiStyles.block}
          />
          <MyTextField
            name="title"
            type="text"
            label="Ad Title"
            className={muiStyles.block}
          />
          <MyTextField
            name="url"
            type="text"
            label="URL"
            placeholder="Enter with http:// or https://"
            className={muiStyles.block}
          />
          <MyTextField
            name="desc"
            type="text"
            label="Ad Description"
            multiline={true}
            className={muiStyles.block}
          />
        </PaperBlock>

        {type === "campaign" && (
          <Paper elevation={2} className={muiStyles.paperBlock}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography className={muiStyles.label}>Banners</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" className="fright">
                  <Button
                    onClick={modalToggle}
                    color="primary"
                    startIcon={<Icon>{edit || banners.length > 0 ? "edit" : "add"}</Icon>}
                  >
                    {edit || banners.length > 0 ? "Edit Banners" : "Choose Banners"}
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <PaperBlock heading={"Targeting"} fullWidth={true} headingCenter={true}>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>Categories</Typography>
            <TransferList selected={categoriesList} list={categories} setState={setCategories} />
          </Box>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>Countries</Typography>
            <TransferList selected={countriesList} list={countries} setState={setCountries} />
          </Box>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>Devices</Typography>
            <TransferList selected={devicesList} list={devices} setState={setDevices} />
          </Box>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>OS</Typography>
            <TransferList selected={osList} list={os} setState={setOs} />
          </Box>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>Browser</Typography>
            <TransferList selected={browsersList} list={browsers} setState={setBrowsers} />
          </Box>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>Languages</Typography>
            <TransferList selected={languagesList} list={languages} setState={setLanguages} />
          </Box>
          <Box component="div" className={muiStyles.formGroup}>
            <Typography className={muiStyles.label}>Days</Typography>
            <TransferList selected={daysList} list={weekDaysList} setState={setDays} />
          </Box>
        </PaperBlock>

        <PaperBlock heading="Configuration" fullWidth={true} headingCenter={true}>
          <MySelectField
            name="timezone"
            label="Timezone"
            className={muiStyles.block}
          >
            {timezones.map((tz) => {
              return (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              );
            })}
          </MySelectField>
          <MyTextField
            name="cpc"
            type="number"
            step="0.01"
            min="0.01"
            label="CPC"
            placeholder="Cost per Click"
            className={muiStyles.block}
          />
          <MyTextField
            name="budget"
            type="number"
            step="0.01"
            min="0.01"
            label="Budget"
            className={muiStyles.block}
          />
          <MyTextField
            name="daily_budget"
            type="number"
            step="0.01"
            min="0.01"
            label="Daily Budget"
            className={muiStyles.block}
          />
          {type === "campaign" && (
            <Fragment>
              <MySelectField 
                name="btn"
                label="Button"
                className={muiStyles.block}
              >
                {btns.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </MySelectField>
              <MySelectField 
                name="rel"
                label="Follow"
                className={muiStyles.block}
              >
                {linkRelList.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </MySelectField>
            </Fragment>)}
          <MySwitchField
            name="adult"
            label="Adult"
            className={muiStyles.block}
          />
          {!edit && <MySwitchField
            name="run"
            label="Run After Approval?"
            className={muiStyles.block}
          />}

          <Grid container className={muiStyles.block} spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                className={muiStyles.fullWidth}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                className={muiStyles.fullWidth}
                onClick={trafficEstModalToggle}
              >
                Traffic Estimation
              </Button>
            </Grid>
          </Grid>
        </PaperBlock>
      </Form>
      
      {modalOpen ? <BannersListModal 
        banners={banners}
        onClose={modalToggle}
        onSave={saveBanners}
      />:null}

    </Fragment>
  );
};

export default CampaignForm;
