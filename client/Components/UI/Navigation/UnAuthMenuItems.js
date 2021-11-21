import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import Link from "next/link";

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
          <Link href={item.url}>
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

export default UnAuthMenuItems;
