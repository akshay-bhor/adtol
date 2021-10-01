import { Button, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { MyTextField } from "../../FormUtils/FormUtils";
import {
  updateCampaignBudget,
} from "../../../store/actions/campaigns.action";
import Modal from "../../UI/Modal";

const useStyles = makeStyles({
  input: {
    width: "100%"
  },
  btn: {
    width: "100%",
    display: "block",
    height: "50px",
    marginTop: "15px",
  },
});

const EditBudgetModal = (props) => { console.log(props.data);
  const success = useSelector((state) => state.campaign.success);
  const initBudget = parseInt(props.data.budget.trim().substring(5));
  const userBal = props.data.max;
  const loading = props.loading;
  const dispatch = useDispatch();
  const muiStyle = useStyles();

  useEffect(() => {
    if (success) {
      // Close modal on post success
      props.onClose();
    }
  }, [success]);

  const validationSchema = yup.object({
    budget: yup.number().required('Budget is required').min(1, 'Min budget value is $1')
    .max((userBal + initBudget), `Max budget exceeds available balance, allowed $${(userBal + initBudget)}`)
  });

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
          budget: initBudget
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          changeBudget(values);
        }}
      >
          <Form>
            <MyTextField
              name="budget"
              type="number"
              label="budget"
              className={muiStyle.input}
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
      </Formik>
    </Modal>
  );
};

export default EditBudgetModal;
