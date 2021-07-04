import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useState } from "react";

import styles from "./Modal.module.css";

const Modal = (props) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if(props.onClose) props.onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <div className={styles.content}>{props.children}</div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="secondary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
