import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export const DashboardMenuItemsList = [
  {
    id: 200,
    title: "Account",
    url: "/account",
    icon: "account_circle",
  },
  {
    id: 201,
    title: "Logout",
    url: "/logout",
    icon: "logout",
  },
];

const DashboardMenuItems = () => {
  return (
    <Fragment>
      {DashboardMenuItemsList.map((item) => {
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

export default DashboardMenuItems;
