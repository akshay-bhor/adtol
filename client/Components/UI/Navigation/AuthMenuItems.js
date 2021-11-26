import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import Link from "next/link";

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

export default AuthMenuItems;
