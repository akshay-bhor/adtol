import {
  Box,
  Collapse,
  Divider,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; 
import { SidenavMenuItems } from "../../../constants/common";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
  menuContainer: {
    '@media(max-width: 1200px)': {
      maxHeight: '70vh'
    }
  },
  nested: {
    paddingLeft: "30px",
  },
  subNested: {
    paddingLeft: "60px",
  },
  active: {
    color: theme.palette.primary.main,
      '& .material-icons': {
        color: theme.palette.primary.main
      }
  }
}));

const NavLink = (props) => { 
  const { asPath: pathname } = useRouter();
  const muiStyles = useStyles();
  const isActive = props.exact ? pathname === props.to : pathname.startsWith(props.to);

  return (<Link 
    href={props.to} 
    onClick={props.onClick}
  >
    <a className={isActive ? muiStyles.active:''}>
      {props.children}
    </a>
  </Link>);
}

const DashboardNavMenu = (props) => {
  const muiStyles = useStyles();
  const [open, setOpen] = useState(false);

  // Expand Icons
  let expand = <Icon>expand_less</Icon>;
  if (!open) expand = <Icon>expand_more</Icon>;

  const handleClick = () => {
    setOpen(!open);
  };

  const toggleMobileDrawer = () => {
    if(props.toggleDrawer) props.toggleDrawer(false);
  }

  const preventRouting = (e) => {
    e.preventDefault();
  };

  return (
    <Box component="div" className={muiStyles.menuContainer}>
      {SidenavMenuItems.map((item) => {
        return (
          <div key={item.id}>
            <NavLink
              exact={true}
              to={item.url}
              onClick={item.disabled ? preventRouting : toggleMobileDrawer}
              className={({ isActive }) => (isActive ? muiStyles.active:'')}
            >
              <ListItem
                button
                className={item.nested ? muiStyles.nested : ""}
                onClick={item.child ? handleClick : null}
              >
                <ListItemIcon>
                  <Icon>{item.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={item.title} />
                {item.child ? expand : null}
              </ListItem>
            </NavLink>
            {item.child && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.childs.map((child) => {
                    return (
                      <NavLink
                        exact={true}
                        to={child.url} 
                        key={child.id} 
                        onClick={toggleMobileDrawer}
                      >
                        <ListItem button className={muiStyles.subNested}>
                          <ListItemIcon>
                            <Icon>{child.icon}</Icon>
                          </ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItem>
                      </NavLink>
                    );
                  })}
                </List>
              </Collapse>
            )}
            {item.divider ? <Divider /> : null}
          </div>
        );
      })}
    </Box>
  );
};

export default DashboardNavMenu;
