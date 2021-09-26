import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../../../UI/Modal";

const useStyles = makeStyles(theme => ({
    fullWidth: {
        flexBasis: '100%',
        marginBottom: '10px',
        '& .MuiAlert-message': {
            flexGrow: '1'
        },
        '& .link': {
            color: theme.palette.primary.main
        }
    },
    action: {
        marginLeft: 'auto'
    }
}));

const UserStatusNotification = () => {
    const userStatus = useSelector((state) => state.summary.userStatus);
    const [open, setOpen] = useState(false);
    const muiStyles = useStyles();

    useEffect(() => {
        if(Object.keys(userStatus).length !== 0) {
            // get user preference
            const hideNotification = localStorage.getItem('hideUserStatusNotification');
            if(!hideNotification) {
                if(!userStatus.hasCamp || !userStatus.hasPay || !userStatus.hasWeb || userStatus.isLow) {
                    setOpen(_ => true);
                }
            }
        }
    }, [userStatus]);

    const handleClose = () => {
        setOpen(_ => false);
    }

    const hideNotification = () => {
        localStorage.setItem('hideUserStatusNotification', true);
        handleClose();
    }

    return (
        <Fragment>
            {open && <Modal 
                title="Alert"
                maxWidth="md"
                onClose={handleClose}
            >
                {!userStatus.hasCamp && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        You haven't added any campaigns yet
                        <Link className="fright link" to="/dashboard/campaign-type">Add</Link>
                    </Alert>}

                {!userStatus.hasPay && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        You haven't added Payment details yet
                        <Link className="fright link" to="/account">Add</Link>
                    </Alert>}

                {!userStatus.hasWeb && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        You haven't added any Websites yet
                        <Link className="fright link" to="/dashboard/websites/add">Add</Link>
                    </Alert>}

                {userStatus.isLow && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        Your account has low balance
                        <Link className="fright link" to="/dashboard/billing/deposit">Add</Link>
                    </Alert>}  

                <Grid item xs={12} component="div">
                    <Typography className="text-center mt-15 pointer" color="error" variant="subtitle1" onClick={hideNotification}>
                        Don't show this message again!
                    </Typography>
                </Grid>
            </Modal>}
        </Fragment>
    );
}

export default UserStatusNotification;