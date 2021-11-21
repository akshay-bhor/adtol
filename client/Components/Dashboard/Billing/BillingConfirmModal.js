import { Button, Grid, makeStyles } from "@material-ui/core";
import Modal from "../../UI/Modal";

const useStyles = makeStyles({
    btnContainer: {
      marginTop: "10px",
      display: "flex",
      justifyContent: "flex-start",
    },
    gridLeft: {
      color: "#666",
      textAlign: "left",
      fontSize: "120%",
      paddingBottom: "10px",
    },
    gridRight: {
      fontWeight: "600",
      fontSize: "125%",
      textAlign: "right",
      paddingBottom: "10px",
    },
  });

const BillingConfirmModal = (props) => {
    const muiStyles = useStyles();

    return (
        <Modal title="Review" onClose={() => props.handleModalToggle(false)}>
          <Grid container>
            <Grid item xs={6} className={muiStyles.gridLeft}>
              Amount
            </Grid>
            <Grid item xs={6} className={muiStyles.gridRight}>
              ${props.formData.amt}
            </Grid>
            <Grid item xs={6} className={muiStyles.gridLeft}>
              Processor
            </Grid>
            <Grid item xs={6} className={muiStyles.gridRight}>
              {props.processors[props.formData.processor - 1].title}
            </Grid>
            <Grid item xs={12} className={muiStyles.btnContainer}>
              <Button
                variant="contained"
                color="primary"
                disabled={props.loading}
                onClick={props.submitForm}
              >
                {props.loading ? "Please Wait..." : "Confirm"}
              </Button>
            </Grid>
          </Grid>
        </Modal>
    );
}

export default BillingConfirmModal;