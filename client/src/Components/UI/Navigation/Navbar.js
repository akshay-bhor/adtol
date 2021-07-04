import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import styles from "./Navbar.module.css";
import { makeStyles } from '@material-ui/core/styles';
import MenuItems from './MenuItems';
import IconButton from '@material-ui/core/IconButton';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import Sidebar from './Sidebar';
import { Link, useLocation } from "react-router-dom";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const useStyles = makeStyles({
  container: {
    width: '80%',
    margin: 'auto',
    fontSize: '18px',
    color: 'rgba(0, 0, 0, 0.54)',
    minHeight: '54px',
    justifyContent: 'flex-start',
    ['@media(max-width:780px)']: {
      width: '100%'
    }
  },
  navbar: {
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderBottom: '1px solid #ccc'  
  },
  menuButton: {
    marginRight: '10px',
    ['@media(min-width:780px)']: {
      display: 'none'
    }
  }
});

const Navbar = (props) => {
  const [drawerState, setDrawerState] = useState(false);
  const location = useLocation();
  let currPath = location.pathname;

  const toggleDrawer = (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setDrawerState(prevState => !prevState);
  }

  const muistyle = useStyles();
  return (
    <Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar className={muistyle.navbar}>
          <Toolbar className={muistyle.container}>
            <IconButton edge="start" className={muistyle.menuButton} onClick={toggleDrawer} color="inherit" aria-label="menu">
              <MenuRoundedIcon />
            </IconButton>
              <Link to='/'><div className={styles.brand_name}>{props.name}</div></Link>
              <MenuItems path={currPath}></MenuItems>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Sidebar path={currPath} anchor='left' drawerState={drawerState} toggleDrawer={toggleDrawer}></Sidebar>
    </Fragment>
  );
}

export default Navbar;
