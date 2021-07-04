import { Button, makeStyles, TextField } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCampaignBudget,
} from "../../../store/actions/campaigns.action";
import Modal from "../../UI/Modal";

const useStyles = makeStyles({
  input: {
    width: "250px",
    display: "block",
  },
  btn: {
    width: "250px",
    display: "block",
    height: "50px",
    marginTop: "15px",
  },
});

const EditBudgetModal = (props) => {
  const success = useSelector((state) => state.campaign.success);
  const loading = props.loading;
  const dispatch = useDispatch();
  const muiStyle = useStyles();

  useEffect(() => {
    if (success) {
      // Close modal on post success
      props.onClose();
    }
  }, [success]);

  const changeBudget = (values) => {
    const data = {};
    data.id = props.data.id;
    data.data = values;

    // Dispatch
    dispatch(updateCampaignBudget(data));
  };

  return (
    <Modal title="Change Remaining Budget" onClose={props.onClose}>
      <Formik
        initialValues={{
          budget: parseInt(props.data.budget.substring(6)),
        }}
        onSubmit={(values) => {
          changeBudget(values);
        }}
      >
        {({ values, handleBlur, handleChange }) => (
          <Form>
            <TextField
              name="budget"
              type="number"
              label="budget"
              variant="outlined"
              value={values.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              className={muiStyle.input}
              fullWidth={true}
              error={values.budget < 1 || values.budget > props.data.max}
              helperText={`Value must be between $1 and $${props.data.max}`}
            />
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              className={muiStyle.btn}
            >
              {loading ? "Please Wait..." : "Change"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditBudgetModal;
