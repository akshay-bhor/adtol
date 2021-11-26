import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { useSelector } from "react-redux";
import AuthMenuItems from "./AuthMenuItems";
import UnAuthMenuItems from "./UnAuthMenuItems";
import CommonMenuItems from "./CommonMenuItems";
import DashboardMenuItems from "./DashboardMenuItems";

const useStyles = makeStyles({
  list: {
    width: 250,
  }
});

const Sidebar = (props) => {
  const classes = useStyles();
  const isAuth = useSelector((state) => state.auth.loggedIn);

  // Check ios
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  let menuItems;
  if (isAuth) menuItems = <AuthMenuItems />;
  else menuItems = <UnAuthMenuItems />;

  if(props.path.search('/dashboard') !== -1) menuItems = <DashboardMenuItems />

  const list = () => {
    return (<div
      className={classes.list}
      role="presentation"
      onClick={props.toggleDrawer}
      onKeyDown={props.toggleDrawer}
    >
      <List>
        <CommonMenuItems />
      </List>
      <Divider />
      <List>{menuItems}</List>
    </div>);
  }

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor={props.anchor}
      open={props.drawerState}
      onClose={props.toggleDrawer}
      onOpen={props.toggleDrawer}
    >
      {list()}
    </SwipeableDrawer>
  );
};

export default Sidebar;
