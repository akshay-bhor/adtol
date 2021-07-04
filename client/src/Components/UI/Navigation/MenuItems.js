import {AuthMenuItemsList} from './AuthMenuItems';
import {UnAuthMenuItemsList} from './UnAuthMenuItems';
import {CommonMenuItemsList} from './CommonMenuItems';
import {DashboardMenuItemsList} from './DashboardMenuItems';
import styles from './Navbar.module.css';
import { useSelector } from 'react-redux';
import { Button, Icon, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
    navBtn: {
        marginLeft: '5px'
    }
});

const MenuItems = (props) => {
    const isAuth = useSelector(state => state.auth.loggedIn);
    const muistyle = useStyles();
    const onDashboard = props.path.search('/dashboard') !== -1 ? true:false;

    return (
        <div className={styles.mitems}>
                {!onDashboard && CommonMenuItemsList.map(item => { 
                    return <Link key={item.id} to={item.url} className={styles.mitem}>
                        {item.title}
                    </Link>
                })}
                {!onDashboard && isAuth && AuthMenuItemsList.map(item => { 
                    return <Button key={item.id} to={item.url} component={Link} className={muistyle.navBtn} variant="outlined" color="primary">
                        {item.title}
                    </Button>
                })}
                {!onDashboard && !isAuth && UnAuthMenuItemsList.map(item => { 
                    return <Button key={item.id} to={item.url} component={Link} className={muistyle.navBtn} variant="outlined" color="primary">
                        {item.title}
                    </Button>
                })}
                {onDashboard && DashboardMenuItemsList.map((item) => {
                    return <Tooltip title={item.title} key={item.id}><Link to={item.url} className={styles.mitem}><Icon>{item.icon}</Icon></Link></Tooltip>
                })}
        </div>
    )
}

export default MenuItems;