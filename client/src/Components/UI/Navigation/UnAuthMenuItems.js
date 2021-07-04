import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export const UnAuthMenuItemsList = [
  {
    id: 41,
    title: "Login",
    url: "/login",
    icon: "lock_open",
  },
  {
    id: 42,
    title: "Register",
    url: "/register",
    icon: "assignment_ind",
  },
];

const UnAuthMenuItems = () => {
  return (
    <Fragment>
      {UnAuthMenuItemsList.map((item) => {
        return (
          <Link to={item.url}>
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

export default UnAuthMenuItems;
