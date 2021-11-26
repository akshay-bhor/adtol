import { Fragment } from "react";
import styles from "./Content.module.css";
import { Icon, makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  bigicon: {
    fontSize: "36px",
    color: theme.palette.primary.main,
  },
}));

const PointList = (props) => {
  const muistyles = useStyle();

  return (
    <Fragment>
      <div className={styles.key_container}>
        <div className={styles.bottominlinecontainer}>

          {props.points.map((item) => (
            <div className={styles.adv_container} key={item.id}>
              <div className={styles.icon}>
                <Icon className={muistyles.bigicon}>{item.icon}</Icon>
              </div>
              <div className={styles.adv_content}>
                <div className={styles.bold}>{item.heading}</div>
                <div className={styles.normal}>
                  {item.text}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </Fragment>
  );
};

export default PointList;
