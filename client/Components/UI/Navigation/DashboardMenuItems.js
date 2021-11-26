import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import Link from "next/link";

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
          <Link href={item.url} key={item.id}>
            <a>
              <ListItem button>
                <ListItemIcon>
                  <Icon>{item.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </a>
          </Link>
        );
      })}
    </Fragment>
  );
};

export default DashboardMenuItems;
