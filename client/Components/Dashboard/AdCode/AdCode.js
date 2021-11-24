import {
  Box,
  Button,
  Icon,
  IconButton,
  makeStyles,
  MenuItem,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Head from "next/head";
import * as yup from "yup";
import Loading from "../../UI/Loading";
import PaperBlock from "../Common/PaperBlock";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdCodes,
  fetchWebsites,
} from "../../../store/actions/websites.action";
import styles from "../Dashboard.module.css";
import {
  MySelectField,
  MySwitchField,
  MyTextField,
} from "../../FormUtils/FormUtils";
import AdCodeContainer from "./AdCodeContainer";
import { websiteActions } from "../../../store/reducers/websites.reducer";
import { fetchWebsiteFormData } from "../../../store/actions/formdata.action";
import TransferList from "../../FormUtils/TransferList";
import { linkRelList } from "../../../constants/common";

const useStyles = makeStyles((theme) => ({
  btnContainer: {
    display: "flex",
    justifyContent: "flex-end",
    flexBasis: "100%",
  },
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  switchBlock: {
    overflow: "hidden",
    margin: "8px auto",
  },
  fleft: {
    float: "left",
  },
  tooltipBtn: {
    padding: "10px",
  },
}));

const AdCode = () => {
  const websites = useSelector((state) => state.website.data);
  const loading = useSelector((state) => state.website.loading);
  const err = useSelector((state) => state.website.error);
  const webFetched = useSelector((state) => state.website.fetched);
  const categories = useSelector((state) => state.formdata.categories);
  const adCodes = useSelector((state) => state.website.adCodes);
  const [categoriesSelected, setCategoriesSelected] = useState();
  const dispatch = useDispatch();
  const muiStyles = useStyles();

  useEffect(() => {
    if (!webFetched) {
      dispatch(fetchWebsites());
    }

    dispatch(fetchWebsiteFormData());

    // Reset error
    return () => {
      dispatch(websiteActions.clearError());
      dispatch(websiteActions.clearAdCodes());
    };
  }, []);

  const submitForm = (data) => {
    if(data.rel == '' || data.rel == null) delete data.rel;
    data.category = categoriesSelected.length === categories.length ? '0':categoriesSelected.join(',');
    dispatch(fetchAdCodes(data));
  };

  const adCodeValidationSchema = yup.object({
    webid: yup.number().required("Website is required"),
    count: yup
      .number()
      .required("Count is required")
      .min(3, "Min count is 3")
      .max(12, "Max count is 12"),
    adult: yup.boolean(),
  });

  return (
    <Fragment>
      <Head>
        <title>AdCodes - AdTol</title>
      </Head>
      <Box component="div" className={muiStyles.btnContainer}>
        <Link href="/dashboard/websites/add">
          <a>
            <Button
              color="primary"
              className={"fright"}
              startIcon={<Icon>add</Icon>}
            >
              Add Website
            </Button>
          </a>
        </Link>
      </Box>
      <PaperBlock heading="Get Adcode" fullWidth="true">
        {loading && websites.length === 0 && categories.length === 0 && !err && (
          <div className={styles.loader}>
            <Loading />
          </div>
        )}

        {websites.length !== 0 && categories.length !== 0 && (
          <Formik
            initialValues={{
              webid: "",
              count: 3,
              adult: false,
              rel: ''
            }}
            validationSchema={adCodeValidationSchema}
            onSubmit={(values) => {
              submitForm(values);
            }}
          >
            <Form className={styles.fullWidthForm}>
              <MySelectField
                name="webid"
                label="Website"
                className={muiStyles.block}
              >
                {websites.map((website, idx) => {
                  return (
                    <MenuItem key={idx} value={website.id}>
                      {website.domain}
                    </MenuItem>
                  );
                })}
              </MySelectField>

              <MyTextField
                name="count"
                type="number"
                label="Widget Ad Count"
                className={muiStyles.block}
              />

              <Box component="div" className={muiStyles.block}>
                <Typography variant="subtitle1" className={'text-left mb-10'}>Choose Ad Categories</Typography>
                <TransferList 
                  list={categories}
                  selected={categories}
                  setState={setCategoriesSelected}
                />
              </Box>

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

              <div
                className={[muiStyles.block, muiStyles.switchBlock].join(" ")}
              >
                <MySwitchField
                  name="adult"
                  label="Adult"
                  className={muiStyles.fleft}
                />
                <span className={"fleft"}>
                  <Tooltip title="Chosing non adult for adult websites will have no effect on adult ad serving">
                    <IconButton
                      aria-label="info"
                      className={muiStyles.tooltipBtn}
                    >
                      <Icon>info</Icon>
                    </IconButton>
                  </Tooltip>
                </span>
              </div>

              <Button
                variant="contained"
                className={muiStyles.block}
                type="submit"
                color="primary"
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Get"}
              </Button>
            </Form>
          </Formik>
        )}

        {!loading && websites.length === 0 && webFetched && (
          <span className={"bold text-center"}>
            No websites found, please add atleast one website and try again!
          </span>
        )}
      </PaperBlock>

      {adCodes !== null && (
        <PaperBlock fullWidth={true}>
          <AdCodeContainer data={adCodes} />
        </PaperBlock>
      )}
    </Fragment>
  );
};

export default AdCode;
