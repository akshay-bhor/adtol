import {
  Collapse,
  Divider,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { SidenavMenuItems } from "../../../constants/common";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
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

const SidenavMenu = () => {
  const muiStyles = useStyles();
  const [open, setOpen] = useState(false);

  // Expand Icons
  let expand = <Icon>expand_less</Icon>;
  if (!open) expand = <Icon>expand_more</Icon>;

  const handleClick = () => {
    setOpen(!open);
  };

  const preventRouting = (e) => {
    e.preventDefault();
  };

  return (
    <Fragment>
      {SidenavMenuItems.map((item) => {
        return (
          <div key={item.id}>
            <NavLink exact
              to={item.url}
              onClick={item.disabled ? preventRouting : null}
              activeClassName={muiStyles.active}
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
                      <NavLink exact
                        to={child.url} 
                        key={child.id} 
                        activeClassName={muiStyles.active}
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
    </Fragment>
  );
};

export default SidenavMenu;
