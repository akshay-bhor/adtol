import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
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
                else {
                    localStorage.setItem('hideUserStatusNotification', true);
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
                        <Link href="/dashboard/campaign-types"><a className="fright link">Add</a></Link>
                    </Alert>}

                {!userStatus.hasPay && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        You haven't added Payment details yet
                        <Link href="/account"><a className="fright link">Add</a></Link>
                    </Alert>}

                {!userStatus.hasWeb && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        You haven't added any Websites yet
                        <Link href="/dashboard/websites/add"><a className="fright link">Add</a></Link>
                    </Alert>}

                {userStatus.isLow && 
                    <Alert severity="warning" className={muiStyles.fullWidth}>
                        Your account has low balance
                        <Link href="/dashboard/billing/deposit"><a className="fright link">Add</a></Link>
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