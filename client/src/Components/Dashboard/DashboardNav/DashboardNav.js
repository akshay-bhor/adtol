import { Drawer, Fab, Icon, makeStyles, Paper } from "@material-ui/core";
import { Fragment, useState } from "react";
import DashboardNavMenu from "./DashboardNavMenu";

const useStyles = makeStyles((theme) => ({
    sidenav: {
        height: '100vh',
        paddingTop: '60px',
        width: '250px',
        position: 'fixed',
        top: '0',
        left: '0',
        overflowX: 'auto',
        '@media(max-width:1200px)': {
            width: 0,
            position: 'unset',
            display: 'none'
        }
    },
    fabMenu: {
        position: "fixed",
        bottom: '10px',
        right: '10px',
        zIndex: '10',
        '@media(min-width:1201px)': {
            position: 'unset',
            display: 'none'
        }
    },
    smallIcon: {
        fontSize: '1.4em'
    }
}));

const DashboardNav = () => {
    const muiStyles = useStyles();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (state) => {
        setOpen(_ => state);
    }

    return (
        <Fragment>
            <Paper elevation={1} className={muiStyles.sidenav}>
                <DashboardNavMenu />
            </Paper>
            <Fab color="primary" 
                size="small" 
                aria-label="dashboard menu" 
                className={muiStyles.fabMenu}
                onClick={() => {
                    toggleDrawer(true);
                }}
            >
                <Icon className={muiStyles.smallIcon}>menu</Icon>
            </Fab>
            <Drawer 
                anchor={'bottom'} 
                open={open} 
                onClose={() => {
                    toggleDrawer(false);
                }}
            >
                <DashboardNavMenu isMobile={true} toggleDrawer={toggleDrawer} />
            </Drawer>
        </Fragment>
    );
}

export default DashboardNav;