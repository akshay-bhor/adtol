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
import { Link } from "react-router-dom";
import { SidenavMenuItems } from "./SidenavMenuItemsList";
import List from "@material-ui/core/List";

const useStyles = makeStyles({
  nested: {
    paddingLeft: "30px",
  },
  subNested: {
    paddingLeft: "60px",
  },
});

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
            <Link
              to={item.url}
              onClick={item.disabled ? preventRouting : null}
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
            </Link>
            {item.child && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.childs.map((child) => {
                    return (
                      <Link to={child.url} key={child.id}>
                        <ListItem button className={muiStyles.subNested}>
                          <ListItemIcon>
                            <Icon>{child.icon}</Icon>
                          </ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItem>
                      </Link>
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
