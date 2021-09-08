import { makeStyles, Paper } from "@material-ui/core";
import SidenavMenu from "./SidenavMenu";

const useStyles = makeStyles((theme) => ({
    sidenav: {
        height: '100vh',
        paddingTop: '60px',
        width: '250px',
        position: 'fixed',
        top: '0',
        left: '0',
        overflowX: 'auto'
    }
}));

const Sidenav = () => {
    const muiStyles = useStyles();

    return (
        <Paper elevation={1} className={muiStyles.sidenav}>
            <SidenavMenu />
        </Paper>
    );
}

export default Sidenav;