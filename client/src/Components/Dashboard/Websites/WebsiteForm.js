import { Button, makeStyles, MenuItem } from "@material-ui/core";
import { Form } from "formik";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsiteFormData } from "../../../store/actions/formdata.action";
import { websiteActions } from "../../../store/reducers/websites.reducer";
import { MySelectField, MyTextField } from "../../FormUtils/FormUtils";
import styles from "../Dashboard.module.css";

const useStyles = makeStyles({
  block: {
    width: "60%",
    margin: "15px auto",
    ["@media(max-width:780px)"]: {
      width: "100%",
    },
  },
  btn: {
    float: "left",
    minWidth: "190px",
    marginTop: "10px",
  },
});

const WebsiteForm = (props) => {
  const categories = useSelector((state) => state.formdata.categories);
  const languages = useSelector((state) => state.formdata.languages);
  const loading = useSelector((state) => state.website.loading);
  const muiStyles = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (categories.length === 0 || languages.length === 0) {
      dispatch(fetchWebsiteFormData());
    }

    // Reset error
    return () => {
        dispatch(websiteActions.clearError());
    }
  }, []);

  return (
    <Fragment>
      {categories.length !== 0 && languages.length !== 0 && (
        <Form className={styles.fullWidthForm}>
          <MyTextField
            name="domain"
            type="text"
            label="Domain Name"
            className={muiStyles.block}
          />

          <MySelectField
            name="category"
            label="Category"
            className={muiStyles.block}
          >
            {categories.map((category, idx) => {
              return (
                <MenuItem key={idx} value={category.name}>
                  {category.name}
                </MenuItem>
              );
            })}
          </MySelectField>

          <MySelectField
            name="language"
            label="Language"
            className={muiStyles.block}
          >
            {languages.map((language, idx) => {
              return (
                <MenuItem key={idx} value={language.name}>
                  {language.name}
                </MenuItem>
              );
            })}
          </MySelectField>

          <MyTextField
            name="traffic"
            type="number"
            label="Daily Traffic"
            className={muiStyles.block}
          />

          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={
              loading || categories.length === 0 || languages.length === 0
            }
            className={muiStyles.block}
          >
            {loading ? "Please Wait..." : props.edit ? "Update" : "Add"}
          </Button>
        </Form>
      )}
    </Fragment>
  );
};

export default WebsiteForm;
