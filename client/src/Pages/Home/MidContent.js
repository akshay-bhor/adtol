import { Fragment } from "react";
import styles from "../Common/Content.module.css";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyle = makeStyles({
  btn: {
    marginTop: "10px",
  },
});

const MidContent = (props) => {
  const style = useStyle();
  return (
    <Fragment>
      <div className={styles[props.class]}>
        <h2 className={styles.content_heading}>{props.heading}</h2>
        <div className={styles.midinlinecontainer}>
          <div className={styles.imgcontainer}>
            <img src={props.img} alt="Adtol" />
          </div>
          <div className={styles.heading}>
            {props.subheading && <span className={styles.contentHeading}>{props.subheading}</span>}
            <span className={styles.subheading}>{props.children}</span>
            <div className={[styles.block, styles.mt_5].join(" ")}>
              <Button
                to={props.link}
                component={Link}
                className={[style.btn, style.block].join(" ")}
                variant="outlined"
                color="primary"
              >
                {props.btnText ? props.btnText:'Read More...'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MidContent;
