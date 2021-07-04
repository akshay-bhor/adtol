import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export const AuthMenuItemsList = [
  {
    id: 21,
    title: "Dashboard",
    url: "/dashboard",
    icon: "dashboard",
  },
  {
    id: 22,
    title: "Logout",
    url: "/logout",
    icon: "logout",
  },
];

const AuthMenuItems = () => {
  return (
    <Fragment>
      {AuthMenuItemsList.map((item) => {
        return (
          <Link to={item.url} key={item.id}>
            <ListItem button>
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          </Link>
        );
      })}
    </Fragment>
  );
};

export default AuthMenuItems;
