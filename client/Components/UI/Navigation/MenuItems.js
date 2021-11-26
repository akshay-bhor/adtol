import {AuthMenuItemsList} from './AuthMenuItems';
import {UnAuthMenuItemsList} from './UnAuthMenuItems';
import {CommonMenuItemsList} from './CommonMenuItems';
import {DashboardMenuItemsList} from './DashboardMenuItems';
import styles from './Navbar.module.css';
import { useSelector } from 'react-redux';
import { Button, Icon, makeStyles } from '@material-ui/core';
import Link from "next/link";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    navBtn: {
        marginLeft: '5px',
        borderColor: theme.palette.primary.contrast,
        color: theme.palette.primary.contrast,
    }
}));

const MenuItems = (props) => {
    const isAuth = useSelector(state => state.auth.loggedIn);
    const muistyle = useStyles();
    const onDashboard = props.path.search('/dashboard') !== -1 ? true:false;

    return (
        <div className={styles.mitems}>
                {!onDashboard && CommonMenuItemsList.map(item => { 
                    return <Link key={item.id} href={item.url}>
                                <a className={styles.mitem}>{item.title}</a>
                            </Link>
                })}
                {!onDashboard && isAuth && AuthMenuItemsList.map(item => { 
                    return (<Link key={item.id} href={item.url}>
                                <a>
                                    <Button className={muistyle.navBtn} variant="outlined">
                                        {item.title}
                                    </Button>
                                </a>
                            </Link>)
                })}
                {!onDashboard && !isAuth && UnAuthMenuItemsList.map(item => { 
                    return (<Link key={item.id} href={item.url}>
                                <a>
                                    <Button  className={muistyle.navBtn} variant="outlined">
                                        {item.title}
                                    </Button>
                                </a>
                            </Link>)
                })}
                {onDashboard && DashboardMenuItemsList.map((item) => {
                    return (<Tooltip title={item.title} key={item.id}>
                                <Link href={item.url}>
                                    <a className={styles.mitem}>
                                        <Icon>{item.icon}</Icon>
                                    </a>
                                </Link>
                            </Tooltip>)
                })}
        </div>
    )
}

export default MenuItems;