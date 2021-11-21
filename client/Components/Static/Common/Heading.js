import { Fragment } from "react";
import styles from "./Content.module.css";
import Link from "next/link";
import { Button, makeStyles } from "@material-ui/core";

const useStyle = makeStyles({
    btn: {
        marginTop: '10px'
    }
});

const Heading = (props) => {
  const style = useStyle();
  return (
    <Fragment>
      <div className={styles.head_container}>
        <div className={styles.inlinecontainer}>
          <div className={styles.heading}>
            <h1 className={styles.h1}>{props.heading}</h1>
            <span className={styles.subheading}>
              {props.subheading}
            </span>
            <div className={[styles.block,styles.mt_5].join(' ')}>
              <Link href="/register">
                <a>
                  <Button className={[style.btn,style.block].join(' ')} variant="contained" color="primary">SIGN UP</Button>
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.imgcontainer}>
            <img src={props.headimg} className={styles.headimg} alt="Adtol" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Heading;
