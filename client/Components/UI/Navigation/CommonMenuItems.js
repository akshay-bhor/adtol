import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Fragment } from "react";
import Link from "next/link";

export const CommonMenuItemsList = [
  {
    id: 1,
    title: "Advertisers",
    url: "/advertiser",
    icon: "cast",
  },
  {
    id: 2,
    title: "Publishers",
    url: "/publisher",
    icon: "live_tv",
  },
  {
    id: 3,
    title: "Affiliate",
    url: "/affiliate",
    icon: "link",
  },
];

const CommonMenuItems = () => {
  return (
    <Fragment>
      {CommonMenuItemsList.map((item) => {
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

export default CommonMenuItems;
