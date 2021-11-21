import { makeStyles, Paper, Typography } from "@material-ui/core";
import styles from "./common.module.css";

const useStyles = makeStyles((theme) => ({
  container: {
    color: "#fff",
    padding: "15px",
    width: "100%",
    borderRadius: "10px",
    backgroundColor: theme.palette.primary.main,
    marginBottom: "25px",
  },
}));

const PaperBlockPrimary = (props) => {
  const muiStyles = useStyles();

  return (
    <Paper elevation={2} className={muiStyles.container}>
      <Typography variant="h5" component="h3">
        {props.heading}
      </Typography>
      <div className={styles.container}>
        {props.children}
      </div>
    </Paper>
  );
};

export default PaperBlockPrimary;
