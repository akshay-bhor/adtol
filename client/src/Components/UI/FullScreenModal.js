import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Icon,
  IconButton,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { forwardRef, useState } from "react";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenModal = (props) => {
  const [open, setOpen] = useState(true);
  const muiStyles = useStyles();

  const handleClose = () => {
    setOpen(false);
    if (props.onClose) props.onClose();
  };

  const handleSave = () => {
    setOpen(false);
    if (props.onSave) props.onSave();
    if (props.onClose) props.onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      fullScreen
      TransitionComponent={Transition}
    >
      <AppBar className={muiStyles.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Icon>close</Icon>
          </IconButton>
          <Typography variant="h6" className={muiStyles.title}>
            {props.title}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>{props.children}</DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
